import { Resolutions } from './enums';
import { Types } from 'mongoose';

export interface IVideo {
  _id?: Types.ObjectId;
  id: number
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  createdAt: Date;
  publicationDate: Date;
  availableResolutions: Array<Resolutions>;
}
