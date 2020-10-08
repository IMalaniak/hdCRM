import { TestBed } from '@angular/core/testing';

import { DialogSizeService } from './dialog-size.service';

describe('DialogSizeService', () => {
  let service: DialogSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
