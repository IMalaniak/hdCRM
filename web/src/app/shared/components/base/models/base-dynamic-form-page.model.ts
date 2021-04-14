import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AppState } from '@core/store';
import { formRequested, selectFormByName } from '@core/store/dynamic-form';
import { DynamicForm } from '@shared/models';

import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';

@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class BaseDynamicFormPageModel<T> implements OnInit {
  @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;

  formJson$: Observable<DynamicForm>;

  protected abstract formName = '';

  get formInvalid(): boolean {
    return this.dynamicForm?.form?.invalid || false;
  }

  constructor(protected readonly store$: Store<AppState>) {}

  ngOnInit(): void {
    this.formJson$ = this.store$.pipe(
      select(selectFormByName(this.formName)),
      tap((form) => {
        if (!form) {
          this.store$.dispatch(formRequested({ formName: this.formName }));
        }
      }),
      filter((form) => !!form)
    );
  }

  protected getFormValues(): T {
    return this.dynamicForm?.form?.value;
  }
}
