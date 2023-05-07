import { PhotoSizeViewModel } from "../../../../../modules/blogs/api/queryRepository/dto";
import { ExtendedLikesInfoViewModel } from "./post-likes-info.dto";

export class PostImagesViewModel{
   main: PhotoSizeViewModel[]
} 

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoViewModel;
  images: PostImagesViewModel
};


