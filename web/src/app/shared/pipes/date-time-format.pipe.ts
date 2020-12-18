import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { getDateFormatState, getTimeFormatState } from '@/core/reducers/preferences/preferences.selectors';
import { IDateFormat, ITimeFormat } from '../constants';

/**
 * @description CustomDateTimePipe pipe for date and time formatted
 * @usage {{ value | dateTimeFormat | async }}
 */

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {
  /**
   * @param value The date expression: a `Date` object,  a number
   * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
   * @returns A date string in format which is recieved from preference store
   */

  dateFormatState$: Observable<IDateFormat> = this.store$.pipe(select(getDateFormatState));
  timeFormatState$: Observable<ITimeFormat> = this.store$.pipe(select(getTimeFormatState));

  constructor(private store$: Store<AppState>, private datePipe: DatePipe) {}

  transform(value: string | Date | null): Observable<string> {
    if (!(value == null || value === '' || value !== value)) {
      return combineLatest([this.dateFormatState$, this.timeFormatState$]).pipe(
        map(([dateFormat, timeFormat]) => this.datePipe.transform(value, `${dateFormat}, ${timeFormat}`))
      );
    }
    return of(null);
  }
}
