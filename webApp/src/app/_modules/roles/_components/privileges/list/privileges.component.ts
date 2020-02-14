import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Privilege } from '../../../_models';
import { AddPrivilegeDialogComponent } from '../add-dialog/add-privilege-dialog.component';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { allPrivilegesRequested, createPrivilege } from '@/_modules/roles/store/privilege.actions';
import { selectAllPrivileges, selectPrivilegesLoading } from '@/_modules/roles/store/privilege.selectors';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss']
})
export class PrivilegesComponent implements OnInit, OnDestroy {
  privileges: Privilege[];
  selection = new SelectionModel<Privilege>(true, []);
  resultsLength: number;
  isLoading$: Observable<boolean>;

  displayedColumns = ['select', 'title', 'key'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(private dialog: MatDialog, private _formBuilder: FormBuilder, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(allPrivilegesRequested());

    this.isLoading$ = this.store.pipe(select(selectPrivilegesLoading));

    this.store
      .pipe(
        takeUntil(this.unsubscribe),
        select(selectAllPrivileges),
        map(data => {
          this.resultsLength = data.length;
          return data;
        })
      )
      .subscribe(data => (this.privileges = data));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.resultsLength;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.privileges.forEach(row => this.selection.select(row));
  }

  createPrivilegeDialog(): void {
    const dialogRef = this.dialog.open(AddPrivilegeDialogComponent, {
      data: this._formBuilder.group({
        keyString: new FormControl('', [Validators.required, Validators.minLength(4)]),
        title: new FormControl('', [Validators.required, Validators.minLength(4)])
      })
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if (result) {
          const privilege = new Privilege(result);
          this.store.dispatch(createPrivilege({ privilege }));
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
