/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { Preference } from '../repositories';
import { PreferenceService } from '../services';

import { PreferenceController } from './preference.controller';

describe('PreferenceController', () => {
  let controllerInstance: PreferenceController;
  let dataBaseServiceInstance: PreferenceService;

  const preferenceFake = {
    id: 1
  } as Preference;

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
    controllerInstance = Container.get(PreferenceController);
    dataBaseServiceInstance = Container.get(PreferenceService);
  });

  afterEach(() => {
    reqLogFake.log.info.resetHistory();
    resFake.status.resetHistory();
    resFake.send.resetHistory();
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });

  it('should send success response when calling getAll', () => {
    const getAllStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getAll');
    getAllStub.resolves(ok({ data: {} }));

    controllerInstance.getAll(reqLogFake as any, resFake as any);

    expect(getAllStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Selecting preferences list...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ data: {} })).to.be.true;
    getAllStub.restore();
  });

  it('should send success response when calling set', async () => {
    const setStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'set');
    setStub.resolves(ok({ data: preferenceFake }));

    await controllerInstance.set(reqLogFake as any, resFake as any);

    expect(setStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Setting user preferences, userId: ${reqLogFake.user.id}`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ data: preferenceFake })).to.be.true;
    setStub.restore();
  });
});
