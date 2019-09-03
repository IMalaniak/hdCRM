import { PlanStage } from './planStage';
import { ApiResponse } from '@/core/_models';
import { Plan } from './plan';

export class Stage {
  id: number;
  keyString: string;
  Details: PlanStage;
  Plans: Plan[];

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
      if (input.Details) {
        this.Details = new PlanStage(input.Details);
      }
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
    this.stage = new Stage();
  }
}
