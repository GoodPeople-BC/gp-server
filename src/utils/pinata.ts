import { createHash } from 'crypto';

import axios from 'axios';

import { Logger, ResultCode } from '@common/index';
import { getConfig } from '@config/index';
import { IConfig } from '@config/interface';

export interface IPinataMetadata {
  name: string;
  keyvalues: Record<string, string>;
}

const {
  pinata: { accessKey, secretKey },
}: IConfig = getConfig();

const logger = Logger.getLogger({ moduleName: 'pinata' });

export default class Pinata {
  static async store(metadata: Record<string, string>) {
    try {
      const pinataKey = createHash('sha3-512')
        .update(
          `${metadata.img1Key}${metadata.img2Key ? metadata.img2Key : ''}${metadata.img3Key ? metadata.img3Key : ''}`,
        )
        .digest('hex')
        .slice(0, 31);

      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: pinataKey,
          keyvalues: {
            ...metadata,
          },
        },
        pinataContent: {
          ...metadata,
        },
      });

      const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
        data: data,
      };

      const res = await axios(config);
      const ipfsHash = res.data.ipfsPinHash || res.data.IpfsHash;

      logger.info(`succeed to storing data on pinata, pinatakey=${pinataKey}, pinataHash=${ipfsHash}`);
      return pinataKey;
    } catch (err) {
      logger.error(`failed to store data on pinata, error=${JSON.stringify(err)}`);
      throw ResultCode.PINATA_ERROR;
    }
  }

  static async update(cid: string, name: string, metadata: Record<string, string>) {
    try {
      await axios.put(
        'https://api.pinata.cloud/pinning/hashMetadata',
        JSON.stringify({
          ipfsPinHash: cid,
          name,
          keyvalues: metadata,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: accessKey,
            pinata_secret_api_key: secretKey,
          },
        },
      );
    } catch (err) {
      logger.error(`failed to store data on pinata, error=${JSON.stringify(err)}`);
      throw ResultCode.PINATA_ERROR;
    }
  }

  static async getCidByMetadataName(name: string) {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList?metadata[name]=${name}`, {
        headers: {
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
      })
      .then((data) => data.data.rows[0].ipfs_pin_hash);
  }

  static async getMetadataByName(name: string) {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList?metadata[name]=${name}`, {
        headers: {
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
      })
      .then((data) => {
        console.log(data.data.rows[0]);
        return data.data.rows[0].metadata.keyvalues;
      });
  }

  static async getAllMetadata() {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList`, {
        headers: {
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
      })
      .then((data) => data.data);
  }

  static async updateMetadata(metadata: string) {
    // const data = JSON.stringify({
    //   ipfsPinHash: cid,
    //   keyvalues: {
    //     title: "title2-1",
    //     description: "description-2-1",
    //   },
    // });

    const config = {
      method: 'put',
      url: 'https://api.pinata.cloud/pinning/hashMetadata',
      headers: {
        pinata_api_key: accessKey,
        pinata_secret_api_key: secretKey,
        'Content-Type': 'application/json',
      },
      data: metadata,
    };

    return await axios(config);
  }
}
