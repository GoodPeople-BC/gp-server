import { IsEthereumAddress, IsString } from 'class-validator';

export class AddCampaignReqDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEthereumAddress()
  writerAddress: string;
}
