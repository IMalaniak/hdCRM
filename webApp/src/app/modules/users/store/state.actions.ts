import { createAction, props } from '@ngrx/store';
import { State } from '../models';

export const allStatesRequested = createAction('[User Details] User States list requested');

export const allStatesLoaded = createAction('[User Details] User States list loaded', props<{ list: State[] }>());
