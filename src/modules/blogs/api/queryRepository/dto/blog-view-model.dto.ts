
export class BlogOwnerInfoViewModel {
  readonly userId: string;
  readonly userLogin: string;
}
export class BlogViewModel {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
  blogOwnerInfo: BlogOwnerInfoViewModel;
};


