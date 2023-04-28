import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../../modules/users/domain/model/user.schema';
import { Blog } from '../../../../modules/blogs/domain/model/blog.schema';
import { Post } from '../../../../modules/posts/domain/model/post.schema';
import { Comments } from '../../../../modules/comments/domain/model/comment.schema';
import { SecurityDevice } from '../../../../modules/security-devices/domain/model/security-devices.schema';
import { Questions } from '../../../../modules/quiz/domain/model/question.schema';
import { GamePair } from '../../../../modules/pair-quiz-game/domain/model/quiz.game.schema';

@Injectable()
export class TestingQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Questions.name)
    private readonly questionModel: Model<Questions>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
    @InjectModel(SecurityDevice.name)
    private readonly securityDeviceModel: Model<SecurityDevice>,
    @InjectModel(GamePair.name) private readonly gamePairModel: Model<GamePair>,
  ) {}

  async deleteAll() {
    await this.blogModel.deleteMany({});
    await this.questionModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.securityDeviceModel.deleteMany({});
    await this.gamePairModel.deleteMany({});
  }
}
