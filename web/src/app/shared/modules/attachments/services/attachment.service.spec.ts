import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AttachmentService } from './attachment.service';

describe('AttachmentService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: AttachmentService = TestBed.inject(AttachmentService);
    expect(service).toBeTruthy();
  });
});
