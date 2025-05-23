import { IsString } from 'class-validator';

export class UploadStoryDto {
  @IsString()
  caption: string;
}
