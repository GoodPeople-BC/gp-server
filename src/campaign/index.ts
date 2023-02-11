import { Router } from 'express';

import * as campaignController from './campaign.controller';

import { S3 } from '@src/utils';

const router = Router();

router.post(
  '/',
  S3.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
  ]),
  campaignController.addCampaign,
);

router.post(
  '/:name/review',
  S3.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
  ]),
  campaignController.review,
);

export default router;
