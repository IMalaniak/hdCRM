import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { listPageRequested } from '@/core/modules/user-api/store';
import { User } from '@/core/modules/user-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { Cell, DataRow } from '@/shared/models/table';
import { COLUMN_KEYS } from '@/shared/constants/table.constants';
import { createNavigation, UrlGenerator } from '@/shared/utils';
import { CONSTANTS, LINK_TARGET, LINK_TYPE } from '@/shared/constants';
import { selectUsersPage } from '../store';

export class UsersDataSource extends CommonDataSource<User> {
  loadData(page: PageQuery): void {
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
    return users.map((user) => ({
      id: user.id,
      [COLUMN_KEYS.SEQUENCE]: Cell.createSequenceCell(),
      [COLUMN_KEYS.SELECT]: Cell.createCheckboxCell(user.selected),
      [COLUMN_KEYS.AVATAR]: Cell.createAvatarCell(user),
      [COLUMN_KEYS.LOGIN]: Cell.createStringCell(user.login),
      [COLUMN_KEYS.EMAIL]: Cell.createLinkCell(
        user.email,
        createNavigation(CONSTANTS.PREFIX_MAIL_TO + `${user.email}`, LINK_TYPE.LINK)
      ),
      [COLUMN_KEYS.NAME]: Cell.createStringCell(user.name),
      [COLUMN_KEYS.SURNAME]: Cell.createStringCell(user.surname),
      [COLUMN_KEYS.PHONE]: Cell.createLinkCell(
        user.phone,
        createNavigation(CONSTANTS.PREFIX_TEL + `${user.phone}`, LINK_TYPE.LINK, LINK_TARGET.SELF)
      ),
      [COLUMN_KEYS.DEPARTMENT]: Cell.createLinkCell(
        user.Department?.title,
        UrlGenerator.getDepartmentUrl(user.Department?.id)
      ),
      [COLUMN_KEYS.STATE]: Cell.createStringCell(user.state),
      [COLUMN_KEYS.CREATED_AT]: Cell.createDateCell(user.createdAt),
      [COLUMN_KEYS.UPDATED_AT]: Cell.createDateCell(user.updatedAt),
      [COLUMN_KEYS.ACTIONS]: Cell.createActionsCell()
    }));
  }
}
