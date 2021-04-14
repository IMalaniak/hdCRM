import { Plan } from './plan';
import { PlanStage } from './planStage';

export interface Stage {
  id: number;
  keyString: string;
  Details: PlanStage;
  Plans: Plan[];
}
