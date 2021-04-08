import { TimeStamps } from '@/shared/models/base';

export interface PlanStage extends TimeStamps {
  id: number;
  PlanId: number;
  StageId: number;
  keyString: string;
  description: string;
  order: number;
  completed: boolean;
}
