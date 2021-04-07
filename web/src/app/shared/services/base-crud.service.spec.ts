import { HttpParams } from '@angular/common/http';

import { of } from 'rxjs';

import { User } from '@/core/modules/user-api/shared';
import { BaseCrudService } from './base-crud.service';
import { currentUserMock } from '../testing/mocks/store.mock';
import { CollectionApiResponse, ItemApiResponse } from '../models/apiResponse';
import { BaseMessage } from '../models';

describe('BaseCrudService', () => {
  class TestCrudService extends BaseCrudService {
    protected readonly url = '/test-api';
  }

  let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy; put: jasmine.Spy; delete: jasmine.Spy };
  let service: TestCrudService;
  const user: User = currentUserMock;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new TestCrudService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected item', () => {
    httpClientSpy.get.and.returnValue(of({ data: user }));

    service.getOne<User>(1).subscribe((response: ItemApiResponse<User>) => expect(response.data).toEqual(user));

    expect(httpClientSpy.get).toHaveBeenCalledWith(`/test-api/${user.id}`);
  });

  it('should return expected full list of items', () => {
    httpClientSpy.get.and.returnValue(of({ data: [user] }));

    service
      .getList<User>()
      .subscribe((response: CollectionApiResponse<User>) => expect(response.data[0]).toEqual(user));

    expect(httpClientSpy.get).toHaveBeenCalledWith('/test-api');
  });

  it('should return expected sorted list of items', () => {
    httpClientSpy.get.and.returnValue(of({ data: [user] }));

    service
      .getList<User>({ sortDirection: 'asc', sortIndex: 'id', pageIndex: 1, pageSize: 5 })
      .subscribe((response: CollectionApiResponse<User>) => expect(response.data[0]).toEqual(user));

    expect(httpClientSpy.get).toHaveBeenCalledWith('/test-api', {
      params: new HttpParams()
        .set('pageIndex', '1')
        .set('pageSize', '5')
        .set('sortIndex', 'id')
        .set('sortDirection', 'asc')
    });
  });

  it('should return created item', () => {
    httpClientSpy.post.and.returnValue(of({ data: user }));

    service.create<User>(user).subscribe((response: ItemApiResponse<User>) => expect(response.data).toEqual(user));

    expect(httpClientSpy.post).toHaveBeenCalledWith('/test-api', user);
  });

  it('should return updated item', () => {
    httpClientSpy.put.and.returnValue(of({ data: user }));

    service
      .update<User>(user, user.id)
      .subscribe((response: ItemApiResponse<User>) => expect(response.data).toEqual(user));

    expect(httpClientSpy.put).toHaveBeenCalledWith(`/test-api/${user.id}`, user);
  });

  it('should return delete success message', () => {
    httpClientSpy.delete.and.returnValue(of({ message: 'User deleted' }));

    service.delete(user.id).subscribe((response: BaseMessage) => expect(response.message).toEqual('User deleted'));

    expect(httpClientSpy.delete).toHaveBeenCalledWith(`/test-api/${user.id}`);
  });
});
