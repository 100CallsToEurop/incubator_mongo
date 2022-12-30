import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlogInputModel } from '../../api/models';
import { BlogEntity } from '../entity/blog.entity';
import {
  BlogDocument,
  BlogModelType,
  BlogStaticType,
  IBlogBindWith,
  IBlogEntity,
} from '../interfaces/blog.interface';

@Schema({ collection: 'blog-bind-with-user' })
export class BlogBindWithUser extends Document implements IBlogBindWith {
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  userLogin: string;
}

export const BlogBindWithUserSchema = SchemaFactory.createForClass(BlogBindWithUser);

@Schema({ collection: 'blogs' })
export class Blog extends Document implements IBlogEntity {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  websiteUrl: string;
  @Prop({ required: true, type: String })
  description: string;
  @Prop({ required: true, type: Date })
  createdAt: Date;
  @Prop({ required: false, type: BlogBindWithUserSchema })
  blogOwnerInfo: IBlogBindWith;

  public getName(): string {
    return this.name;
  }
  public getWebsiteUrl(): string {
    return this.websiteUrl;
  }
  public getDescription(): string {
    return this.description;
  }
  public getBlogOwnerInfo(): IBlogBindWith {
    return this.blogOwnerInfo;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setBlogOwnerInfo(userId: string, userLogin: string): void {
    this.blogOwnerInfo = {
      userId,
      userLogin
    };
  }

  public setName(name: string): void {
    this.name = name;
  }
  public setWebsiteUrl(websiteUrl: string): void {
    this.websiteUrl = websiteUrl;
  }
  public setDescription(description: string): void {
    this.description = description;
  }

  public updateBlog(updateParams: BlogInputModel): void {
    this.setName(updateParams.name);
    this.setWebsiteUrl(updateParams.websiteUrl);
    this.setDescription(updateParams.description);
  }

  public static createBlog(
    newBlogEntity: BlogEntity,
    BlogModel: BlogModelType,
  ): BlogDocument {
    const newBlog = new BlogModel(newBlogEntity);
    return newBlog;
  }
}
export const BlogSchema = SchemaFactory.createForClass(Blog);

const blogStaticMethod: BlogStaticType = {
  createBlog: Blog.createBlog,
};
BlogSchema.statics = blogStaticMethod;

BlogSchema.methods.getName = Blog.prototype.getName;
BlogSchema.methods.getWebsiteUrl = Blog.prototype.getWebsiteUrl;
BlogSchema.methods.getDescription = Blog.prototype.getDescription;
BlogSchema.methods.getCreatedAt = Blog.prototype.getCreatedAt;
BlogSchema.methods.getBlogOwnerInfo = Blog.prototype.getBlogOwnerInfo;

BlogSchema.methods.setName = Blog.prototype.setName;
BlogSchema.methods.setWebsiteUrl = Blog.prototype.setWebsiteUrl;
BlogSchema.methods.setDescription = Blog.prototype.setDescription;
BlogSchema.methods.setBlogOwnerInfo = Blog.prototype.setBlogOwnerInfo;

BlogSchema.methods.updateBlog = Blog.prototype.updateBlog;