import { Response } from 'express';

import { IResponse } from './resultCode';

/**
 * common response
 * @param {Response}  res        express response
 * @param {IResponse} resultCode result object
 * @param {<T>}       data       response data
 */
const commonResponse = <T = object>(res: Response, resultCode: IResponse, data?: T) => {
  res.status(resultCode.status || 200).json({
    data,
  });
};

export default commonResponse;
