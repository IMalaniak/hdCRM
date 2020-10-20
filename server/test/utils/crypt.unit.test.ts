import { expect } from 'chai';
import { Crypt } from '../../src/utils/crypt';

describe('Crypt', () => {
  const crypt: Crypt = new Crypt();

  it('check random string length', () => {
    const randomString = crypt.genRandomString(12);
    expect(randomString).lengthOf(12);
  });

  it('should generate hashed password and then validate it', () => {
    const password = 'HelloThisIsMyPassword';
    const { salt, passwordHash } = crypt.saltHashPassword(password);

    // put the wrong password => expect false
    expect(crypt.validatePassword('WrongPassword', passwordHash, salt)).to.equal(false);

    // put the correct password => expect true
    expect(crypt.validatePassword(password, passwordHash, salt)).to.equal(true);
  });
});
