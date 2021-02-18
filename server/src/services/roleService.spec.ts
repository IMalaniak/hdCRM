// tslint:disable: no-unused-expression

import { fail } from 'assert';
import { expect } from 'chai';
import { Result } from 'neverthrow';
import sinon from 'sinon';
import Container from 'typedi';

import { CONSTANTS } from '../constants';
import { BaseResponse, Privilege, Role, User } from '../models';
import { Logger } from '../utils/Logger';
import { RoleService } from './roleService';

describe('RoleService', () => {
  let serviceInstance: RoleService;
  let loggerInstance: Logger;
  let spyLogger: sinon.SinonSpy;

  let findByPkStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let findAndCountAllStub: sinon.SinonStub;
  let findAllUsersStub: sinon.SinonStub;
  let findAllPrivilegesStub: sinon.SinonStub;

  // fakes
  const roleFake = {
    id: 1,
    Users: [{ id: 3 }],
    Privileges: [{ id: 1, RolePrivilege: { add: true, view: true, edit: true, delete: true } }]
  } as Role;

  const roleFakeResponse = {
    id: 1,
    Users: [{ id: 3 }],
    setUsers: sinon.spy() as any,
    setPrivileges: sinon.spy() as any
  } as Role;

  const roleFake2 = {
    id: 2
  } as Role;

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

    findByPkStub = sinon.stub(Role, 'findByPk');
    updateStub = sinon.stub(Role, 'update');
    findAndCountAllStub = sinon.stub(Role, 'findAndCountAll');
    findAllUsersStub = sinon.stub(User, 'findAll');
    findAllPrivilegesStub = sinon.stub(Privilege, 'findAll');
  });

  after(() => {
    findByPkStub.restore();
    updateStub.restore();
    findAndCountAllStub.restore();
    findAllUsersStub.restore();
    findAllPrivilegesStub.restore();
    spyLogger.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(RoleService);
  });

  afterEach(() => {
    findByPkStub.reset();
    updateStub.reset();
    findAndCountAllStub.reset();
    findAllUsersStub.reset();
    findAllPrivilegesStub.reset();
    spyLogger.resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should return an array of items when calling getDashboardData', async () => {
    findAndCountAllStub.resolves({ rows: [roleFake, roleFake2], count: 2 });
    const result = await serviceInstance.getDashboardData(1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.resultsNum).to.equal(2);
      expect(result.value.data).to.deep.equal([roleFake, roleFake2]);
    }
  });

  it('should throw an error when calling getDashboardData', async () => {
    findAndCountAllStub.throws();
    const result = await serviceInstance.getDashboardData(1);
    expect(findAndCountAllStub.calledOnce).to.be.true;
    expect(result.isOk()).to.be.false;
    expect(result.isErr()).to.be.true;
    expect500(result);
  });

  it('should update an item', async () => {
    updateStub
      .withArgs(
        {
          ...roleFake
        },
        {
          where: { id: roleFake.id }
        }
      )
      .resolves([1, [roleFake]]);
    findByPkStub.withArgs(1).resolves(roleFakeResponse);
    findAllUsersStub.resolves([...roleFake.Users]);
    findAllPrivilegesStub.resolves([...roleFake.Privileges]);

    const result = await serviceInstance.update(roleFake);
    expect(updateStub.calledOnce).to.be.true;

    expect((roleFakeResponse.setUsers as sinon.SinonSpy).calledOnceWithExactly(roleFake.Users)).to.be.true;
    expect((roleFakeResponse.setPrivileges as sinon.SinonSpy).calledOnceWithExactly(roleFake.Privileges)).to.be.true;

    expect(findAllPrivilegesStub.calledOnce).to.be.true;
    expect(findAllUsersStub.calledOnce).to.be.true;
    expect(findByPkStub.calledThrice).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data).to.deep.equal(roleFakeResponse);
    }
  });
});
