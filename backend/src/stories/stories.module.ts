import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { Story } from './entities/story.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), ScheduleModule.forRoot()],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
