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
}

export class StageDetails extends PlanStage {
  constructor(order: number) {
    super();
    this.order = order;
    this.completed = false;
    this.description = '';
  }
}
