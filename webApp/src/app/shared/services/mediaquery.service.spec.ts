import { TestBed } from '@angular/core/testing';

import { MediaqueryService } from './mediaquery.service';

describe('MediaqueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaqueryService = TestBed.get(MediaqueryService);
    expect(service).toBeTruthy();
  });
});
