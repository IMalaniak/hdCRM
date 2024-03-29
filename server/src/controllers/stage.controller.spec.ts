/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { ok } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { Stage } from '../repositories';
import { StageService } from '../services';

import { StageController } from './stage.controller';

describe('StageController', () => {
  let controllerInstance: StageController;
  let dataBaseServiceInstance: StageService;

  const stageFake = {
    id: 1
  } as Stage;

  const reqLogFake = {
    log: {
      info: sinon.spy()
    },
    user: {
      OrganizationId: 1
    }
  };

  const resFake = {
    status: sinon.spy(),
    send: sinon.spy()
  };

  beforeEach(() => {
    controllerInstance = Container.get(StageController);
    dataBaseServiceInstance = Container.get(StageService);
  });

  afterEach(() => {
    reqLogFake.log.info.resetHistory();
    resFake.status.resetHistory();
    resFake.send.resetHistory();
  });

  it('should be defined', () => {
    expect(controllerInstance).to.not.be.undefined;
  });

  it('should send success response when calling getAll', async () => {
    const getAllStub: sinon.SinonStub = sinon.stub(dataBaseServiceInstance, 'getAll');
    getAllStub.resolves(ok({ data: [stageFake] }));

    await controllerInstance.getAll(reqLogFake as any, resFake as any);

    expect(getAllStub.calledOnce).to.be.true;
    expect(reqLogFake.log.info.calledOnceWith(`Selecting stages list...`)).to.be.true;
    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWith({ data: [stageFake] })).to.be.true;
    getAllStub.restore();
  });
});
