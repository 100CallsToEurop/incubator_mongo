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
  websiteUrl: string;
  description: string;
  createdAt: string;
  isMembership: boolean
};

export class BlogViewModelForSA extends BlogViewModel {
  blogOwnerInfo: BlogOwnerInfoModel;
  banInfo: BanBlogModel;
}



