import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Resolutions } from '../interfaces/enums';
import { IVideo } from '../interfaces/video.interface';

@Schema({ collection: 'videos' })
export class Video extends Document implements IVideo {
  @Prop({ type: Number })
  id: number;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ type: Boolean, default: false })
  canBeDownloaded: boolean;

  @Prop({ type: Number, default: null })
  minAgeRestriction: number;

  @Prop({ type: Date, timestamps: true })
  createdAt: Date;

  @Prop({ type: Date, timestamps: true })
  publicationDate: Date;

  @Prop({ type: [String] })
  availableResolutions: Types.Array<Resolutions>;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
