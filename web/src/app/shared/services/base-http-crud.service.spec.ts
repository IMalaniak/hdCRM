import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { BaseHttpCrudService } from './base-http-crud.service';
import { SharedModule } from '../shared.module';

describe('BaseHttpCrudService', () => {
  let service: BaseHttpCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientModule],
      providers: [BaseHttpCrudService]
    });
    service = TestBed.inject(BaseHttpCrudService);
  });

  it('should be created', inject([BaseHttpCrudService], (service: BaseHttpCrudService) => {
    expect(service).toBeTruthy();
  }));
});
