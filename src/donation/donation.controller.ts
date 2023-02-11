import { Request, Response } from 'express';

import * as donationService from './donation.service';
import { AddDonationReqDto } from './dto/request/add-donation.dto';
import { AddReviewReqDto } from './dto/request/add-review.dto';

import commonResponse from '@common/commonResponse';
import errorResponse from '@common/errorResponse';
import { CommonResponse, ResultCode } from '@common/index';
import { IResponse } from '@common/resultCode';
import { Validator } from '@src/middleware';

export const donate = async (req: Request, res: Response) => {
  try {
    const dto = await Validator.factory(AddDonationReqDto, req.body as Partial<AddDonationReqDto>);
    const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

    const pinataKey = await donationService.donate(dto, files);

    commonResponse(res, ResultCode.CREATED, pinataKey);
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};

export const review = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const dto = await Validator.factory(AddReviewReqDto, req.body as Partial<AddReviewReqDto>);
    const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

    await donationService.review(name, dto, files);

    CommonResponse(res, ResultCode.CREATED);
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};
