import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';

describe('DepartmentService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: DepartmentService = TestBed.inject(DepartmentService);
    expect(service).toBeTruthy();
  });
});
