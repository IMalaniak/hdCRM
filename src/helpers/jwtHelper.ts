import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/JWTPayload';

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

  getVerified({ type, token }: VerifyProps): string | object {
    return jwt.verify(token, type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
      audience: process.env.WEB_URL
    });
  }
}

export default new JwtHelper();
