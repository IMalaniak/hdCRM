export class PlanStage {
  id: number;
  PlanId: number;
  StageId: number;
  keyString: string;
  description: string;
  order: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
