import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilityService {
  private _MS_PER_DAY = 1000 * 60 * 60 * 24;

  diffDaysFromToday(target: Date): number {
    const passwordExpire = new Date(target);
    const currentDate = new Date();
    const utc1 = Date.UTC(passwordExpire.getFullYear(), passwordExpire.getMonth(), passwordExpire.getDate());
    const utc2 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    return Math.floor((utc1 - utc2) / this._MS_PER_DAY);
  }

  addFutureDays(days: number): Date {
    const target = new Date();
    target.setDate(new Date().getDate() + days);
    return target;
  }
}
