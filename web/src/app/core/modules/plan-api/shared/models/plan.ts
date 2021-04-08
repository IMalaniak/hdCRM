import { User } from '@/core/modules/user-api/shared';
import { Asset } from '@/shared/models';
import { TimeStamps } from '@/shared/models/base';
import { Stage } from './stage';

export interface Plan extends TimeStamps {
  id: number;
  title: string;
  description: string;
  budget: number;
  progress: number;
  CreatorId: number;
  activeStageId: number;
  activeStage: Stage;
  Stages?: Stage[];
  Creator: User;
  Participants: User[];
  Documents: Asset[];
  deadline: Date;
}
