import { PlanStage } from './planStage';
import { ApiResponse } from '@/shared';
import { Plan } from './plan';

export class Stage {
  id: number;
  keyString: string;
  Details: PlanStage;
  Plans: Plan[];

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}

export class StageServerResponse extends ApiResponse {
  list: Stage[];
  stage: Stage;
  pages: number;

  constructor() {
    super();
    this.list = [];
  }
}
