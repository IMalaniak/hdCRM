import { TestBed } from '@angular/core/testing';

import { BsIconsService } from './bs-icons.service';

describe('BsIconsService', () => {
  let service: BsIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BsIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
