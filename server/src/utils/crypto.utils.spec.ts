import { expect } from 'chai';

import { CryptoUtils } from './crypto.utils';

describe('CryptoUtils', () => {
  const crypt: CryptoUtils = new CryptoUtils();

  it('check random string length', () => {
    const randomString = crypt.genRandomString(12);
    expect(randomString).lengthOf(12);
  });

  it('should set expire minutes', () => {
    const date = new Date();
    const exireIn = crypt.setExpireMinutes(date, 15);

    const diffMs = exireIn.getTime() - date.getTime();
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    expect(diffMins).to.equal(15);
  });

  it('should generate timelimited token', () => {
    const timeLimitedToken = crypt.genTimeLimitedToken(15);
    expect(timeLimitedToken.value.length).to.equal(32);
    expect(timeLimitedToken.expireDate).to.be.greaterThan(new Date());
  });
});
