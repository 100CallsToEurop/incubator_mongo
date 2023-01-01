export class BlogOwnerInfoModel {
  userId: string;
  userLogin: string
}
export class BlogViewModel {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
  blogOwnerInfo: BlogOwnerInfoModel;
};




