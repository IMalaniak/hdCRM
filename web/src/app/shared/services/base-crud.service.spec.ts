import { User } from '@/modules/users';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BaseCrudService } from './base-crud.service';
import { currentUserMock } from '../testing/mocks/store.mock';
import { ItemApiResponse } from '../models/apiResponse';

describe('BaseCrudService', () => {
  class TestCrudService extends BaseCrudService {
    protected readonly url = '/test-api';
  }

  let httpClientSpy: { get: jasmine.Spy };
  let service: TestCrudService;
  const user: User = currentUserMock;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new TestCrudService(httpClientSpy as any);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TestCrudService]
    });
    service = TestBed.inject(TestCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected item', () => {
    httpClientSpy.get.and.returnValue(of({ success: true, data: user }));

    service.getOne<User>(1).subscribe((response: ItemApiResponse<User>) => expect(response.data).toBe(user));
  });
});
