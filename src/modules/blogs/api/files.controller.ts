import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MinioClientService } from '../../../modules/minio-client/minio-client.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../../common/decorators/public.decorator';

@Public()
@Controller('blogs/files')
export class FilesController {
  constructor(private readonly minioClientService: MinioClientService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = await this.minioClientService.uploadFile(file);
    const fileUrl = await this.minioClientService.getFileUrl(fileName);
    return {
      fileName,
      fileUrl,
    };
  }

  @Get(':fileName/download')
  async getFile(@Param('fileName') fileName: string) {
    const fileUrl = await this.minioClientService.getFileUrl(fileName);
    return {
      fileName,
      fileUrl,
    };
  }

  @Get(':fileName')
  async getFileStativ(@Param('fileName') fileName: string) {
    const file = await this.minioClientService.getStatic(fileName);
    return file
  }
}
