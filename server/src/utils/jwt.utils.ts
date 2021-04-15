import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { err, ok, Result } from 'neverthrow';

import { JwtPayload } from '../models';
import { Config } from '../config';
import { CustomError, NotFoundError, NotAuthorizedError, InternalServerError } from '../errors';
import { Logger } from '../utils/Logger';
import { User, UserSession } from '../repositories';

interface TokenProps {
  type: 'access' | 'refresh';
  payload: JwtPayload;
}

interface VerifyProps {
  type: 'access' | 'refresh';
  token: string;
}

@Service()
export class JwtUtils {
  constructor(private readonly logger: Logger) {}

  sign({ type, payload }: TokenProps): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return jwt.sign(payload, type === 'access' ? process.env.ACCESS_TOKEN_SECRET! : process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: type === 'access' ? process.env.ACCESS_TOKEN_LIFETIME : process.env.REFRESH_TOKEN_LIFETIME,
      audience: Config.WEB_URL
    });
  }

  decode(token: string): Result<JwtPayload, CustomError> {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return ok(decoded);
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  async verifyAndGetSubject({ type, token }: VerifyProps): Promise<Result<User | UserSession, CustomError>> {
    try {
      const verified = jwt.verify(
        token,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        type === 'access' ? process.env.ACCESS_TOKEN_SECRET! : process.env.REFRESH_TOKEN_SECRET!,
        {
          audience: Config.WEB_URL
        }
      ) as JwtPayload;

      // checking in the DB for real existing of data
      if (type === 'access') {
        const user = await User.findByPk(verified.sub, { attributes: ['id'] });
        if (user) {
          return ok(user);
        } else {
          return err(new NotFoundError('No user registered'));
        }
      } else {
        const session = await UserSession.findByPk(verified.sub, { attributes: ['id', 'UserId'] });
        if (session) {
          return ok(session);
        } else {
          return err(new NotAuthorizedError('No session registered'));
        }
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }
}
