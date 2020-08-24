import { PlanStage } from './planStage';
import { Plan } from './plan';

export interface Stage {
  id: number;
  keyString: string;
  Details: PlanStage;
  Plans: Plan[];
}
