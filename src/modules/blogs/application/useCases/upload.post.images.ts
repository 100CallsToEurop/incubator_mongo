import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostImagesViewModel } from '../../../../modules/posts/api/queryRepository/dto';
import { MinioClientService } from '../../../../modules/minio-client/minio-client.service';
import { PostsRepository } from '../../../../modules/posts/infrastructure/posts.repository';
import { validateImage } from '../../utils/validate-image';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';

export class UploadPostImagesCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
    public file: Express.Multer.File,
  ) {}
}

@CommandHandler(UploadPostImagesCommand)
export class UploadPostImagesUseCase
  implements ICommandHandler<UploadPostImagesCommand>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly minioClientService: MinioClientService,
    private readonly configService: ConfigService,
  ) {}
  async execute({
    blogId,
    postId,
    userId,
    file,
  }: UploadPostImagesCommand): Promise<PostImagesViewModel> {
    
    const hostName = this.configService.get('MINIO_ENDPOINT');
    const port = this.configService.get('MINIO_PORT');
    const bucketName = this.configService.get('MINIO_BUCKET_NAME');
    
    
    const post = await this.postsRepository.getPostById(postId);
    if (post.userId !== userId) {
      throw new ForbiddenException();
    }


    const { validatedImage, imageExtension } = await validateImage(file, {
      maxFileSizeKB: 100,
      width: 940,
      height: 432,
    });
    const imagesBuffersToUpload: {
      size: 'SMALL' | 'MEDIUM' | 'LARGE';
      buffer: Buffer;
    }[] = [];

    imagesBuffersToUpload.push({
      size: 'LARGE',
      buffer: validatedImage.buffer,
    });
    const middleBuffer = await sharp(validatedImage.buffer)
      .resize({ width: 300, height: 180 })
      .toBuffer();
    imagesBuffersToUpload.push({ size: 'MEDIUM', buffer: middleBuffer });
    const smallBuffer = await sharp(validatedImage.buffer)
      .resize({ width: 149, height: 96 })
      .toBuffer();
    imagesBuffersToUpload.push({ size: 'SMALL', buffer: smallBuffer });

    for (const image of imagesBuffersToUpload) {
      const url = await this.minioClientService.uploadPostMainImage(
        postId,
        image.buffer,
        imageExtension,
        image.size,
      );
      const metadata = await sharp(image.buffer).metadata();
      const fileData = {
        url: `http://${hostName}:${port}/${bucketName}/${url}`,
        width: metadata.width,
        height: metadata.height,
        fileSize: metadata.size,
      };
      post.images.main.push(fileData);
    }

    await this.postsRepository.save(post);
    return {
      main: post.images.main.map((image) => {
        return {
          url: image.url,
          width: image.width,
          height: image.height,
          fileSize: image.fileSize,
        };
      }),
    };
  }
}
