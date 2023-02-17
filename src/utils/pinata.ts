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
  /**
   * store metadata on pinata
   * @param   {Record<string, string>} metadata data to be stored in pinata
   */
  static async store(metadata: Record<string, string>) {
    try {
      // make pinata data format
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: metadata.hash,
          keyvalues: {
            ...metadata,
          },
        },
        pinataContent: {
          ...metadata,
        },
      });

      // make axios request config
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

      // call pinata gateway
      const res = await axios(config);

      // generated ipfs cid
      const ipfsHash = res.data.ipfsPinHash || res.data.IpfsHash;

      logger.info(`succeed to storing data on pinata, pinatakey=${metadata.hash}, pinataHash=${ipfsHash}`);
    } catch (err) {
      logger.error(`failed to store data on pinata, error=${JSON.stringify(err)}`);
      throw ResultCode.PINATA_ERROR;
    }
  }

  /**
   * update metadata
   * @param {string}                 cid      pinata cid
   * @param {string}                 name     pinata name
   * @param {Record<string, string>} metadata date to be updated in pinata
   */
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

  /**
   * get ipfs cid by name
   * @param   {string} name      pinata name
   * @returns {Promise<string>} ipfs(pinata) cid
   */
  static async getCidByMetadataName(name: string): Promise<string> {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList?metadata[name]=${name}`, {
        headers: {
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
      })
      .then((data) => data.data.rows[0].ipfs_pin_hash);
  }

  /**
   * get metadata by name
   * @param   {string} name                     pinata name
   * @returns {Promise<Record<string, string>>} ipfs metadata
   */
  static async getMetadataByName(name: string): Promise<Record<string, string>> {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList?metadata[name]=${name}`, {
        headers: {
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
      })
      .then((data) => {
        return data.data.rows[0].metadata.keyvalues;
      });
  }

  /**
   * get all metadata
   * @returns {Promise<Record<string, string>>} all metadata
   */
  static async getAllMetadata(): Promise<Record<string, string>[]> {
    // get all metadata with status true
    return await axios
      .get(`https://api.pinata.cloud/data/pinList?metadata[keyvalues]={"status":{"value":"1","op":"eq"}}`, {
        headers: {
          pinata_api_key: accessKey,
          pinata_secret_api_key: secretKey,
        },
      })
      .then((data) => data.data.rows);
  }
}
