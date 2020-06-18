import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload } from '../models/JWTPayload';
import { resolve, reject } from 'bluebird';

interface TokenProps {
  type: string;
  payload: JwtPayload;
}

interface VerifyProps {
  type: string;
  token: string;
}

class JwtHelper {
  generateToken({ type, payload }: TokenProps): string {
    return jwt.sign(payload, type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: type === 'access' ? process.env.ACCESS_TOKEN_LIFETIME : process.env.REFRESH_TOKEN_LIFETIME,
      audience: process.env.WEB_URL
    });
  }

  getVerified({ type, token }: VerifyProps): Promise<string | object | TokenExpiredError> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(token, type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
          audience: process.env.WEB_URL
        });
        resolve(decoded);
      } catch (error) {
        reject(error);
      }
    });
  }

}

export default new JwtHelper();
