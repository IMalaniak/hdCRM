import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';

describe('DepartmentService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DepartmentService]
    })
  );

  it('should be created', inject([DepartmentService], (service: DepartmentService) => {
    expect(service).toBeTruthy();
  }));
});
