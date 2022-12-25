import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlogInputModel } from '../../api/models';
import { BlogEntity } from '../entity/blog.entity';
import {
  BlogDocument,
  BlogModelType,
  BlogStaticType,
  IBlogEntity,
} from '../interfaces/blog.interface';

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

  public getName(): string {
    return this.name;
  }
  public getWebsiteUrl(): string {
    return this.websiteUrl;
  }
  public getDescription(): string {
    return this.description;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
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

  public updateBlog(updateParams: BlogInputModel): void{
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

BlogSchema.methods.setName = Blog.prototype.setName;
BlogSchema.methods.setWebsiteUrl = Blog.prototype.setWebsiteUrl;
BlogSchema.methods.setDescription = Blog.prototype.setDescription;

BlogSchema.methods.updateBlog = Blog.prototype.updateBlog;