import { Action } from '@ngrx/store';
import { Plan, PlanServerResponse, StageServerResponse, Stage } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum PlanActionTypes {
  PlanRequested = '[Plan Details] Plan Requested',
  PlanLoaded = '[Plans API] Plan Loaded',
  PlanSaved = '[Plan Details] Plan Changes Saved',
  CreatePlan = '[Add Plan] Add Plan Requested',
  CreatePlanSuccess = '[Plans API] Add Plan Success',
  CreatePlanFail = '[Plans API] Add Plan Fail',
  ListPageRequested = '[Plans List] Plans Page Requested',
  ListPageLoaded = '[Plans API] Plans Page Loaded',
  ListPageCancelled = '[Plans API] Plans Page Cancelled',
  CreateStage = '[Stages Dialog Window] New Stage Creation Initialized',
  CreateStageSuccess = '[Stages API] Create Stage Success',
  CreateStageFail = '[Stages API] Create Stage Fail',
  AllStagesRequestedFromDialogWindow = '[Stages Dialog Window] Stages List Requested',
  AllStagesRequestedFromDashboard = '[Dashboard] Stages List Requested',
  AllStagesLoaded = '[Stages API] Stages List Loaded',
  StageSaved = '[Stages Dialog Window] Stage Saved'
}

export class PlanRequested implements Action {
  readonly type = PlanActionTypes.PlanRequested;
  constructor(public payload: {planId: number}) {}
}

export class PlanLoaded implements Action {
  readonly type = PlanActionTypes.PlanLoaded;
  constructor(public payload: {plan: Plan}) {}
}

export class PlanSaved implements Action {
  readonly type = PlanActionTypes.PlanSaved;
  constructor(public payload: {plan: Update<Plan>}) {}
}

export class CreatePlan implements Action {
  readonly type = PlanActionTypes.CreatePlan;
  constructor(public payload: {plan: Plan}) {}
}

export class CreatePlanSuccess implements Action {
  readonly type = PlanActionTypes.CreatePlanSuccess;
  constructor(public payload: {plan: Plan}) { }
}

export class CreatePlanFail implements Action {
  readonly type = PlanActionTypes.CreatePlanFail;
  constructor(public payload: string) { }
}

export class ListPageRequested implements Action {
  readonly type = PlanActionTypes.ListPageRequested;
  constructor(public payload: {page: PageQuery}) {}
}

export class ListPageLoaded implements Action {
  readonly type = PlanActionTypes.ListPageLoaded;
  constructor(public payload: PlanServerResponse) {}
}

export class ListPageCancelled implements Action {
  readonly type = PlanActionTypes.ListPageCancelled;
}

export class AllStagesRequestedFromDialogWindow implements Action {
  readonly type = PlanActionTypes.AllStagesRequestedFromDialogWindow;
}

export class AllStagesRequestedFromDashboard implements Action {
  readonly type = PlanActionTypes.AllStagesRequestedFromDashboard;
}

export class AllStagesLoaded implements Action {
  readonly type = PlanActionTypes.AllStagesLoaded;
  constructor(public payload: StageServerResponse) {}
}

export class StageSaved implements Action {
  readonly type = PlanActionTypes.StageSaved;
  constructor(public payload: {stage: Update<Stage>}) {}
}

export class CreateStage implements Action {
  readonly type = PlanActionTypes.CreateStage;
  constructor(public payload: {stage: Stage}) {}
}

export class CreateStageSuccess implements Action {
  readonly type = PlanActionTypes.CreateStageSuccess;

  constructor(public payload: {stage: Stage}) { }
}

export class CreateStageFail implements Action {
  readonly type = PlanActionTypes.CreateStageFail;

  constructor(public payload: string) { }
}

export type PlanActions = PlanRequested
  | PlanLoaded
  | PlanSaved
  | CreatePlan
  | CreatePlanSuccess
  | CreatePlanFail
  | ListPageRequested
  | ListPageLoaded
  | ListPageCancelled
  | AllStagesRequestedFromDashboard
  | AllStagesRequestedFromDialogWindow
  | AllStagesLoaded
  | StageSaved
  | CreateStage
  | CreateStageSuccess
  | CreateStageFail;
