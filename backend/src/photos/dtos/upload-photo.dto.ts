import { IsString } from 'class-validator';

export class UploadPhotoDto {
  @IsString()
  caption: string;
}
