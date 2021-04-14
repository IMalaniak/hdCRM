import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { err, ok, Result } from 'neverthrow';

import { JwtData, JwtPayload } from '../models';
import { Config } from '../config';
import { CustomError, NotFoundError, NotAuthorizedError, InternalServerError } from '../errors';
import { Logger } from '../utils/Logger';
import { User, UserSession } from '../repositories';

import { CryptoUtils } from './crypto.utils';

type TokenType = 'access' | 'refresh';

interface TokenProps {
  type: TokenType;
  data: JwtData;
}

interface VerifyProps {
  type: TokenType;
  token: string;
}

@Service()
export class JwtUtils {
  constructor(private readonly logger: Logger, private readonly crypt: CryptoUtils) {}

  generateToken({ type, data }: TokenProps): string {
    const payload = { sub: this.crypt.jsonToBase64(data) } as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return jwt.sign(payload, type === 'access' ? process.env.ACCESS_TOKEN_SECRET! : process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: type === 'access' ? process.env.ACCESS_TOKEN_LIFETIME : process.env.REFRESH_TOKEN_LIFETIME,
      audience: Config.WEB_URL
    });
  }

  getDecoded(token: string): Result<JwtData, CustomError> {
    try {
      const verified = jwt.decode(token) as JwtPayload;
      return ok(this.crypt.base64ToJson<JwtData>(verified.sub));
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  async getVerified({ type, token }: VerifyProps): Promise<Result<JwtData, CustomError>> {
    try {
      const verified = jwt.verify(
        token,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        type === 'access' ? process.env.ACCESS_TOKEN_SECRET! : process.env.REFRESH_TOKEN_SECRET!,
        {
          audience: Config.WEB_URL
        }
      ) as JwtPayload;
      const decoded = this.crypt.base64ToJson<JwtData>(verified.sub);

      // checking in the DB for real existing of data
      if (type === 'access') {
        const user = await User.findByPk(decoded.userId, { attributes: ['id'] });
        if (user) {
          return ok(decoded);
        } else {
          return err(new NotFoundError('No user registered'));
        }
      } else {
        const session = await UserSession.findByPk(decoded.sessionId, { attributes: ['id'] });
        if (session) {
          return ok(decoded);
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
