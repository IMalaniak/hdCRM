import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { Plan } from '../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectPlanById } from '../store/plan.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { planRequested } from '../store/plan.actions';

@Injectable()
export class PlanResolver implements Resolve<Plan> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Plan> {
    const id = route.params['id'];

    return this.store.pipe(
      select(selectPlanById(id)),
      tap((plan) => {
        if (!plan) {
          this.store.dispatch(planRequested({ id }));
        }
      }),
      filter((plan) => !!plan),
      first()
    );
  }
}
