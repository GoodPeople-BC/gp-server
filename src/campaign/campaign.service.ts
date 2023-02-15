import { IKeyvalues, IMetadata } from './ interface';
import { AddCampaignReqDto } from './dto/request/add-campaign.dto';
import { AddReviewReqDto } from './dto/request/add-review.dto';
import { AddCampaignResDto } from './dto/response/add-campaign.dto';

import { Logger, ResultCode } from '@common/index';
import { ILogger } from '@src/common/logger';
import { Pinata } from '@utils/index';

const CommonLogger: ILogger = {
  moduleName: 'campaign.service',
};

/**
 * add campaign service
 * @param   {AddCampaignReqDto}                      dto   add campaign request dto
 * @param   {Record<string, Express.MulterS3.File[]} files image files
 * @returns {string}                                       pinata name
 */
export const addCampaign = async (
  dto: AddCampaignReqDto,
  files: Record<string, Express.MulterS3.File[]>,
): Promise<AddCampaignResDto> => {
  const logger = Logger.getLogger(Object.assign(CommonLogger, { functionName: 'addCampaign' }));

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

  // pinata status: 1: Ok, 2: cancel
  metadata.status = '1';

  const pinataKey = await Pinata.store(metadata).catch((err) => {
    logger.error(`failed to store metadata, error=${err}`);
    throw ResultCode.PINATA_ERROR;
  });

  return { pinataKey };
};

/**
 * add review service
 * @param   {string}                  name  pinata name
 * @param   {AddReviewReqDto}         dto   add review request dto
 * @param   {Express.MulterS3.File[]} files review image files
 */
export const review = async (name: string, dto: AddReviewReqDto, files: Record<string, Express.MulterS3.File[]>) => {
  const logger = Logger.getLogger(Object.assign(CommonLogger, { functionName: 'review' }));

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

/**
 * get metadata by name service
 * @param   {string} name         pinata name
 * @returns {Promise<IKeyvalues>} pinata metadata keyvalues
 */
export const getMetadata = async (name: string) => {
  const logger = Logger.getLogger(Object.assign(CommonLogger, { functionName: 'getMetadata' }));

  const metadata: IKeyvalues = {} as IKeyvalues;

  // get metadata by
  const data = await Pinata.getMetadataByName(name).catch((err) => {
    logger.error(`failed to getMetadataByNamel, error=${err}`);
    throw ResultCode.PINATA_ERROR;
  });

  metadata.title = data.title;
  metadata.description = data.description;
  metadata.writerAddress = data.writerAddress;

  const imgs = [data.img1, data.img2 && data.img2, data.img3 && data.img3];
  const reviewImgs = [data.reviewImg1, data.reviewImg2 && data.reviewImg2, data.reviewImg3 && data.reviewImg3];

  metadata.imgs = imgs.filter(Boolean);
  metadata.reviewImgs = reviewImgs.filter(Boolean);

  return metadata;
};

/**
 * get all metatadata service
 * @returns
 */
export const getAllMetadata = async () => {
  const logger = Logger.getLogger(Object.assign(CommonLogger, { functionName: 'getAllMetadata' }));

  const metadataArr: IMetadata[] = [];
  const rows = await Pinata.getAllMetadata().catch((err) => {
    logger.error(`failed to getMetadataByNamel, error=${err}`);
    throw ResultCode.PINATA_ERROR;
  });

  // make response data
  rows.map((row: any) => {
    const metadata: IMetadata = {} as IMetadata;
    const keyvalues = row.metadata.keyvalues;

    if (!keyvalues) return;

    metadata.name = row.metadata.name;

    // make imgs field
    const mainImg = keyvalues.img1;

    metadata.keyvalues = {
      title: keyvalues.title,
      mainImg,
    };

    console.log(metadata);
    metadataArr.push(metadata);
  });

  return metadataArr;
};

/**
 * canel campaign service
 * @param   {string} name pinata name
 */
export const cancel = async (name: string) => {
  const logger = Logger.getLogger(Object.assign(CommonLogger, { functionName: 'cancel' }));

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
};
