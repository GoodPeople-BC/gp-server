import { Router } from 'express';

import * as donationController from './donation.controller';

import { S3 } from '@src/utils';

const router = Router();

router.post(
  '/',
  S3.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
  ]),
  donationController.donate,
);

router.post(
  '/:name/review',
  S3.upload.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
  ]),
  donationController.review,
);

export default router;
