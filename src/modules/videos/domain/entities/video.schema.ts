import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Resolutions } from '../interfaces/enums';
import { IVideo } from '../interfaces/video.interface';

@Schema({ collection: 'videos' })
export class Video extends Document implements IVideo {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ required: true, type: Boolean })
  canBeDownloaded: boolean;

  @Prop({ required: true, type: Number, default: null })
  minAgeRestriction: number;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  publicationDate: Date;

  @Prop({ required: true, enum: Resolutions, type: String })
  availableResolutions: Resolutions;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
