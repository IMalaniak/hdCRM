/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';

import { Config } from '../config';

import { Logger } from './Logger';
import { JwtUtils } from './jwt.utils';
import { CryptoUtils } from './crypto.utils';

describe('JwtUtils', () => {
  const logger = new Logger();
  const crypto = new CryptoUtils();
  const jwtHelper: JwtUtils = new JwtUtils(logger, crypto);

  it('should generate access token and then decode it', () => {
    process.env.ACCESS_TOKEN_LIFETIME = '15 min';
    process.env.ACCESS_TOKEN_SECRET = 'AccessTokenSecret';
    process.env.WEB_URL = 'http://localhost:4200';
    Config.WEB_URL = process.env.WEB_URL; // @IMalaniak check if this is good solution

    const data = {
      userId: 1,
      sessionId: 1
    };

    const accessToken = jwtHelper.generateToken({ type: 'access', data });

    expect(accessToken).to.not.be.empty;

    const decodedResult = jwtHelper.getDecoded(accessToken);

    if (decodedResult.isOk()) {
      expect(decodedResult.value).to.not.be.empty;

      expect(decodedResult.value).to.deep.equal(data);
    }
  });
});
