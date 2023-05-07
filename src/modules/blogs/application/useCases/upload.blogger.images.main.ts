import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogImagesViewModel } from '../../api/queryRepository/dto';
import { MinioClientService } from '../../../../modules/minio-client/minio-client.service';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { ConfigService } from '@nestjs/config';
import { validateImage } from '../../utils/validate-image';

export class UploadBlogImagesCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public file: Express.Multer.File,
  ) {}
}

@CommandHandler(UploadBlogImagesCommand)
export class UploadBlogImagesUseCase
  implements ICommandHandler<UploadBlogImagesCommand>
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
  }: UploadBlogImagesCommand): Promise<BlogImagesViewModel> {
    const hostName = this.configService.get('MINIO_ENDPOINT');
    const port = this.configService.get('MINIO_PORT');
    const bucketName = this.configService.get('MINIO_BUCKET_NAME');

    const blog = await this.blogsRepository.getBlogById(blogId);

    const { validatedImage, imageExtension, imageMetaData } =
      await validateImage(file, {
        maxFileSizeKB: 100,
        height: 156,
        width: 156,
      });
    const url = await this.minioClientService.uploadBlogMainImage(
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

    blog.images.main.push(fileData);

    await this.blogsRepository.save(blog);

    return { main: [fileData], wallpaper: null };
  }
}
