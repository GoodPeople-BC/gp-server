import { Router } from 'express';

import * as donationController from './donation.controller';

const router = Router();

router.post('/', donationController.donate);

export default router;
