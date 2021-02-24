// tslint:disable: no-unused-expression

import { expect } from 'chai';
import sinon from 'sinon';
import Container from 'typedi';

import { Plan, User } from '../models';
import { PlanService } from './planService';

describe('PlanService', () => {
  let serviceInstance: PlanService;

  let findByPkStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let findAllUsersStub: sinon.SinonStub;

  // fakes
  const planFake = {
    id: 1,
    Participants: [{ id: 3 }],
    Stages: [{ id: 1 }]
  } as Plan;

  const planFakeResponse = {
    id: 1,
    setParticipants: sinon.spy() as any
  } as Plan;

  before(() => {
    findByPkStub = sinon.stub(Plan, 'findByPk');
    updateStub = sinon.stub(Plan, 'update');
    findAllUsersStub = sinon.stub(User, 'findAll');
  });

  after(() => {
    findByPkStub.restore();
    updateStub.restore();
    findAllUsersStub.restore();
  });

  beforeEach(() => {
    serviceInstance = Container.get(PlanService);
  });

  afterEach(() => {
    findByPkStub.reset();
    updateStub.reset();
    findAllUsersStub.reset();
    (planFakeResponse.setParticipants as sinon.SinonSpy).resetHistory();
  });

  it('should be defined', () => {
    expect(serviceInstance).to.not.be.undefined;
  });

  it('should update an item', async () => {
    updateStub
      .withArgs(
        {
          ...planFake
        },
        {
          where: { id: planFake.id }
        }
      )
      .resolves([1, [planFake]]);
    findByPkStub.withArgs(1).resolves(planFakeResponse);
    findAllUsersStub.resolves([...planFake.Participants]);

    const result = await serviceInstance.update(planFake);
    expect(updateStub.calledOnce).to.be.true;

    expect((planFakeResponse.setParticipants as sinon.SinonSpy).calledOnceWithExactly(planFake.Participants)).to.be
      .true;

    expect(findAllUsersStub.calledOnce).to.be.true;
    expect(findByPkStub.calledTwice).to.be.true;
    expect(result.isOk()).to.be.true;
    expect(result.isErr()).to.be.false;
    if (result.isOk()) {
      expect(result.value.success).to.be.true;
      expect(result.value.data).to.deep.equal(planFakeResponse);
    }
  });
});
