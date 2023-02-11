// import { IResponse, ResultCode } from './resultCode';

import { Response } from 'express';

import { IResponse } from './resultCode';

import { ResultCode } from '@common/index';

const errorResponse = (res: Response, errorCode: IResponse) => {
  res.status(errorCode.status || 500).json({
    error: {
      code: errorCode.code || ResultCode.UNKNOWN.code,
      message: errorCode.message || ResultCode.UNKNOWN.message,
    },
  });
};

export default errorResponse;
