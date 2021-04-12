/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { fail } from 'assert';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS, LIST_VIEW } from '../constants';
import { CustomError } from '../errors';
import { BaseResponse, ItemApiResponse } from '../models';
import { User, Preference, PreferenceCreationAttributes } from '../repositories';
import { enumToArray } from '../utils/enumToArray';
import { Logger } from '../utils/Logger';
import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let serviceInstance: PreferenceService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  const userFake = {
    id: 1,
    getPreference: sinon.stub() as any,
    createPreference: sinon.stub() as any
  } as User;
  const preferenceFake = {
    id: 1,
    update: sinon.stub() as any
  } as Preference;

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
  });

  after(() => {
    spyLogger.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(PreferenceService);
  });

  afterEach(() => {
    (userFake.getPreference as sinon.SinonStub).reset();
    (userFake.createPreference as sinon.SinonStub).reset();
    (preferenceFake.update as sinon.SinonStub).reset();

    spyLogger.resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return preference list when calling getAll', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (Preference as any).rawAttributes = {
      listView: {
        values: enumToArray(LIST_VIEW)
      }
    };

    const result = serviceInstance.getAll();
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;

    expect((result._unsafeUnwrap() as ItemApiResponse<any>).data).to.deep.equal({ listView: ['list', 'card'] });
  });

  it('should return empty list when calling getAll', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (Preference as any).rawAttributes = {};

    const result = serviceInstance.getAll();
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap() as ItemApiResponse<any>).to.deep.equal({});
  });

  it('should update existing user preference', async () => {
    (userFake.getPreference as sinon.SinonStub).resolves(preferenceFake);
    (preferenceFake.update as sinon.SinonStub).resolves(preferenceFake);
    const result = await serviceInstance.set(userFake, { listView: LIST_VIEW.CARD } as PreferenceCreationAttributes);
    expect((userFake.getPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect((preferenceFake.update as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data.id).to.equal(1);
  });

  it('should create new user preference', async () => {
    (userFake.getPreference as sinon.SinonStub).resolves(null);
    (userFake.createPreference as sinon.SinonStub).resolves(preferenceFake);
    const result = await serviceInstance.set(userFake, { listView: LIST_VIEW.CARD } as PreferenceCreationAttributes);
    expect((userFake.getPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect((userFake.createPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    expect(result._unsafeUnwrap().data.id).to.equal(1);
  });

  it('should throw an error when creating a new item', async () => {
    (userFake.getPreference as sinon.SinonStub).resolves(preferenceFake);
    (preferenceFake.update as sinon.SinonStub).throws();
    const result = await serviceInstance.set(userFake, { listView: LIST_VIEW.CARD } as PreferenceCreationAttributes);
    expect((userFake.getPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect((preferenceFake.update as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });
});
