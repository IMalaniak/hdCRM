export interface PlanStage {
  id: number;
  PlanId: number;
  StageId: number;
  keyString: string;
  description: string;
  order: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
