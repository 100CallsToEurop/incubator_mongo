import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Blog } from '../../../modules/blogs/domain/model/blog.schema';

@Injectable()
export class CheckBlogId implements CanActivate {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const blogId = new ObjectId(request.body.blogId);
    const shortDescription = request.body.shortDescription;
    const title = request.body.title;
    const content = request.body.content;

    const blog = await this.blogModel.findById({ _id: blogId });
    const message = [];
    if (!blog) message.push('blogId not found');

    if (
      shortDescription === undefined ||
      (shortDescription && shortDescription.length > 100) ||
      shortDescription.trim().length() === 0
    )
      message.push(
        'shortDescription must be shorter than or equal to 100 characters',
      );
    if (title === undefined || (title !== undefined && title.length > 30) || title.trim().length() === 0)
      message.push('title must be shorter than or equal to 30 characters');

    if (
      content === undefined ||
      (content !== undefined && content.length > 1000) ||
      content.trim().length() === 0
    )
      message.push('content must be shorter than or equal to 1000 characters');

    if (message.length > 0) {
      throw new BadRequestException({ message });
    }
    return true;
  }
}
