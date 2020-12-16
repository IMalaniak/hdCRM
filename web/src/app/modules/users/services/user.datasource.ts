import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { User } from '../models/';
import { listPageRequested } from '../store/user.actions';
import { selectUsersPage } from '../store/user.selectors';
import { CellValue, createNavigation, DataRow } from '@/shared/models/table';
import { COLUMN_NAMES } from '@/shared/constants/table.constants';
import { UrlGenerator } from '@/shared/utils';
import { CONSTANTS, LINK_TARGET, LINK_TYPE } from '@/shared/constants';

export class UsersDataSource extends CommonDataSource<User> {
  loadData(page: PageQuery) {
    this.store$
      .pipe(
        select(selectUsersPage(page)),
        tap((users) => {
          if (users.length > 0) {
            this.listSubject.next(this.mapToDataRows(users));
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  protected mapToDataRows(users: User[]): DataRow[] {
    // TODO: investigate why received error: TypeError: Cannot read property 'add' of undefined
    return users.map((user) => ({
      id: user.id,
      [COLUMN_NAMES.SEQUENCE_NUMBER]: CellValue.createSequenceCell(),
      [COLUMN_NAMES.AVATAR]: CellValue.createAvatarCell(user),
      [COLUMN_NAMES.LOGIN]: CellValue.createStringCell(user.login),
      [COLUMN_NAMES.EMAIL]: CellValue.createLinkCell(
        user.email,
        createNavigation(CONSTANTS.PREFIX_MAIL_TO + `${user.email}`, LINK_TYPE.LINK)
      ),
      [COLUMN_NAMES.NAME]: CellValue.createStringCell(user.name),
      [COLUMN_NAMES.SURNAME]: CellValue.createStringCell(user.surname),
      [COLUMN_NAMES.PHONE]: CellValue.createLinkCell(
        user.phone,
        createNavigation(CONSTANTS.PREFIX_TEL + `${user.phone}`, LINK_TYPE.LINK, LINK_TARGET.SELF)
      ),
      [COLUMN_NAMES.DEPARTMENT]: CellValue.createLinkCell(
        user.Department?.title,
        UrlGenerator.getDepartmentUrl(user.Department.id)
      ),
      [COLUMN_NAMES.STATE]: CellValue.createStringCell(user.state),
      [COLUMN_NAMES.CREATED_AT]: CellValue.createDateCell(user.createdAt),
      [COLUMN_NAMES.UPDATED_AT]: CellValue.createDateCell(user.updatedAt),
      [COLUMN_NAMES.ACTIONS]: CellValue.createActionsCell()
    }));
  }
}
