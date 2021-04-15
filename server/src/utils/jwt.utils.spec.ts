/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';

import { Config } from '../config';

import { Logger } from './Logger';
import { JwtUtils } from './jwt.utils';

describe('JwtUtils', () => {
  const logger = new Logger();
  const jwtHelper: JwtUtils = new JwtUtils(logger);

  it('should generate access token and then decode it', () => {
    process.env.ACCESS_TOKEN_LIFETIME = '15 min';
    process.env.ACCESS_TOKEN_SECRET = 'AccessTokenSecret';
    process.env.WEB_URL = 'http://localhost:4200';
    Config.WEB_URL = process.env.WEB_URL; // @IMalaniak check if this is good solution

    const payload = {
      sub: 1
    };

    const iat = Math.floor(new Date().getTime() / 1000);
    const accessToken = jwtHelper.sign({ type: 'access', payload });

    expect(accessToken).to.not.be.empty;

    const decodedResult = jwtHelper.decode(accessToken);

    if (decodedResult.isOk()) {
      expect(decodedResult.value).to.not.be.empty;

      expect(decodedResult.value).to.deep.equal({
        sub: 1,
        iat,
        exp: iat + 15 * 60,
        aud: process.env.WEB_URL
      });
    }
  });
});
