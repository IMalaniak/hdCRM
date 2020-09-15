import { expect } from 'chai';
import jwtHelper from '../../src/helpers/jwtHelper';

describe('jwtHelper', async () => {
  it('should generate access token and then decode it', async () => {
    process.env.ACCESS_TOKEN_LIFETIME = '15 min';
    process.env.ACCESS_TOKEN_SECRET = 'AccessTokenSecret';
    process.env.WEB_URL = 'http://localhost:4200';

    const payload = {
      userId: 1,
      sessionId: 1
    };

    const iat = Math.floor(new Date().getTime() / 1000);
    const accessToken = jwtHelper.generateToken({ type: 'access', payload });

    expect(accessToken).to.not.be.empty;

    const decoded = await jwtHelper.getDecoded(accessToken);

    expect(decoded).to.not.be.empty;

    const decodedExpectation = {
      ...payload,
      iat,
      exp: iat + 15 * 60,
      aud: process.env.WEB_URL
    };

    expect(decoded).to.deep.equal(decodedExpectation);
  });
});
