import { AddCampaignReqDto } from './dto/request/add-campaign.dto';
import { AddReviewReqDto } from './dto/request/add-review.dto';
import { AddCampaignResDto } from './dto/response/add-campaign.dto';

import { Logger, ResultCode } from '@src/common';
import { Pinata } from '@src/utils';

const logger = Logger.getLogger({ moduleName: 'campaign.service' });

export const addCampaign = async (
  dto: AddCampaignReqDto,
  files: Record<string, Express.MulterS3.File[]>,
): Promise<AddCampaignResDto> => {
  const metadata: Record<string, string> = {
    title: dto.title,
    description: dto.description,
    writerAddress: dto.writerAddress,
  };

  if (files['img1'] && files['img1'][0]) {
    metadata.img1 = files['img1'][0].location;
    metadata.img1Key = files['img1'][0].key;
  }

  if (files['img2'] && files['img2'][0]) {
    metadata.img2 = files['img2'][0].location;
    metadata.img2Key = files['img2'][0].key;
  }

  if (files['img3'] && files['img3'][0]) {
    metadata.img3 = files['img3'][0].location;
    metadata.img3Key = files['img3'][0].key;
  }

  metadata.status = '1';

  const pinataKey = await Pinata.store(metadata);

  return { pinataKey };
};

export const review = async (name: string, dto: AddReviewReqDto, files: Record<string, Express.MulterS3.File[]>) => {
  const logger = Logger.getLogger(Object.assign(Logger, { functionName: 'review' }));

  const metadata: Record<string, string> = {
    reviewContents: dto.contents,
  };

  if (files['img1'] && files['img1'][0]) {
    metadata.reviewImg1 = files['img1'][0].location;
    metadata.reviewImg1Key = files['img1'][0].key;
  }

  if (files['img2'] && files['img2'][0]) {
    metadata.reviewImg2 = files['img2'][0].location;
    metadata.reviewImg2Key = files['img2'][0].key;
  }

  if (files['img3'] && files['img3'][0]) {
    metadata.reviewImg3 = files['img3'][0].location;
    metadata.reviewImg3Key = files['img3'][0].key;
  }

  const cid = await Pinata.getCidByMetadataName(name).catch((err) => {
    logger.error(`failed to getCidByMetadataName, error=${JSON.stringify(err)}`);
    throw ResultCode.PINATA_ERROR;
  });

  await Pinata.update(cid, name, metadata).catch((err) => {
    logger.error(`failed to update Pinata, cid=${cid} name=${name} error=${JSON.stringify(err)}`);
    throw ResultCode.PINATA_ERROR;
  });

  return null;
};

export const getMetadata = async (name: string) => {
  const data = await Pinata.getMetadataByName(name);

  // make imgs field
  const imgs = [data.img1, data.img2 ? data.img2 : null, data.img3 ? data.img3 : null];
  data.imgs = imgs.filter(Boolean);

  // make review imgs field
  const reviewImgs = [
    data.reviewImg1,
    data.reviewImg2 ? data.reviewImg2 : null,
    data.reviewImg3 ? data.reviewImg3 : null,
  ];
  data.reviewImgs = reviewImgs.filter(Boolean);

  // remove necessary fields
  delete data.img1;
  delete data.img1Key;
  delete data.img2;
  delete data.img2Key;
  delete data.img3;
  delete data.img3Key;

  // remove review imgs
  delete data.reviewImg1;
  delete data.reviewImg1Key;
  delete data.reviewImg2;
  delete data.reviewImg2Key;
  delete data.reviewImg3;
  delete data.reviewImg3Key;

  return data;
};

export const getAllMetadata = async () => {
  const rows = await Pinata.getAllMetadata();

  const data = rows.map((row: any) => {
    const keyvalues = row.metadata.keyvalues;

    if (!keyvalues) return;

    // make imgs field
    const imgs = [keyvalues.img1, keyvalues.img2 && keyvalues.img2, keyvalues.img3 && keyvalues.img3];
    keyvalues.imgs = imgs.filter(Boolean);

    // make review imgs field
    const reviewImgs = [
      keyvalues.reviewImg1 ? keyvalues.reviewIm1 : null,
      keyvalues.reviewImg2 ? keyvalues.reviewImg2 : null,
      keyvalues.reviewImg3 ? keyvalues.reviewImg3 : null,
    ];
    keyvalues.reviewImgs = reviewImgs.filter(Boolean);

    delete keyvalues.img1;
    delete keyvalues.img1Key;
    delete keyvalues.img2;
    delete keyvalues.img2Key;
    delete keyvalues.img3;
    delete keyvalues.img3Key;

    // remove review imgs
    delete keyvalues.reviewImg1;
    delete keyvalues.reviewImg1Key;
    delete keyvalues.reviewImg2;
    delete keyvalues.reviewImg2Key;
    delete keyvalues.reviewImg3;
    delete keyvalues.reviewImg3Key;

    return { name: row.name, keyvalues };
  });

  return data;
};

export const cancel = async (name: string) => {
  const logger = Logger.getLogger(Object.assign(Logger, { functionName: 'cancel' }));

  const metadata: Record<string, string> = {
    status: '0',
  };

  const cid = await Pinata.getCidByMetadataName(name).catch((err) => {
    logger.error(`failed to getCidByMetadataName, error=${JSON.stringify(err)}`);
    throw ResultCode.PINATA_ERROR;
  });

  await Pinata.update(cid, name, metadata).catch((err) => {
    logger.error(`failed to update Pinata, cid=${cid} name=${name} error=${JSON.stringify(err)}`);
    throw ResultCode.PINATA_ERROR;
  });

  return null;
};
