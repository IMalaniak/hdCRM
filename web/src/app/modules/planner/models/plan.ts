import { User } from '@/modules/users';
import { Stage } from './stage';
import { Asset } from '@/shared/models';

export interface Plan {
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
}
