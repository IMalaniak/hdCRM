import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { listPageRequested } from '@/core/modules/user-api/store';
import { User } from '@/core/modules/user-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { Cell, DataRow } from '@/shared/models/table';
import { COLUMN_KEY } from '@/shared/constants/table.constants';
import { createNavigation, UrlGenerator } from '@/shared/utils';
import { CommonConstants, LINK_TARGET, LINK_TYPE } from '@/shared/constants';
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
      [COLUMN_KEY.SEQUENCE]: Cell.createSequenceCell(),
      [COLUMN_KEY.SELECT]: Cell.createCheckboxCell(),
      [COLUMN_KEY.AVATAR]: Cell.createAvatarCell(user),
      [COLUMN_KEY.LOGIN]: Cell.createStringCell(user.login),
      [COLUMN_KEY.EMAIL]: Cell.createLinkCell(
        user.email,
        createNavigation(CommonConstants.PREFIX_MAIL_TO + `${user.email}`, LINK_TYPE.LINK)
      ),
      [COLUMN_KEY.NAME]: Cell.createStringCell(user.name),
      [COLUMN_KEY.SURNAME]: Cell.createStringCell(user.surname),
      [COLUMN_KEY.PHONE]: Cell.createLinkCell(
        user.phone,
        createNavigation(CommonConstants.PREFIX_TEL + `${user.phone}`, LINK_TYPE.LINK, LINK_TARGET.SELF)
      ),
      [COLUMN_KEY.DEPARTMENT]: Cell.createLinkCell(
        user.Department?.title,
        UrlGenerator.getDepartmentUrl(user.Department?.id)
      ),
      [COLUMN_KEY.STATE]: Cell.createStringCell(user.state),
      [COLUMN_KEY.CREATED_AT]: Cell.createDateCell(user.createdAt),
      [COLUMN_KEY.UPDATED_AT]: Cell.createDateCell(user.updatedAt),
      [COLUMN_KEY.ACTIONS]: Cell.createActionsCell()
    }));
  }
}
