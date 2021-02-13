import { expect } from 'chai';
import { Config } from '../config';
import { JwtHelper } from './jwtHelper';

describe('jwtHelper', async () => {
  const jwtHelper: JwtHelper = new JwtHelper();

  it('should generate access token and then decode it', () => {
    process.env.ACCESS_TOKEN_LIFETIME = '15 min';
    process.env.ACCESS_TOKEN_SECRET = 'AccessTokenSecret';
    process.env.WEB_URL = 'http://localhost:4200';
    Config.WEB_URL = process.env.WEB_URL; // @IMalaniak check if this is good solution

    const payload = {
      userId: 1,
      sessionId: 1
    };

    const iat = Math.floor(new Date().getTime() / 1000);
    const accessToken = jwtHelper.generateToken({ type: 'access', payload });

    expect(accessToken).to.not.be.empty;

    const decodedResult = jwtHelper.getDecoded(accessToken);

    if (decodedResult.isOk()) {
      expect(decodedResult.value).to.not.be.empty;

      const decodedExpectation = {
        ...payload,
        iat,
        exp: iat + 15 * 60,
        aud: process.env.WEB_URL
      };

      expect(decodedResult.value).to.deep.equal(decodedExpectation);
    }
  });
});
