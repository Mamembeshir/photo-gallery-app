import { IsString } from 'class-validator';

export class InitDataDto {
  @IsString()
  initData: string;
}
