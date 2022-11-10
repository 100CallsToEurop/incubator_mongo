import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IBlog } from '../intefaces/blog.interface';

@Schema({ collection: 'bloggers' })
export class Blog extends Document implements IBlog {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  youtubeUrl: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
