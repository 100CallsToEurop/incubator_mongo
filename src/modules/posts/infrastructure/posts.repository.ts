import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from '../../../modules/blogs/domain/model/blog.schema';
import { PostDto } from '../application/dto/post.dto';
import { PostEntity } from '../domain/entity/post.entity';
import { IPost } from '../domain/interfaces/post.interface';
import { Post } from '../domain/model/post.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getPosts(): Promise<IPost[]> {
    return await this.postModel.find().exec();
  }

  async getPostById(_id: Types.ObjectId): Promise<IPost | null> {
    return await this.postModel.findById({ _id }).exec();
  }

  async deletePostById(_id: Types.ObjectId): Promise<boolean> {
    const deletePost = await this.postModel.findByIdAndDelete({ _id }).exec();
    return deletePost ? true : false;
  }

  async createPost(post: PostEntity): Promise<IPost> {
    const blog = await this.getGetBlog(new Types.ObjectId(post.blogId));
    const newPost = new this.postModel({ ...post, blogName: blog.name });
    console.log()
    return await newPost.save();
  }

  async updatePost(_id: Types.ObjectId, update: PostDto): Promise<boolean> {
    const updatePost = await this.postModel
      .findByIdAndUpdate({ _id }, update)
      .exec();
    return updatePost ? true : false;
  }

  async getGetBlog(_id: Types.ObjectId){
     return await this.blogModel.findOne({ _id }).exec();
  }
}
