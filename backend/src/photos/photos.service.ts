import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { UploadPhotoDto } from './dtos/upload-photo.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadPhoto(
    userId: number,
    file: Express.Multer.File,
    dto: UploadPhotoDto,
  ): Promise<Photo> {
    const uploadResult = await new Promise<Photo>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(new Error('Cloudinary upload failed'));
          }

          const photo = this.photoRepository.create({
            userId,
            url: result.secure_url,
            caption: dto.caption,
            createdAt: new Date(),
          });

          this.photoRepository
            .save(photo)
            .then((savedPhoto) => resolve(savedPhoto))
            .catch((err) => reject(new Error(err)));
        },
      );

      uploadStream.end(file.buffer);
    });

    return uploadResult;
  }

  async getPhotos(userId: number): Promise<Photo[]> {
    return this.photoRepository.find({ where: { userId } });
  }
}
