import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { DynamicFormComponent } from '../dynamic-form.component';
import { DynamicForm } from '@/shared/models';
import { formRequested, selectFormByName } from '@/core/store/dynamic-form';

@Component({
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export abstract class DynamicFormPageModel<T> implements OnInit {
  @ViewChild(DynamicFormComponent) dinamicForm: DynamicFormComponent;

  formJson$: Observable<DynamicForm>;

  protected abstract formName = '';

  get formInvalid(): boolean {
    return this.dinamicForm?.form?.invalid || false;
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
    return this.dinamicForm.form.value;
  }
}
