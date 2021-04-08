import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { err, ok, Result } from 'neverthrow';

import { JwtPayload, JwtDecoded } from '../models';
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

  generateToken({ type, payload }: TokenProps): string {
    return jwt.sign(payload, type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: type === 'access' ? process.env.ACCESS_TOKEN_LIFETIME : process.env.REFRESH_TOKEN_LIFETIME,
      audience: Config.WEB_URL
    });
  }

  getDecoded(token: string): Result<JwtDecoded, CustomError> {
    try {
      const verified = jwt.decode(token) as JwtDecoded;
      return ok(verified);
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  async getVerified({ type, token }: VerifyProps): Promise<Result<JwtDecoded, CustomError>> {
    try {
      const verified = jwt.verify(
        token,
        type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET,
        {
          audience: Config.WEB_URL
        }
      ) as JwtDecoded;

      // checking in the DB for real existing of data
      if (type === 'access') {
        const user = await User.findByPk(verified.userId, { attributes: ['id'] });
        if (user) {
          return ok(verified);
        } else {
          return err(new NotFoundError('No user registered'));
        }
      } else {
        const session = await UserSession.findByPk(verified.sessionId, { attributes: ['id'] });
        if (session) {
          return ok(verified);
        } else {
          return err(new NotAuthorizedError('No session registered'));
        }
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }
}
