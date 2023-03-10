export interface IMetadata {
  name: string;
  keyvalues: IKeyvalues;
}

export interface IKeyvalues {
  title: string;
  description?: string;
  writerAddress?: string;
  imgs?: string[];
  reviewContents?: string;
  reviewImgs?: string[];
  mainImg?: string;
}
