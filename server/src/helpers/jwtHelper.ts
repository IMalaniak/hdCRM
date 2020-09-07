import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload, JwtDecoded } from '../models/JWTPayload';
import { UserDBController } from '../dbControllers/usersController';

interface TokenProps {
  type: string;
  payload: JwtPayload;
}

interface VerifyProps {
  type: string;
  token: string;
}

class JwtHelper {
  private userDbController = new UserDBController();

  generateToken({ type, payload }: TokenProps): string {
    return jwt.sign(payload, type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: type === 'access' ? process.env.ACCESS_TOKEN_LIFETIME : process.env.REFRESH_TOKEN_LIFETIME,
      audience: process.env.WEB_URL
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
            audience: process.env.WEB_URL
          }
        ) as JwtDecoded;

        // checking in the DB for real existing of data
        if (type === 'access') {
          this.userDbController
            .getById(verified.userId)
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
          this.userDbController
            .getSession(verified.sessionId)
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

export default new JwtHelper();
