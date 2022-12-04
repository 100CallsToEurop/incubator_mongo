import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { BlogsService } from '../../modules/blogs/application/blogs.service';

@Injectable()
export class СheckBlogMiddleware implements NestMiddleware {
  constructor(private readonly blogsService: BlogsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const blogId = req.params['blogId'];
    const blog = await this.blogsService.getBlogById(new Types.ObjectId(blogId));

    if (!blog) {
      throw new NotFoundException();
    }
    next();
  }
}
