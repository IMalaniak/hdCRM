// tslint:disable: no-unused-expression

import { fail } from 'assert';
import { expect } from 'chai';
import { Result } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS, IListView } from '../constants';
import { BaseResponse, Preference, PreferenceCreationAttributes, User } from '../models';
import { enumToArray } from '../utils/EnumToArray';
import { Logger } from '../utils/Logger';
import { PreferenceService } from './preferenceService';

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

  const expect500 = (result: Result<BaseResponse, BaseResponse>) => {
    if (result.isErr()) {
      expect(result.error.success).to.be.false;
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

  it('should return preference list when calling getAll', async () => {
    (Preference as any).rawAttributes = {
      listView: {
        values: enumToArray(IListView)
      }
    };

    const result = await serviceInstance.getAll();
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data).to.deep.equal({ listView: ['list', 'card'] });
    }
  });

  it('should return empty list when calling getAll', async () => {
    (Preference as any).rawAttributes = {};

    const result = await serviceInstance.getAll();
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.false;
      expect(result.value.data).to.deep.equal({});
    }
  });

  it('should update existing user preference', async () => {
    (userFake.getPreference as sinon.SinonStub).resolves(preferenceFake);
    (preferenceFake.update as sinon.SinonStub).resolves(preferenceFake);
    const result = await serviceInstance.set(userFake, { listView: IListView.CARD } as PreferenceCreationAttributes);
    expect((userFake.getPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect((preferenceFake.update as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data.id).to.equal(1);
    }
  });

  it('should create new user preference', async () => {
    (userFake.getPreference as sinon.SinonStub).resolves(null);
    (userFake.createPreference as sinon.SinonStub).resolves(preferenceFake);
    const result = await serviceInstance.set(userFake, { listView: IListView.CARD } as PreferenceCreationAttributes);
    expect((userFake.getPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect((userFake.createPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data.id).to.equal(1);
    }
  });

  it('should throw an error when creating a new item', async () => {
    (userFake.getPreference as sinon.SinonStub).resolves(preferenceFake);
    (preferenceFake.update as sinon.SinonStub).throws();
    const result = await serviceInstance.set(userFake, { listView: IListView.CARD } as PreferenceCreationAttributes);
    expect((userFake.getPreference as sinon.SinonStub).calledOnce).to.be.true;
    expect((preferenceFake.update as sinon.SinonStub).calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });
});
