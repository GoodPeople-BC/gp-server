import { Response } from 'express';

import { IResponse } from './resultCode';


const commonResponse = (res: Response, resultCode: IResponse, data?: any) => {
  res.status(200).json({
    data,
  });
};

export default commonResponse;
