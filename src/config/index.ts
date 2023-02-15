import dotenv from 'dotenv';

import { IConfig } from './interface';

let config: IConfig;

/**
 * get configuration
 * @returns {IConfig} configuration
 */
const getConfig = (): IConfig => {
  if (config) {
    return config;
  }

  dotenv.config();

  return loadConfig();
};

/**
 * load configuration
 * @returns {IConfig} configuration
 */
const loadConfig = (): IConfig => {
  return {
    app: {
      port: process.env.PORT,
      logLevel: process.env.LOG_LEVEL,
    },
    s3: {
      accessKey: process.env.AWS_S3_ACCESS_KEY,
      secretKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
      bucketName: process.env.AWS_S3_BUCKET,
    },
    pinata: {
      accessKey: process.env.PINATA_ACCESS_KEY,
      secretKey: process.env.PINATA_SECRET_KEY,
    },
  } as IConfig;
};

export { config, getConfig };
