import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { Service } from 'typedi';

import { JwtPayload, JwtDecoded, User, UserSession } from '../models';
import { Config } from '../config';

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

  getDecoded(token: string): Promise<JwtDecoded> {
    return new Promise((resolve, reject) => {
      try {
        const verified = jwt.decode(token) as JwtDecoded;
        resolve(verified);
      } catch (error) {
        reject(error);
      }
    });
  }

  getVerified({ type, token }: VerifyProps): Promise<JwtDecoded | TokenExpiredError> {
    return new Promise((resolve, reject) => {
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
          User.findByPk(verified.userId, { attributes: ['id'] })
            .then((user) => {
              if (user) {
                resolve(verified);
              } else {
                reject({ success: false, message: 'no user registered' });
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          UserSession.findByPk(verified.sessionId, { attributes: ['id'] })
            .then((session) => {
              if (session) {
                resolve(verified);
              } else {
                reject({ success: false, message: 'no session registered' });
              }
            })
            .catch((error) => {
              reject(error);
            });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
