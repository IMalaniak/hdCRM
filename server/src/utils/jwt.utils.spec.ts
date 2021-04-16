/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import Container from 'typedi';
import { StatusCodes } from 'http-status-codes';

import { Config } from '../config';
import { User, UserSession } from '../repositories';

import { Logger } from './Logger';
import { JwtUtils } from './jwt.utils';

describe('JwtUtils', () => {
  const logger = new Logger();
  const jwtHelper: JwtUtils = new JwtUtils(logger);

  let findUserByPkStub: sinon.SinonStub;
  let findUserSessionByPkStub: sinon.SinonStub;

  // fakes
  const userFake = {
    id: 1
  } as User;

  before(() => {
    findUserByPkStub = sinon.stub(User, 'findByPk');
    findUserSessionByPkStub = sinon.stub(UserSession, 'findByPk');
    process.env.ACCESS_TOKEN_LIFETIME = '15 min';
    process.env.ACCESS_TOKEN_SECRET = 'AccessTokenSecret';
    process.env.REFRESH_TOKEN_LIFETIME = '15 min';
    process.env.REFRESH_TOKEN_SECRET = 'RefreshTokenSecret';
    process.env.WEB_URL = 'http://localhost:4200';
    Config.WEB_URL = 'http://localhost:4200';
  });

  after(() => {
    findUserByPkStub.restore();
    findUserSessionByPkStub.restore();
  });

  afterEach(() => {
    findUserByPkStub.reset();
    findUserSessionByPkStub.reset();
  });

  it('should generate access token and then decode it', () => {
    const payload = {
      sub: 1
    };

    const iat = Math.floor(new Date().getTime() / 1000);
    const { token } = jwtHelper.sign({ type: 'access', payload });

    expect(token).to.not.be.empty;

    const decodedResult = jwtHelper.decode(token);

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

  it('should verify and get subject for access token', async () => {
    findUserByPkStub.resolves(userFake);

    const payload = {
      sub: 1
    };

    const { token } = jwtHelper.sign({ type: 'access', payload });

    const result = await jwtHelper.verifyAndGetSubject({ type: 'access', token });

    expect(result.isOk()).to.be.true;
    expect(result._unsafeUnwrap()).to.be.equal(userFake);
  });

  it('should verify but does not get subject for access token', async () => {
    findUserByPkStub.resolves(null);

    const payload = {
      sub: 1
    };

    const { token } = jwtHelper.sign({ type: 'access', payload });

    const result = await jwtHelper.verifyAndGetSubject({ type: 'access', token });

    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.be.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.be.equal('No user registered');
  });

  it('should verify and get subject for refresh token', async () => {
    findUserSessionByPkStub.resolves(userFake);

    const payload = {
      sub: 1
    };

    const { token } = jwtHelper.sign({ type: 'refresh', payload });

    const result = await jwtHelper.verifyAndGetSubject({ type: 'refresh', token });

    expect(result.isOk()).to.be.true;
    expect(result._unsafeUnwrap()).to.be.equal(userFake);
  });

  it('should verify but does not get subject for refresh token', async () => {
    findUserSessionByPkStub.resolves(null);

    const payload = {
      sub: 1
    };

    const { token } = jwtHelper.sign({ type: 'refresh', payload });

    const result = await jwtHelper.verifyAndGetSubject({ type: 'refresh', token });

    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.be.equal(StatusCodes.UNAUTHORIZED);
    expect(result._unsafeUnwrapErr().message).to.be.equal('No session registered');
  });
});
