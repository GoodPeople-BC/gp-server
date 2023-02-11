import { IsString } from 'class-validator';

export class AddReviewReqDto {
  @IsString()
  contents: string;
}
