import { Request, Response } from 'express';

import * as campaignService from './campaign.service';
import { AddCampaignReqDto } from './dto/request/add-campaign.dto';
import { AddReviewReqDto } from './dto/request/add-review.dto';

import commonResponse from '@common/commonResponse';
import errorResponse from '@common/errorResponse';
import { CommonResponse, ResultCode } from '@common/index';
import { IResponse } from '@common/resultCode';
import { Validator } from '@src/middleware';

/**
 * register campaign
 * @param {Request}  req request parameter
 * @param {Response} res response body
 */
export const addCampaign = async (req: Request, res: Response) => {
  try {
    const dto = await Validator.factory(AddCampaignReqDto, req.body as Partial<AddCampaignReqDto>);
    const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

    const pinataKey = await campaignService.addCampaign(dto, files);

    commonResponse(res, ResultCode.CREATED, pinataKey);
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};

/**
 * add campaign review
 * @param {Request}  req request parameter
 * @param {Response} res response body
 */
export const review = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const dto = await Validator.factory(AddReviewReqDto, req.body as Partial<AddReviewReqDto>);
    const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

    await campaignService.review(name, dto, files);

    CommonResponse(res, ResultCode.CREATED);
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};

/**
 * get metadata by name
 * @param {Request}  req request parameter
 * @param {Response} res response body
 */
export const getMetadata = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const metadata = await campaignService.getMetadata(name);

    CommonResponse(res, ResultCode.SUCCESS, { metadata });
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};

/**
 * get all metadata
 * @param {Request}  req request parameter
 * @param {Response} res response body
 */
export const getAllMetadata = async (req: Request, res: Response) => {
  try {
    const metadata = await campaignService.getAllMetadata();

    CommonResponse(res, ResultCode.SUCCESS, { metadata });
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};

/**
 * cancel campaign
 * @param {Request}  req request parameter
 * @param {Response} res response body
 */
export const cancel = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    await campaignService.cancel(name);

    CommonResponse(res, ResultCode.CREATED);
  } catch (err) {
    errorResponse(res, err as IResponse);
  }
};
