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

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async save(model: PostDocument) {
    return await model.save();
  }

  async getGetBlog(blogId: string) {
    return await this.blogModel
      .findOne({ _id: new Types.ObjectId(blogId) })
      .exec();
  }

  async deletePostById(postId: string): Promise<boolean> {
    const deletePost = await this.postModel
      .findByIdAndDelete({ _id: new Types.ObjectId(postId) })
      .exec();
    return deletePost ? true : false;
  }

  async getPostById(postId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findById({ _id: new Types.ObjectId(postId) })
      .exec();
    return post;
  }

  async findLikesPostsByUserIdAndHide(userId: string, isBanned: boolean): Promise<void>{
      await this.postModel.updateMany(
        { 'extendedLikesInfo.newestLikes.userId': userId },
        { 'extendedLikesInfo.newestLikes.isBanned': isBanned },
      );
  }

  async hidePostByUserId(userId: string, isBanned: boolean): Promise<void> {
    await this.postModel.updateMany({ userId }, { isVisible: !isBanned });
  }
}
