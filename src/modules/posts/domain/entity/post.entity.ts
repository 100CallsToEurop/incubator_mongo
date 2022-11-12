import { Types } from 'mongoose';
import { PostDto } from '../../application/dto/post.dto';
import { IPost } from '../interfaces/post.interface';

export class PostEntity implements IPost {
  _id?: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  

  constructor(post: PostDto) {
    this._id = new Types.ObjectId();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId;
  }
}
