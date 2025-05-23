import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Story } from './entities/story.entity';
import { UploadStoryDto } from './dtos/upload-story.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadStory(
    userId: number,
    file: Express.Multer.File,
    dto: UploadStoryDto,
  ): Promise<Story> {
    const uploadResult = await new Promise<Story>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(new Error('Cloudinary upload failed'));
          }
          const createdAt = new Date();
          const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours
          const story = this.storyRepository.create({
            userId,
            url: result.secure_url,
            caption: dto.caption,
            createdAt,
            expiresAt,
          });
          this.storyRepository
            .save(story)
            .then((savedStory) => resolve(savedStory))
            .catch((err) => reject(new Error(err)));
        },
      );

      uploadStream.end(file.buffer);
    });
    return uploadResult;
  }

  async getStories(userId: number): Promise<Story[]> {
    return this.storyRepository.find({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredStories() {
    await this.storyRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
