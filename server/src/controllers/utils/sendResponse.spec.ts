/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { err, ok, Result } from 'neverthrow';
import sinon from 'sinon';

import { BadRequestError, CustomError, NotFoundError } from '../../errors';
import { BaseResponse, CollectionApiResponse } from '../../models';

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

  it('should send success response with no content', () => {
    const result: Result<BaseResponse, CustomError> = ok({});

    sendResponse<BaseResponse, CustomError>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.NO_CONTENT)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({})).to.be.true;
  });

  it('should send success response', () => {
    const result: Result<CollectionApiResponse<{ id: number }>, CustomError> = ok({
      message: 'Content',
      data: []
    });

    sendResponse<CollectionApiResponse<{ id: number }>, CustomError>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: 'Content', data: [] })).to.be.true;
  });

  it('should send error response with not found', () => {
    const result: Result<BaseResponse, CustomError> = err(new NotFoundError('Missing param'));

    sendResponse<BaseResponse, CustomError>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.NOT_FOUND)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: 'Missing param' })).to.be.true;
  });

  it('should send error response with bad request', () => {
    const result: Result<BaseResponse, CustomError> = err(new BadRequestError('Smth wrong'));

    sendResponse<BaseResponse, CustomError>(result, resFake as any);

    expect(resFake.status.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
    expect(resFake.send.calledOnceWithExactly({ message: 'Smth wrong' })).to.be.true;
  });
});
