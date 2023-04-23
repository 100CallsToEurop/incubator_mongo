import { IsEnum, IsString } from 'class-validator';

export enum PUB_STATUS {
  ALL = 'all',
  PUBLISHED = 'published',
  NOT_PUBLISHED = 'notPublished',
}

export class publishedStatuesViewModel {
  @IsEnum(PUB_STATUS)
  @IsString()
  enum: PUB_STATUS;
}
