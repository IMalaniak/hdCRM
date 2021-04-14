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

  private sha512(password: string, salt: string): { salt: string; passwordHash: string } {
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
      salt,
      passwordHash: value
    };
  }

  saltHashPassword(userpassword: string): { salt: string; passwordHash: string } {
    const salt = this.genRandomString(16); /** Gives us salt of length 16 */
    return this.sha512(userpassword, salt);
  }

  validatePassword(userpassword: string, passwordHash: string, salt: string): boolean {
    const testHash = this.sha512(userpassword, salt);
    return testHash.passwordHash === passwordHash;
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

  jsonToBase64(json: { [key: string]: any }): string {
    const data = JSON.stringify(json);
    const buff = Buffer.from(data);
    return buff.toString('base64');
  }

  base64ToJson<R extends { [key: string]: any }>(str: string): R {
    const buff = Buffer.from(str, 'base64');
    const encoded = buff.toString('ascii');
    return JSON.parse(encoded) as R;
  }
}
