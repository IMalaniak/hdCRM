import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

import { StageService } from './stage.service';

describe('StageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [StageService]
    });
  });

  it('should be created', inject([StageService], (service: StageService) => {
    expect(service).toBeTruthy();
  }));
});
