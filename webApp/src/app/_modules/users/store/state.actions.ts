import { Action } from '@ngrx/store';
import { State } from '../_models';

export enum StateActionTypes {
  ALLSTATES_REQUESTED = '[User Details] User States list requested',
  ALLSTATES_LOADED = '[User Details] User States list loaded'
}

export class AllStatesRequested implements Action {
  readonly type = StateActionTypes.ALLSTATES_REQUESTED;
}

export class AllStatesLoaded implements Action {
  readonly type = StateActionTypes.ALLSTATES_LOADED;
  constructor(public payload: { states: State[] }) {}
}

export type StateActions =
  | AllStatesRequested
  | AllStatesLoaded;
