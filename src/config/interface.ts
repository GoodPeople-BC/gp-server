export interface IConfig {
  app: IApp;
  s3: IS3;
  pinata: IAccount;
}

export interface IApp {
  port: string;
  logLevel: string;
}

export interface IS3 extends IAccount {
  region: string;
}

export interface IAccount {
  accessKey: string
  secretKey: string;
}
