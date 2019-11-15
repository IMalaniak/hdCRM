export class PlanStage {
  id: number;
  PlanId: number;
  StageId: number;
  keyString: string;
  description: string;
  order: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
