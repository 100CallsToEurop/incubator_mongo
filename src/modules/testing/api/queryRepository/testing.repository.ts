import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../../modules/users/domain/model/user.schema';
import { Blog } from '../../../../modules/blogs/domain/model/blog.schema';
import { Post } from '../../../../modules/posts/domain/model/post.schema';
import { Video } from '../../../../modules/videos/domain/entities/video.schema';
import { Comments } from '../../../../modules/comments/domain/model/comment.schema';
import { SecurityDevice } from 'src/modules/security-devices/domain/model/security-devices.schema';

@Injectable()
export class TestingQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
    @InjectModel(SecurityDevice.name)
    private readonly securityDeviceModel: Model<SecurityDevice>,
  ) {}

  async deleteAll() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.videoModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.securityDeviceModel.deleteMany({});
  }
}
