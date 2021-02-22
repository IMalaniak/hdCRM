// tslint:disable: no-unused-expression

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { err, ok, Result } from 'neverthrow';
import sinon from 'sinon';

import { BaseResponse, CollectionApiResponse, ErrorOrigin } from '../../models';
import { sendResponse } from './sendResponse';

describe('sendResponse', () => {
  const resFake = {
    status: sinon.spy(),
    send: sinon.spy()
  };

  afterEach(() => {
    resFake.status.resetHistory();
    resFake.send.resetHistory();
  });

  it('should send success response', async () => {
    const result: Result<BaseResponse, BaseResponse> = ok({ success: true, message: 'Hello' });

    sendResponse<BaseResponse, BaseResponse>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: true, message: 'Hello' })).to.be.true;
  });

  it('should send success response with no content', async () => {
    const result: Result<CollectionApiResponse<{ id: number }>, BaseResponse> = ok({
      success: false,
      message: 'No content',
      data: []
    });

    sendResponse<CollectionApiResponse<{ id: number }>, BaseResponse>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.NO_CONTENT)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ success: false, message: 'No content', data: [] })).to.be.true;
  });

  it('should send error response with not found', async () => {
    const result: Result<BaseResponse, BaseResponse> = err({
      success: false,
      errorOrigin: ErrorOrigin.CLIENT,
      message: 'Missing param'
    });

    sendResponse<BaseResponse, BaseResponse>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.NOT_FOUND)).to.be.true;
    expect(
      resFake.send.calledOnceWithExactly({ success: false, errorOrigin: ErrorOrigin.CLIENT, message: 'Missing param' })
    ).to.be.true;
  });

  it('should send error response with bad request', async () => {
    const result: Result<BaseResponse, BaseResponse> = err({
      success: false,
      errorOrigin: ErrorOrigin.SERVER,
      message: 'Smth wrong'
    });

    sendResponse<BaseResponse, BaseResponse>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
    expect(
      resFake.send.calledOnceWithExactly({ success: false, errorOrigin: ErrorOrigin.SERVER, message: 'Smth wrong' })
    ).to.be.true;
  });
});
