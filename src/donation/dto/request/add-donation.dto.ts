import { IsEthereumAddress, IsString } from 'class-validator';

export class AddDonationReqDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEthereumAddress()
  writerAddress: string;
}
