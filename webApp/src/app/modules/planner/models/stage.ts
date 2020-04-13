import { PlanStage } from './planStage';
import { ApiResponse } from '@/shared';
import { Plan } from './plan';

export interface Stage {
  id: number;
  keyString: string;
  Details: PlanStage;
  Plans: Plan[];
}

export interface StageServerResponse extends ApiResponse {
  list: Stage[];
  stage: Stage;
  pages: number;
}
