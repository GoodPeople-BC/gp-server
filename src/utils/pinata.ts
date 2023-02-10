import axios from 'axios';

export interface IPinataMetadata {
  name: string;
  keyvalues: Record<string, string>;
}
export default class Pinata {
  static #apiKey: string;
  static #apiSecrets: string;

  static {
    this.#apiKey = process.env.REACT_APP_IPFS_API_KEY || '';
    this.#apiSecrets = process.env.REACT_APP_IPFS_SECRET || '';
  }

  static async store(metadata: IPinataMetadata) {
    // console.log(metadata)
    // const pinataData = JSON.stringify({
    //   pinataOptions: {
    //     cidVersion: 1,
    //   },
    //   pinataMetadata: metadata,
    //   pinataContent: {
    //     somekey: 'testkey',
    //   },
    // })
    // await axios.post(
    //   'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    //   JSON.stringify({
    //     name: 'testing',
    //     keyvalues: {
    //       customKey: 'customValue',
    //       customKey2: 'customValue2',
    //     },
    //   }),
    //   {
    //     headers: {
    //       pinata_api_key: this.#apiKey,
    //       pinata_secret_api_key: this.#apiSecrets,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )

    console.log(metadata);
    const data = JSON.stringify({
      pinataMetadata: metadata,
      pinataContent: {
        somekey: 'testkey',
      },
    });

    // const config = {
    //   method: 'post',
    //   url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     pinata_api_key: this.#apiKey,
    //     pinata_secret_api_key: this.#apiSecrets,
    //   },
    //   data: data,
    // }

    const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
      headers: {
        pinata_api_key: this.#apiKey,
        pinata_secret_api_key: this.#apiSecrets,
        'Content-Type': 'application/json',
      },
    });

    console.log(res.data);
  }

  static async save(img: any, metadata: string) {
    const formData = new FormData();

    formData.append('file', img);
    formData.append('pinataMetadata', metadata);

    const options = {
      pinataOptions: {
        cidVersion: 0,
      },
    };

    formData.append('pinataOptions', JSON.stringify(options));

    const resFile = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        pinata_api_key: this.#apiKey,
        pinata_secret_api_key: this.#apiSecrets,
        'Content-Type': 'multipart/form-data',
      },
    });

    return resFile.data.IpfsHash;
  }

  static async getMetaDataByName(name: string) {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList?metadata[name]=${name}`, {
        headers: {
          pinata_api_key: this.#apiKey,
          pinata_secret_api_key: this.#apiSecrets,
        },
      })
      .then((data) => data.data);
  }

  static async getAllMetaData() {
    return await axios
      .get(`https://api.pinata.cloud/data/pinList`, {
        headers: {
          pinata_api_key: this.#apiKey,
          pinata_secret_api_key: this.#apiSecrets,
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
        pinata_api_key: this.#apiKey,
        pinata_secret_api_key: this.#apiSecrets,
        'Content-Type': 'application/json',
      },
      data: metadata,
    };

    return await axios(config);
  }
}
