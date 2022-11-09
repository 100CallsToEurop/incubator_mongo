import { Resolutions } from '../../domain/interfaces/enums';

export class VideoView {
  id: string;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Array<Resolutions>;
}
