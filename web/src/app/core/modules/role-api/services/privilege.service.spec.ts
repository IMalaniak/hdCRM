import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

import { PrivilegeService } from './privilege.service';

describe('PrivilegeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PrivilegeService]
    });
  });

  it('should be created', inject([PrivilegeService], (service: PrivilegeService) => {
    expect(service).toBeTruthy();
  }));
});
