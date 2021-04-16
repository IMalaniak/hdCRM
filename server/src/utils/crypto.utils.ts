import crypto from 'crypto';

import { Service } from 'typedi';

@Service()
export class CryptoUtils {
  genRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  }

  setExpireMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  genTimeLimitedToken(minutes: number): { value: string; expireDate: Date } {
    return {
      value: this.genRandomString(32),
      expireDate: this.setExpireMinutes(new Date(), minutes)
    };
  }
}
