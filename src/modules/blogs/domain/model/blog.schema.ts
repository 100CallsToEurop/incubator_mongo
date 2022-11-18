import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBlog } from '../interfaces/blog.interface';

@Schema({ collection: 'blogs' })
export class Blog extends Document implements IBlog {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  websiteUrl: string;
  @Prop({ required: true, type: String })
  description: string;
  @Prop({ required: true, type: Date })
  createdAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
