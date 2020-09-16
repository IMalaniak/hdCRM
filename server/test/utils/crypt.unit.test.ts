import { expect } from 'chai';
import Crypt from '../../src/utils/crypt';

describe('Crypt', () => {
  it('check random string length', () => {
    const randomString = Crypt.genRandomString(12);
    expect(randomString).lengthOf(12);
  });

  it('should generate hashed password and then validate it', () => {
    const password = 'HelloThisIsMyPassword';
    const { salt, passwordHash } = Crypt.saltHashPassword(password);

    // put the wrong password => expect false
    expect(Crypt.validatePassword('WrongPassword', passwordHash, salt)).to.equal(false);

    // put the correct password => expect true
    expect(Crypt.validatePassword(password, passwordHash, salt)).to.equal(true);
  });
});
