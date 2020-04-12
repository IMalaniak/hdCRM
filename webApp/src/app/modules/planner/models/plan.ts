import { User } from '@/modules/users';
import { Stage } from './stage';
import { Asset, ApiResponse } from '@/shared';

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
    }
  }
}
