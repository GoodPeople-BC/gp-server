import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import shortId from 'shortid';

import { getConfig } from '@src/config';
import { IConfig } from '@src/config/interface';

const {
  s3: { accessKey, secretKey, region },
}: IConfig = getConfig();

export default class S3 {
  static #client: aws.S3;

  static {
    this.#client = new aws.S3({
      region,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });
  }

  static upload = multer({
    storage: multerS3({
      s3: this.#client,
      bucket: 'gp-s3-campaign',
      key: function (req, file, cb) {
        const fileId = shortId.generate();
        const type = file.mimetype.split('/')[1];
        const fileName = `${fileId}.${type}`;
        cb(null, fileName);
      },
    }),
  });
}
