


import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import { Plan } from '../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectPlanById } from '../store/plan.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { PlanRequested } from '../store/plan.actions';

@Injectable()
export class PlanResolver implements Resolve<Plan> {

    constructor(
        private store: Store<AppState>) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Plan> {

        const planId = route.params['id'];

        return this.store.pipe(
            select(selectPlanById(planId)),
            tap(plan => {
                if (!plan) {
                    this.store.dispatch(new PlanRequested({planId}));
                }
            }),
            filter(plan => !!plan),
            first()
        );
    }

}

