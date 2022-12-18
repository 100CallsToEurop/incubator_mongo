import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Scheme
import { Post } from '../domain/model/post.schema';

//Models
import { PostInputModel } from '../api/models/post.model';

//Entity
import { PostEntity } from '../domain/entity/post.entity';

//Interfaces
import { IPost, LikeStatus } from '../domain/interfaces/post.interface';

//DTO
import { LikeInputModel } from '../api/models';
import { MeViewModel } from 'src/modules/auth/application/dto';
import { Blog } from 'src/modules/blogs/domain/model/blog.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

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

  async createPost(post: PostEntity): Promise<string> {
    const blog = await this.blogModel
      .findOne({ _id: new Types.ObjectId(post.blogId) })
      .exec();
    const blogName = blog.name;
    const newPost = new this.postModel({ ...post, blogName });
     newPost.save();
     return newPost._id.toString()
  }

  async updatePost(postId: string, update: PostInputModel): Promise<boolean> {
    const updatePost = await this.postModel
      .findByIdAndUpdate({ _id: new Types.ObjectId(postId) }, update)
      .exec();
    return updatePost ? true : false;
  }

  async updateExtendedLikeStatus(
    postId: string,
    { likeStatus }: LikeInputModel,
    user: MeViewModel,
  ): Promise<void> {
    const currentPost = await this.postModel.findOne({ _id: postId }).exec();
    const index = currentPost.extendedLikesInfo.newestLikes.findIndex(
      (c) => c.userId === user.userId,
    );

    if (index === -1) {
      currentPost.extendedLikesInfo.newestLikes.push({
        userId: user.userId,
        login: user.login,
        status: likeStatus,
        addedAt: new Date(),
      });

      likeStatus === LikeStatus.LIKE
        ? (currentPost.extendedLikesInfo.likesCount += 1)
        : (currentPost.extendedLikesInfo.dislikesCount += 1);
    } else {
      const oldStatus = currentPost.extendedLikesInfo.newestLikes[index].status;

      if (oldStatus === LikeStatus.LIKE && likeStatus === LikeStatus.DISLIKE) {
        currentPost.extendedLikesInfo.likesCount -= 1;
        currentPost.extendedLikesInfo.dislikesCount += 1;
      }

      if (oldStatus === LikeStatus.DISLIKE && likeStatus === LikeStatus.LIKE) {
        currentPost.extendedLikesInfo.likesCount += 1;
        currentPost.extendedLikesInfo.dislikesCount -= 1;
      }

      if (oldStatus === LikeStatus.LIKE && likeStatus === LikeStatus.NONE) {
        currentPost.extendedLikesInfo.likesCount -= 1;
      }

      if (oldStatus === LikeStatus.DISLIKE && likeStatus === LikeStatus.NONE) {
        currentPost.extendedLikesInfo.dislikesCount -= 1;
      }

      if (oldStatus === LikeStatus.NONE && likeStatus === LikeStatus.LIKE) {
        currentPost.extendedLikesInfo.likesCount += 1;
      }

      if (oldStatus === LikeStatus.NONE && likeStatus === LikeStatus.DISLIKE) {
        currentPost.extendedLikesInfo.dislikesCount += 1;
      }

      currentPost.extendedLikesInfo.newestLikes[index].status = likeStatus;
    }
    await currentPost.save();
  }
}
