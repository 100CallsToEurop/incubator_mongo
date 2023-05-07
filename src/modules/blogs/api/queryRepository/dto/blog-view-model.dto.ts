

export class PhotoSizeViewModel{
   url: string
   width: number
   height: number
   fileSize: number
}

export class BlogImagesViewModel {
  wallpaper: PhotoSizeViewModel;
  main: PhotoSizeViewModel[];
}

export class BlogOwnerInfoModel {
  userId: string;
  userLogin: string
}

export class BanBlogModel {
  isBanned: boolean;
  banDate: string;
}

export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  images: BlogImagesViewModel;
};

export class BlogViewModelForSA extends BlogViewModel {
  blogOwnerInfo: BlogOwnerInfoModel;
  banInfo: BanBlogModel;
}



