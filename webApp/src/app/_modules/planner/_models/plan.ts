import { User } from '@/_modules/users';
import { Stage } from './stage';
import { ApiResponse } from '@/core/_models';
import { Asset } from '@/_shared/attachments/_models';

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
  createdAt: Date;
  updatedAt: Date;

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
      if (input.Documents) {
        this.Documents = input.Documents.map((doc: any) => {
          return new Asset(doc);
        });
      }
    }
  }
}

export class PlanServerResponse extends ApiResponse {
  list: Plan[];
  plan: Plan;
  pages: number;

  constructor(input?: any) {
    super();
    if (input) {
      Object.assign(this, input);
      if (input.list && input.list.length > 0) {
        this.list = input.list.map(plan => {
          return new Plan(plan);
        });
      }
    }
  }
}
