import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../../../../modules/blogs/domain/model/blog.schema';
import { Post } from '../../../../modules/posts/domain/model/post.schema';
import { Video } from '../../../../modules/videos/domain/entities/video.schema';

@Injectable()
export class TestingQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
  ) {}

  async deleteAll() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.videoModel.deleteMany({});
  }
}
