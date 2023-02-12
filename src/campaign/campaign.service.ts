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

  const pinataKey = await Pinata.store(metadata);

  return { pinataKey };
};

export const review = async (name: string, dto: AddReviewReqDto, files: Record<string, Express.MulterS3.File[]>) => {
  const logger = Logger.getLogger(Object.assign(Logger, { functionName: 'review' }));

  const metadata: Record<string, string> = {
    contents: dto.contents,
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

  const cid = await Pinata.getCidByMetadataName(name).catch((err) => {
    logger.error(`failed to getCidByMetadataName, error=${JSON.stringify(err)}`);
    throw ResultCode.PINATA_ERROR;
  });

  const metadataAll = {
    reviewContents: metadata.contents,
    reviewImg1: metadata.img1,
    reviewImg1Key: metadata.img1Key,
  };

  await Pinata.update(cid, name, metadataAll).catch((err) => {
    logger.error(`failed to update Pinata, cid=${cid} name=${name} error=${JSON.stringify(err)}`);
    throw ResultCode.PINATA_ERROR;
  });

  // metadata.name = name
  // await Pinata.store(metadata);

  return null;
};

export const getMetadata = async (name: string) => {
  const logger = Logger.getLogger(Object.assign(Logger, { functionName: 'getMetadata' }));

  const data = await Pinata.getMetadataByName(name);

  return data;
};

export const getAllMetadata = async () => {
  const logger = Logger.getLogger(Object.assign(Logger, { functionName: 'getMetadata' }));

  const data = await Pinata.getAllMetadata();

  return data;
};
