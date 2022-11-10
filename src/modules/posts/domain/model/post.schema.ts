import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IPost } from '../interfaces/post.interface';

@Schema({ collection: 'posts' })
export class Post extends Document implements IPost {
  @Prop({ required: true, type: String })
  title: string;
  @Prop({ required: true, type: String })
  shortDescription: string;
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ required: true, type: String })
  blogId: string;
  @Prop({ required: true, type: String })
  blogName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
