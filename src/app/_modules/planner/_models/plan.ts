import { User } from '@/_modules/users';
import { Asset } from '@/_modules/attachments';
import { Stage } from '@/_modules/planner';

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
}
