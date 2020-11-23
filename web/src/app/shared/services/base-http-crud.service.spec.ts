import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { BaseCrudService } from './base-http-crud.service';

describe('BaseCrudService', () => {
  let service: BaseCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BaseCrudService]
    });
    service = TestBed.inject(BaseCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
