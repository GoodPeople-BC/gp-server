import { S3Client } from '@aws-sdk/client-s3'

export default class S3 {
  static #client: S3Client
  static #endpoint: string

  static {
    this.#client = new S3Client({
      region: process.env.REACT_APP_AWS_S3_REGION || '',
      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_S3_ACCESS_KEY || '',
        secretAccessKey: process.env.REACT_APP_AWS_S3_ACCESS_SECRET || '',
      },
    })
    this.#endpoint = process.env.REACT_APP_AWS_S3_ENDPOINT || ''
  }

  static async upload(fileBuffer: File, fileName: string, mimeType: string) {
    const uploadParams = {
      Bucket: 'static-dev.genesisnest.net',
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    }

    // const res = await this.#client.send(new PutObjectCommand(uploadParams))
    // return res.$metadata.httpStatusCode
    return `${this.#endpoint}/${fileName}`
  }
}
