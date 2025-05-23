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
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadStoryDto } from './dtos/upload-story.dto';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStory(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadStoryDto,
  ) {
    return this.storiesService.uploadStory(req.user.id, file, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getStories(@Request() req) {
    return this.storiesService.getStories(req.user.id);
  }
}
