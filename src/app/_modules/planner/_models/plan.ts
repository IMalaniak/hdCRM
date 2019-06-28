import { User } from '@/_modules/users';
import { Asset } from '@/_modules/attachments';
import { Stage } from './stage';
import { ApiResponse } from '@/core/_models';

export class Plan {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  progress: number;
  CreatorId: number;
  activeStageId: number;
  activeStage: Stage;
  Stages: Stage[];
  Creator: User;
  Participants: User[];
  Documents: Asset[];
  createdAt: string;
  updatedAt: string;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
      if (input.Creator) {
        this.Creator = new User(input.Creator);
      }
      if (input.Participants) {
        this.Participants = input.Participants.map((user: any) => {
          return new User(user);
        });
      }
      if (input.Stages) {
        this.Stages = input.Stages.map((stage: any) => {
          return new Stage(stage);
        });
      }
    }
  }
}

export class PlanServerResponse extends ApiResponse {
  list: Plan[];
  plan: Plan;
  pages: number;

  constructor() {
    super();
    this.list = [];
    this.plan = new Plan();
  }
}
