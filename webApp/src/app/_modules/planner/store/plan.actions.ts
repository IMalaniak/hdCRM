import { Action } from '@ngrx/store';
import { Plan, PlanServerResponse, StageServerResponse, Stage } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum PlanActionTypes {
  PLAN_REQUESTED = '[Plan Details] Plan Requested',
  PLAN_LOADED = '[Plans API] Plan Loaded',
  PLAN_SAVED = '[Plan Details] Plan Changes Saved',
  PLAN_CREATE = '[Add Plan] Add Plan Requested',
  PLAN_CREATE_SUCCESS = '[Plans API] Add Plan Success',
  PLAN_CREATE_FAIL = '[Plans API] Add Plan Fail',
  DELETE_PLAN = '[Plans List] Delete Plan Requested',
  PLAN_LIST_PAGE_REQUESTED = '[Plans List] Plans Page Requested',
  PLAN_LIST_PAGE_LOADED = '[Plans API] Plans Page Loaded',
  PLAN_LIST_PAGE_CANCELLED = '[Plans API] Plans Page Cancelled',
  STAGE_CREATE = '[Stages Dialog Window] New Stage Creation Initialized',
  STAGE_CREATE_SUCCESS = '[Stages API] Create Stage Success',
  STAGE_CREATE_FAIL = '[Stages API] Create Stage Fail',
  ALLSTAGES_REQUESTED_FROM_DIALOGWINDOW = '[Stages Dialog Window] Stages List Requested',
  ALLSTAGES_REQUESTED_FROM_DASHBOARD = '[Dashboard] Stages List Requested',
  ALLSTAGES_LOADED = '[Stages API] Stages List Loaded',
  STAGE_SAVED = '[Stages Dialog Window] Stage Saved'
}

export class PlanRequested implements Action {
  readonly type = PlanActionTypes.PLAN_REQUESTED;
  constructor(public payload: { planId: number }) {}
}

export class PlanLoaded implements Action {
  readonly type = PlanActionTypes.PLAN_LOADED;
  constructor(public payload: { plan: Plan }) {}
}

export class PlanSaved implements Action {
  readonly type = PlanActionTypes.PLAN_SAVED;
  constructor(public payload: { plan: Update<Plan> }) {}
}

export class CreatePlan implements Action {
  readonly type = PlanActionTypes.PLAN_CREATE;
  constructor(public payload: { plan: Plan }) {}
}

export class CreatePlanSuccess implements Action {
  readonly type = PlanActionTypes.PLAN_CREATE_SUCCESS;
  constructor(public payload: { plan: Plan }) {}
}

export class CreatePlanFail implements Action {
  readonly type = PlanActionTypes.PLAN_CREATE_FAIL;
  constructor(public payload: string) {}
}

export class DeletePlan implements Action {
  readonly type = PlanActionTypes.DELETE_PLAN;
  constructor(public payload: { planId: number }) {}
}
export class ListPageRequested implements Action {
  readonly type = PlanActionTypes.PLAN_LIST_PAGE_REQUESTED;
  constructor(public payload: { page: PageQuery }) {}
}

export class ListPageLoaded implements Action {
  readonly type = PlanActionTypes.PLAN_LIST_PAGE_LOADED;
  constructor(public payload: PlanServerResponse) {}
}

export class ListPageCancelled implements Action {
  readonly type = PlanActionTypes.PLAN_LIST_PAGE_CANCELLED;
}

export class AllStagesRequestedFromDialogWindow implements Action {
  readonly type = PlanActionTypes.ALLSTAGES_REQUESTED_FROM_DIALOGWINDOW;
}

export class AllStagesRequestedFromDashboard implements Action {
  readonly type = PlanActionTypes.ALLSTAGES_REQUESTED_FROM_DASHBOARD;
}

export class AllStagesLoaded implements Action {
  readonly type = PlanActionTypes.ALLSTAGES_LOADED;
  constructor(public payload: StageServerResponse) {}
}

export class StageSaved implements Action {
  readonly type = PlanActionTypes.STAGE_SAVED;
  constructor(public payload: { stage: Update<Stage> }) {}
}

export class CreateStage implements Action {
  readonly type = PlanActionTypes.STAGE_CREATE;
  constructor(public payload: { stage: Stage }) {}
}

export class CreateStageSuccess implements Action {
  readonly type = PlanActionTypes.STAGE_CREATE_SUCCESS;

  constructor(public payload: { stage: Stage }) {}
}

export class CreateStageFail implements Action {
  readonly type = PlanActionTypes.STAGE_CREATE_FAIL;

  constructor(public payload: string) {}
}

export type PlanActions =
  | PlanRequested
  | PlanLoaded
  | PlanSaved
  | CreatePlan
  | CreatePlanSuccess
  | CreatePlanFail
  | DeletePlan
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
