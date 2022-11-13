import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IComment } from '../interfaces/comment.interface';

@Schema({ collection: 'comments' })
export class Comments extends Document implements IComment {
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  userLogin: string;
  @Prop({ required: true, type: Date })
  createdAt: Date;
}
export const CommentsSchema = SchemaFactory.createForClass(Comments);
