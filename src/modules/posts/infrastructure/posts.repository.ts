import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Scheme
import { Post } from '../domain/model/post.schema';

//Interfaces
import { PostDocument } from '../domain/interfaces/post.interface';

//DTO
import { Blog } from '../../../modules/blogs/domain/model/blog.schema';
import { BlogDocument } from '../../../modules/blogs/domain/interfaces/blog.interface';
import { User } from '../../../modules/users/domain/model/user.schema';
import { UserDocument } from '../../../modules/users/domain/interfaces/user.interface';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async save(model: PostDocument) {
    return await model.save();
  }

  async getUserById(userId: string) {
    return await this.userModel
      .findOne({ _id: new Types.ObjectId(userId) })
      .exec();
  }

  async getGetBlog(blogId: string) {
    return await this.blogModel
      .findOne({ _id: new Types.ObjectId(blogId) })
      .exec();
  }

  async deletePostById(postId: string): Promise<boolean> {
    const deletePost = await this.postModel
      .deleteOne({ _id: new Types.ObjectId(postId) })
      .exec();
    return deletePost ? true : false;
  }

  async getPostById(postId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ _id: new Types.ObjectId(postId) })
      .exec();
    return post;
  }

  async getPostsIdsByBlogId(blogId: string): Promise<string[]> {
    const posts = await this.postModel.find({ blogId }).exec();
    return posts.map((post) => post.blogId);
  }

  async findLikesPostsByUserIdAndHide(
    userId: string,
    isBanned: boolean,
  ): Promise<void> {
    await this.postModel
      .updateMany(
        { 'extendedLikesInfo.newestLikes.userId': userId },
        { $set: { 'extendedLikesInfo.newestLikes.$.isBanned': isBanned } },
      )
      .exec();
  }

  async hidePostByUserId(userId: string, isBanned: boolean): Promise<void> {
    await this.postModel
      .updateMany({ userId }, { isVisible: !isBanned })
      .exec();
  }

  async hidePostByBlogId(blogId: string, isBanned: boolean): Promise<void> {
    await this.postModel
      .updateMany({ blogId }, { isVisible: !isBanned })
      .exec();
  }
}
