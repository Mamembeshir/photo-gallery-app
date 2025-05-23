import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadPhotoDto } from './dtos/upload-photo.dto';

@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadPhotoDto,
  ) {
    return this.photosService.uploadPhoto(req.user.id, file, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPhotos(@Request() req) {
    return this.photosService.getPhotos(req.user.id);
  }
}
