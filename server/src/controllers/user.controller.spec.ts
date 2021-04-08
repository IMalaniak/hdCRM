// tslint:disable: no-unused-expression

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { JwtUtils } from '../utils/jwt.utils';
import { UserService } from '../services';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controllerInstance: UserController;
  let dataBaseServiceInstance: UserService;

  const fakeObj = {
    id: 1
  } as any;

  const reqLogFake = {
    log: {
      info: sinon.spy()
    },
    user: {
      id: 1,
      OrganizationId: 1
    }
  };

  const resFake = {
    status: sinon.spy(),
    send: sinon.spy()
  };

  beforeEach(() => {
    controllerInstance = Container.get(UserController);
    dataBaseServiceInstance = Container.get(UserService);
  });

  afterEach(() => {
    reqLogFake.log.info.resetHistory();
    resFake.status.resetHistory();
    resFake.send.resetHistory();
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });

  it('should send success response when calling create', async () => {
    const stub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'create');
    stub.resolves(ok({ data: fakeObj }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.create(request as any, resFake as any);

    expect(stub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Creating new ${CONSTANTS.MODELS_NAME_USER}...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: fakeObj })).to.be.true;
    stub.restore();
  });

  it('should send success response when calling updatePassword', async () => {
    const stub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'updatePassword');
    const jwtHelperInstance = Container.get(JwtUtils);
    const jwtHelperStub: sinon.SinonStub = sinon.stub(jwtHelperInstance, 'getDecoded');
    jwtHelperStub.withArgs('token').returns(ok({ sessionId: 1 }));
    stub.resolves(ok({ message: 'updated' }));
    const request = {
      ...reqLogFake,
      headers: {
        cookie: 'refresh_token=token'
      },
      body: {
        newPassword: 'new',
        verifyPassword: 'new',
        oldPassword: 'old',
        deleteSessions: true
      }
    };

    await controllerInstance.updatePassword(request as any, resFake as any);

    expect(stub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Changing user password...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: 'updated' })).to.be.true;
    stub.restore();
    jwtHelperStub.restore();
  });

  it('should send success response when calling getSession', async () => {
    const stub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getSession');
    stub.resolves(ok({ data: fakeObj }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.getSession(request as any, resFake as any);

    expect(stub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Getting user session by id: 1...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: fakeObj })).to.be.true;
    stub.restore();
  });

  it('should send success response when calling getSessionList', async () => {
    const stub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getSessionList');
    stub.resolves(ok({ data: [fakeObj] }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.getSessionList(request as any, resFake as any);

    expect(stub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Getting session list for user id: 1...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: [fakeObj] })).to.be.true;
    stub.restore();
  });

  it('should send success response when calling removeSession', async () => {
    const deleteStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'removeSession');
    deleteStub.resolves(ok({ message: `Deleted 1` }));
    const request = { ...reqLogFake, params: { id: 1 } };

    await controllerInstance.removeSession(request as any, resFake as any);

    expect(deleteStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Removing user session`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: `Deleted 1` })).to.be.true;
    deleteStub.restore();
  });

  it('should send success response when calling removeSessionMultiple', async () => {
    const deleteStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'removeSession');
    deleteStub.resolves(ok({ message: `Deleted 1` }));
    const request = { ...reqLogFake, body: { sessionIds: [1] } };

    await controllerInstance.removeSessionMultiple(request as any, resFake as any);

    expect(deleteStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Removing user sessions`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: `Deleted 1` })).to.be.true;
    deleteStub.restore();
  });

  it('should send success response when calling updateOrg', async () => {
    const updateStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'updateOrg');
    updateStub.resolves(ok({ data: fakeObj }));
    const request = { ...reqLogFake, body: { id: 1 } };

    await controllerInstance.updateOrg(request as any, resFake as any);

    expect(updateStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Update user organization by id: 1`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: fakeObj })).to.be.true;
    updateStub.restore();
  });

  it('should send success response when calling inviteMultiple', async () => {
    const stub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'inviteMultiple');
    stub.resolves(ok({ data: [fakeObj] }));
    const request = { ...reqLogFake, body: [{ id: 1 }] };

    await controllerInstance.inviteMultiple(request as any, resFake as any);

    expect(stub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Invite multiple users`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: [fakeObj] })).to.be.true;
    stub.restore();
  });
});
