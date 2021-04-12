import { TestBed } from '@angular/core/testing';

import { SharedModule } from '../shared.module';

import { ToastMessageService } from './toast-message.service';

describe('ToastMessageService', () => {
  let service: ToastMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    });
    service = TestBed.inject(ToastMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
