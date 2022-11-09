import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { VideosService } from '../application/videos.service';
import { CreateVideoInputModel } from '../application/dto/videos.create.model';
import { UpdateVideoInputModel } from '../application/dto/videos.update.model';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoInputModel) {
    return this.videosService.createVideo(createVideoDto);
  }

  @Get('test')
  test() {
    return 'test';
  }

  @Get()
  findAll() {
    return this.videosService.findAllVideos();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findVideo(id);
  }

  @HttpCode(204)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoInputModel,
  ) {
    return this.videosService.updateVideo(id, updateVideoDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.removeVideo(id);
  }
}
