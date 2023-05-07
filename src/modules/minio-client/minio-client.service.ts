import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
@Injectable()
export class MinioClientService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists(): Promise<void> {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = randomUUID() + '-' + file.originalname;

    const metaData = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );
    return `http://localhost:9000/test/${fileName}`;
  }

  async uploadBlogMainImage(
    blogId: string,
    file: Express.Multer.File,
    imageExtension: string,
  ) {
    const fileName = `content/blogs/${blogId}/images/main/${blogId}blog_main${imageExtension}`;

    const metaData = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );
    return fileName;
  }

  async uploadBlogWallpaperImage(
    blogId: string,
    file: Express.Multer.File,
    imageExtension: string,
  ) {
    const fileName = `content/blogs/${blogId}/images/wallpaper/${blogId}blog_wallpaper${imageExtension}`;

    const metaData = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );
    return fileName;
  }

  async uploadPostMainImage(
    postId: string,
    file: Express.Multer.File,
    imageExtension: string,
    size: 'SMALL' | 'MEDIUM' | 'LARGE',
  ) {
    const fileName = `content/posts/${postId}/images/main/${postId}post${size}_main${imageExtension}`;

    const metaData = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );
    return fileName;
  }

  async getStatic(fileName: string) {
    return this.minioClient.getObject(this.bucketName, fileName);
  }

  async getFileUrl(fileName: string) {
    return this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
      //60*60*24*7 /*7 days*/
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
