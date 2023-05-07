import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogImagesViewModel } from '../../api/queryRepository/dto';
import { MinioClientService } from '../../../../modules/minio-client/minio-client.service';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { validateImage } from '../../utils/validate-image';
import { ConfigService } from '@nestjs/config';

export class UploadBlogWallpaperImagesCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public file: Express.Multer.File,
  ) {}
}

@CommandHandler(UploadBlogWallpaperImagesCommand)
export class UploadBlogWallpaperImagesUseCase
  implements ICommandHandler<UploadBlogWallpaperImagesCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly minioClientService: MinioClientService,
    private readonly configService: ConfigService,
  ) {}
  async execute({
    blogId,
    userId,
    file,
  }: UploadBlogWallpaperImagesCommand): Promise<BlogImagesViewModel> {

    const hostName = this.configService.get('MINIO_ENDPOINT');
    const port = this.configService.get('MINIO_PORT');
    const bucketName = this.configService.get('MINIO_BUCKET_NAME');

    const blog = await this.blogsRepository.getBlogById(blogId);

    const { validatedImage, imageExtension, imageMetaData } =
      await validateImage(file, {
        maxFileSizeKB: 100,
        width: 1028,
        height: 312,
      });

      const url = await this.minioClientService.uploadBlogWallpaperImage(
        blogId,
        validatedImage,
        imageExtension,
      );

    const fileData = {
      url: `http://${hostName}:${port}/${bucketName}/${url}`,
      width: imageMetaData.width,
      height: imageMetaData.height,
      fileSize: imageMetaData.size,
    };
    blog.images.wallpaper = fileData;
    await this.blogsRepository.save(blog);

    return { main: [], wallpaper: fileData };
  }
}
