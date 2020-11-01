import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

import { JwtPayload, JwtDecoded, User, UserSession, BaseResponse } from '../models';
import { Config } from '../config';
import { err, ok, Result } from 'neverthrow';

interface TokenProps {
  type: 'access' | 'refresh';
  payload: JwtPayload;
}

interface VerifyProps {
  type: 'access' | 'refresh';
  token: string;
}

@Service({ global: true })
export class JwtHelper {
  generateToken({ type, payload }: TokenProps): string {
    return jwt.sign(payload, type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: type === 'access' ? process.env.ACCESS_TOKEN_LIFETIME : process.env.REFRESH_TOKEN_LIFETIME,
      audience: Config.WEB_URL
    });
  }

  getDecoded(token: string): Result<JwtDecoded, string> {
    try {
      const verified = jwt.decode(token) as JwtDecoded;
      return ok(verified);
    } catch (error) {
      return err(error);
    }
  }

  async getVerified({ type, token }: VerifyProps): Promise<Result<JwtDecoded, BaseResponse>> {
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
          return err({ success: false, message: 'No user registered' });
        }
      } else {
        const session = await UserSession.findByPk(verified.sessionId, { attributes: ['id'] });
        if (session) {
          ok(verified);
        } else {
          err({ success: false, message: 'No session registered' });
        }
      }
    } catch (error) {
      err({ success: false, message: error.message });
    }
  }
}
