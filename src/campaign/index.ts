import { Router } from 'express';

import * as campaignController from './campaign.controller';

import { S3 } from '@utils/index';

const router = Router();

// register campaign
router.post(
  '/',
  S3.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
  ]),
  campaignController.addCampaign,
);

// add campaign review
router.post(
  '/:name/review',
  S3.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
  ]),
  campaignController.review,
);

// cancle campaign
router.post('/:name/cancel', campaignController.cancel);

// get campaign by pinata name
router.get('/name/:name', campaignController.getMetadata);

// get all campaigns
router.get('/', campaignController.getAllMetadata);

export default router;
