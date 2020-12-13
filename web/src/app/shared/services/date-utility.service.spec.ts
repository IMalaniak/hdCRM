import { TestBed } from '@angular/core/testing';

import { DateUtilityService } from './date-utility.service';

describe('DateUtilityService', () => {
  let service: DateUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show difference from today in days', () => {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    expect(service.diffDaysFromToday(target)).toBe(1);
  });

  it('should add one day from today', () => {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    expect(service.addFutureDays(1)).toEqual(target);
  });
});
