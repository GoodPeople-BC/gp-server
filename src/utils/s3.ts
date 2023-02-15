import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import shortId from 'shortid';

import { getConfig } from '@src/config';
import { IConfig } from '@src/config/interface';

const {
  s3: { accessKey, secretKey, region, bucketName },
}: IConfig = getConfig();

export default class S3 {
  static #client: aws.S3;

  /**
   * Initialize S3 client
   */
  static {
    this.#client = new aws.S3({
      region,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });
  }

  /**
   * upload S3 Image
   */
  static upload = multer({
    storage: multerS3({
      s3: this.#client,
      bucket: bucketName,
      key: function (req, file, cb) {
        const fileId = shortId.generate();
        const type = file.mimetype.split('/')[1];
        const fileName = `${fileId}.${type}`;
        cb(null, fileName);
      },
    }),
  });
}
