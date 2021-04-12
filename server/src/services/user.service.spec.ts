/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { fail } from 'assert';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'neverthrow';
import { CreateOptions } from 'sequelize';
import sinon from 'sinon';
import Container from 'typedi';
import { Config } from '../config';

import { CONSTANTS } from '../constants';
import { CustomError } from '../errors';
import { BaseResponse, CollectionApiResponse } from '../models';
import { UserCreationAttributes, User, Organization, UserSession, Privilege } from '../repositories';
import { CryptoUtils } from '../utils/crypto.utils';
import { EmailUtils } from '../utils/email.utils';
import { Logger } from '../utils/Logger';
import { UserService } from './user.service';

describe('UserService', () => {
  let serviceInstance: UserService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  let createStub: sinon.SinonStub<[values: UserCreationAttributes, options?: CreateOptions], Promise<User>>;
  let findUserByPkStub: sinon.SinonStub;
  let findOrgByPkStub: sinon.SinonStub;
  let updateOrgStub: sinon.SinonStub;
  let findSessionByPkStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let findAndCountAllStub: sinon.SinonStub;
  let findAllUsersStub: sinon.SinonStub;
  let findAllPrivilegesStub: sinon.SinonStub;
  let destroySessionStub: sinon.SinonStub;

  let cryptValidatePasswordStub: sinon.SinonStub;
  let cryptSaltHashPasswordStub: sinon.SinonStub;
  let cryptGenRandomStringStub: sinon.SinonStub;
  let cryptGenTimeLimitedTokenStub: sinon.SinonStub;
  let mailerSendPasswordResetConfirmationStub: sinon.SinonStub;
  let mailerSendInvitationStub: sinon.SinonStub;

  // fakes
  const userFake = {
    id: 1,
    fullname: 'John Doe',
    passwordHash: 'hash',
    salt: 'salt',
    save: sinon.stub() as any,
    getUserSessions: sinon.stub() as any,
    createPasswordAttributes: sinon.stub() as any
  } as User;

  const orgFake = {
    id: 1
  } as Organization;

  const userSessionFake = {
    id: 1
  } as UserSession;

  const expect500 = (result: Result<BaseResponse, CustomError>) => {
    if (result.isErr()) {
      expect(result.error.statusCode).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.error.message).to.equal(CONSTANTS.TEXTS_API_GENERIC_ERROR);
      expect(spyLogger.calledOnce).to.be.true;
    } else {
      fail('The "result" expected to be an error');
    }
  };

  before(() => {
    loggerInstance = Container.get(Logger);
    spyLogger = sinon.spy(loggerInstance, 'error');

    createStub = sinon.stub(User, 'create') as any;
    findUserByPkStub = sinon.stub(User, 'findByPk');
    findOrgByPkStub = sinon.stub(Organization, 'findByPk');
    updateOrgStub = sinon.stub(Organization, 'update');
    findSessionByPkStub = sinon.stub(UserSession, 'findByPk');
    destroySessionStub = sinon.stub(UserSession, 'destroy');
    updateStub = sinon.stub(User, 'update');
    findAndCountAllStub = sinon.stub(User, 'findAndCountAll');
    findAllUsersStub = sinon.stub(User, 'findAll');
    findAllPrivilegesStub = sinon.stub(Privilege, 'findAll');

    const cryptInstance = Container.get(CryptoUtils);
    cryptValidatePasswordStub = sinon.stub(cryptInstance, 'validatePassword');
    cryptSaltHashPasswordStub = sinon.stub(cryptInstance, 'saltHashPassword');
    cryptGenRandomStringStub = sinon.stub(cryptInstance, 'genRandomString');
    cryptGenTimeLimitedTokenStub = sinon.stub(cryptInstance, 'genTimeLimitedToken');

    const mailerInstance = Container.get(EmailUtils);
    mailerSendPasswordResetConfirmationStub = sinon.stub(mailerInstance, 'sendPasswordResetConfirmation');
    mailerSendInvitationStub = sinon.stub(mailerInstance, 'sendInvitation');
  });

  after(() => {
    createStub.restore();
    findUserByPkStub.restore();
    findOrgByPkStub.restore();
    updateOrgStub.restore();
    findSessionByPkStub.restore();
    updateStub.restore();
    findAndCountAllStub.restore();
    findAllUsersStub.restore();
    findAllPrivilegesStub.restore();
    destroySessionStub.restore();
    cryptValidatePasswordStub.restore();
    cryptSaltHashPasswordStub.restore();
    cryptGenRandomStringStub.restore();
    cryptGenTimeLimitedTokenStub.restore();
    mailerSendPasswordResetConfirmationStub.restore();
    mailerSendInvitationStub.restore();
    spyLogger.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(UserService);
  });

  afterEach(() => {
    createStub.reset();
    findUserByPkStub.reset();
    findOrgByPkStub.reset();
    updateOrgStub.reset();
    findSessionByPkStub.reset();
    updateStub.reset();
    findAndCountAllStub.reset();
    findAllUsersStub.reset();
    findAllPrivilegesStub.reset();
    destroySessionStub.reset();
    cryptValidatePasswordStub.reset();
    cryptSaltHashPasswordStub.reset();
    cryptGenRandomStringStub.reset();
    cryptGenTimeLimitedTokenStub.reset();
    mailerSendPasswordResetConfirmationStub.reset();
    mailerSendInvitationStub.reset();
    (userFake.save as sinon.SinonStub).reset();
    (userFake.getUserSessions as sinon.SinonStub).reset();
    (userFake.createPasswordAttributes as sinon.SinonStub).reset();
    spyLogger.resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return error because passwords do not match', async () => {
    const result = await serviceInstance.updatePassword({
      newPassword: 'new_password',
      verifyPassword: 'wrong_password',
      oldPassword: 'old_password',
      deleteSessions: true,
      userId: 1
    });
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.BAD_REQUEST);
    expect(result._unsafeUnwrapErr().message).to.equal('New passwords do not match!');
  });

  it('should return error because old password is not correct', async () => {
    findUserByPkStub.withArgs(1).resolves(userFake);
    cryptValidatePasswordStub.withArgs('old_password', userFake.passwordHash, userFake.salt).returns(false);

    const result = await serviceInstance.updatePassword({
      newPassword: 'new_password',
      verifyPassword: 'new_password',
      oldPassword: 'old_password',
      deleteSessions: true,
      userId: 1
    });
    expect(findUserByPkStub.calledOnce).to.be.true;
    expect(cryptValidatePasswordStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.UNAUTHORIZED);
    expect(result._unsafeUnwrapErr().message).to.equal('Current password you provided is not correct!');
  });

  it('should change password when calling updatePassword', async () => {
    findUserByPkStub.withArgs(1).resolves(userFake);
    cryptValidatePasswordStub.withArgs('old_password', userFake.passwordHash, userFake.salt).returns(true);
    cryptSaltHashPasswordStub.withArgs('new_password').returns({
      passwordHash: 'hash',
      salt: 'salt'
    });
    (userFake.save as sinon.SinonStub).resolves();
    mailerSendPasswordResetConfirmationStub.withArgs(userFake).resolves();

    const result = await serviceInstance.updatePassword({
      newPassword: 'new_password',
      verifyPassword: 'new_password',
      oldPassword: 'old_password',
      deleteSessions: false,
      userId: 1
    });

    expect(findUserByPkStub.calledOnce).to.be.true;
    expect(cryptValidatePasswordStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal('You have successfully changed your password.');
  });

  it('should change password but fail to remove sessions when calling updatePassword', async () => {
    findUserByPkStub.withArgs(1).resolves(userFake);
    cryptValidatePasswordStub.withArgs('old_password', userFake.passwordHash, userFake.salt).returns(true);
    cryptSaltHashPasswordStub.withArgs('new_password').returns({
      passwordHash: 'hash',
      salt: 'salt'
    });
    (userFake.save as sinon.SinonStub).resolves();
    mailerSendPasswordResetConfirmationStub.withArgs(userFake).resolves();
    destroySessionStub.rejects();

    const result = await serviceInstance.updatePassword({
      newPassword: 'new_password',
      verifyPassword: 'new_password',
      oldPassword: 'old_password',
      deleteSessions: true,
      userId: 1,
      sessionId: 1
    });

    expect(findUserByPkStub.calledOnce).to.be.true;
    expect(cryptValidatePasswordStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect((userFake.save as sinon.SinonStub).calledOnce).to.be.true;
    expect(mailerSendPasswordResetConfirmationStub.calledOnce).to.be.true;
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal(
      'You have changed your password, but there was a problem trying to delete your other active sessions, please do it manually in the "Sessions tab".'
    );
  });

  it('should throw an error when calling updatePassword', async () => {
    findUserByPkStub.withArgs(1).throws();
    const result = await serviceInstance.updatePassword({
      newPassword: 'new_password',
      verifyPassword: 'new_password',
      oldPassword: 'old_password',
      userId: 1
    });
    expect(findUserByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should return an item when calling getById', async () => {
    findSessionByPkStub.withArgs(1).resolves(userSessionFake);
    const result = await serviceInstance.getSession(1);
    expect(findSessionByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data.id).to.equal(1);
  });

  it('should return empty response when calling getById', async () => {
    findSessionByPkStub.withArgs(3).resolves(null);
    const result = await serviceInstance.getSession(3);
    expect(findSessionByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.equal(`No session with such id`);
  });

  it('should throw an error when calling getById', async () => {
    findSessionByPkStub.withArgs('wrong params').throws();
    const result = await serviceInstance.getSession('wrong params');
    expect(findSessionByPkStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should return an array when calling getSessionList', async () => {
    (userFake.getUserSessions as sinon.SinonStub).resolves([userSessionFake]);
    const result = await serviceInstance.getSessionList(userFake);
    expect((userFake.getUserSessions as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    const response = result._unsafeUnwrap() as CollectionApiResponse<any>;
    expect(response.data.length).to.equal(1);
    expect(response.data[0].id).to.equal(1);
  });

  it('should return an empty array when calling getSessionList', async () => {
    (userFake.getUserSessions as sinon.SinonStub).resolves([]);
    const result = await serviceInstance.getSessionList(userFake);
    expect((userFake.getUserSessions as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap()).to.deep.equal({});
  });

  it('should throw an error when calling getSessionList', async () => {
    (userFake.getUserSessions as sinon.SinonStub).throws();
    const result = await serviceInstance.getSessionList(userFake);
    expect((userFake.getUserSessions as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should remove session from db', async () => {
    destroySessionStub
      .withArgs({
        where: { id: 1 }
      })
      .resolves(1);
    const result = await serviceInstance.removeSession(1);
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal(`Deleted 1 session(s)`);
  });

  it('should inform that there is no session to delete', async () => {
    destroySessionStub
      .withArgs({
        where: { id: 2 }
      })
      .resolves(0);
    const result = await serviceInstance.removeSession(2);
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.equal(`No sessions by this query`);
  });

  it('should throw en error trying to delete session', async () => {
    destroySessionStub.throws();
    const result = await serviceInstance.removeSession('wrong param');
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should destroy user all session when calling removeUserSessionsExept', async () => {
    destroySessionStub.resolves(1);
    const result = await serviceInstance.removeUserSessionsExept(1, 1);
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal(`Deleted 1 session(s)`);
  });

  it('should inform that there are no session to remove when calling removeUserSessionsExept', async () => {
    destroySessionStub.resolves(0);
    const result = await serviceInstance.removeUserSessionsExept(1, 1);
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect(result._unsafeUnwrapErr().statusCode).to.equal(StatusCodes.NOT_FOUND);
    expect(result._unsafeUnwrapErr().message).to.equal('No sessions by this query');
  });

  it('should throw an error when calling removeUserSessionsExept', async () => {
    destroySessionStub.throws();
    const result = await serviceInstance.removeUserSessionsExept(1, 1);
    expect(destroySessionStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should update organization', async () => {
    updateOrgStub
      .withArgs(
        {
          ...orgFake
        },
        {
          where: { id: orgFake.id }
        }
      )
      .resolves([1, [orgFake]]);
    findOrgByPkStub.withArgs(1).resolves(orgFake);
    const result = await serviceInstance.updateOrg(orgFake);
    expect(findOrgByPkStub.calledOnce).to.be.true;
    expect(updateOrgStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal('Organization is updated successfully!');
    expect(result._unsafeUnwrap().data).to.deep.equal(orgFake);
  });

  it('should throw an error trying to update an item', async () => {
    updateOrgStub.throws();
    const result = await serviceInstance.updateOrg(orgFake);
    expect(updateOrgStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should invite a new user', async () => {
    cryptGenRandomStringStub.returns('password');
    cryptSaltHashPasswordStub.withArgs('password').returns({ salt: 'salt', passwordHash: 'hash' });
    createStub.resolves(userFake);
    findUserByPkStub.resolves(userFake);
    cryptGenTimeLimitedTokenStub.returns({ value: 'token', expireDate: 'expireDate' });
    (userFake.createPasswordAttributes as sinon.SinonStub).withArgs({
      token: 'token',
      tokenExpire: 'expireDate',
      passwordExpire: 'expireDate'
    });
    mailerSendInvitationStub
      .withArgs({
        user: userFake,
        password: 'password',
        url: `${Config.WEB_URL!}/auth/activate-account/token`
      })
      .resolves();

    const result = await serviceInstance.invite(userFake, 1);

    expect(cryptGenRandomStringStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(cryptGenTimeLimitedTokenStub.calledOnce).to.be.true;
    expect((userFake.createPasswordAttributes as sinon.SinonStub).calledOnce).to.be.true;
    expect(findUserByPkStub.calledTwice).to.be.true;
    expect(mailerSendInvitationStub.calledOnce).to.be.true;

    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal('Invitation have been sent successfully!');
    expect(result._unsafeUnwrap().data).to.deep.equal(userFake);
  });

  it('should throw error when addind invited user', async () => {
    cryptGenRandomStringStub.returns('password');
    cryptSaltHashPasswordStub.withArgs('password').returns({ salt: 'salt', passwordHash: 'hash' });
    createStub.throws();

    const result = await serviceInstance.invite(userFake, 1);

    expect(cryptGenRandomStringStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;

    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should throw error when sending email invited user', async () => {
    cryptGenRandomStringStub.returns('password');
    cryptSaltHashPasswordStub.withArgs('password').returns({ salt: 'salt', passwordHash: 'hash' });
    createStub.resolves(userFake);
    findUserByPkStub.resolves(userFake);
    cryptGenTimeLimitedTokenStub.returns({ value: 'token', expireDate: 'expireDate' });
    (userFake.createPasswordAttributes as sinon.SinonStub).withArgs({
      token: 'token',
      tokenExpire: 'expireDate',
      passwordExpire: 'expireDate'
    });
    mailerSendInvitationStub.throws();

    const result = await serviceInstance.invite(userFake, 1);

    expect(cryptGenRandomStringStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(cryptGenTimeLimitedTokenStub.calledOnce).to.be.true;
    expect((userFake.createPasswordAttributes as sinon.SinonStub).calledOnce).to.be.true;
    expect(findUserByPkStub.calledTwice).to.be.true;
    expect(mailerSendInvitationStub.calledOnce).to.be.true;

    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should invite multiple users', async () => {
    cryptGenRandomStringStub.returns('password');
    cryptSaltHashPasswordStub.withArgs('password').returns({ salt: 'salt', passwordHash: 'hash' });
    createStub.resolves(userFake);
    findUserByPkStub.resolves(userFake);
    cryptGenTimeLimitedTokenStub.returns({ value: 'token', expireDate: 'expireDate' });
    (userFake.createPasswordAttributes as sinon.SinonStub).withArgs({
      token: 'token',
      tokenExpire: 'expireDate',
      passwordExpire: 'expireDate'
    });
    mailerSendInvitationStub
      .withArgs({
        user: userFake,
        password: 'password',
        url: `${Config.WEB_URL!}/auth/activate-account/token`
      })
      .resolves();

    const result = await serviceInstance.inviteMultiple([userFake], 1);

    expect(cryptGenRandomStringStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    expect(cryptGenTimeLimitedTokenStub.calledOnce).to.be.true;
    expect((userFake.createPasswordAttributes as sinon.SinonStub).calledOnce).to.be.true;
    expect(findUserByPkStub.calledTwice).to.be.true;
    expect(mailerSendInvitationStub.calledOnce).to.be.true;

    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().message).to.equal('Invitations have been sent successfully!');
    expect(result._unsafeUnwrap().data).to.deep.equal([userFake]);
  });

  it('should fail inviting multiple users', async () => {
    cryptGenRandomStringStub.returns('password');
    cryptSaltHashPasswordStub.withArgs('password').returns({ salt: 'salt', passwordHash: 'hash' });
    createStub.rejects();

    const result = await serviceInstance.inviteMultiple([userFake], 1);

    expect(cryptGenRandomStringStub.calledOnce).to.be.true;
    expect(cryptSaltHashPasswordStub.calledOnce).to.be.true;
    expect(createStub.calledOnce).to.be.true;

    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should fail inviting some users', async () => {
    const userFake2 = { ...userFake, id: 2 } as User;

    cryptGenRandomStringStub.returns('password');
    cryptSaltHashPasswordStub.withArgs('password').returns({ salt: 'salt', passwordHash: 'hash' });
    createStub.withArgs(userFake).resolves(userFake);
    createStub.withArgs(userFake2).resolves(userFake2);
    findUserByPkStub.withArgs(1).resolves(userFake);
    findUserByPkStub.withArgs(2).rejects();
    cryptGenTimeLimitedTokenStub.returns({ value: 'token', expireDate: 'expireDate' });
    (userFake.createPasswordAttributes as sinon.SinonStub).withArgs({
      token: 'token',
      tokenExpire: 'expireDate',
      passwordExpire: 'expireDate'
    });
    mailerSendInvitationStub
      .withArgs({
        user: userFake,
        password: 'password',
        url: `${Config.WEB_URL!}/auth/activate-account/token`
      })
      .resolves();

    const result = await serviceInstance.inviteMultiple([userFake, userFake2], 1);

    expect(cryptGenRandomStringStub.calledTwice).to.be.true;
    expect(cryptSaltHashPasswordStub.calledTwice).to.be.true;
    expect(createStub.calledTwice).to.be.true;
    expect(cryptGenTimeLimitedTokenStub.calledOnce).to.be.true;
    expect((userFake.createPasswordAttributes as sinon.SinonStub).calledOnce).to.be.true;
    expect(findUserByPkStub.callCount).to.equal(3);
    expect(mailerSendInvitationStub.calledOnce).to.be.true;

    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    const response = result._unsafeUnwrap() as CollectionApiResponse<any>;
    expect(response.message).to.equal('Success, but not all users were invited due to some problems...');
    expect(response.data).to.deep.equal([userFake]);
  });
});
