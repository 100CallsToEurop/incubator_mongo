export class BanBlogUserInfo{
    isBanned: boolean
    banDate: string
    banReason: string
}

export class BanBlogUserViewModel {
  id: string;
  login: string;
  banInfo: BanBlogUserInfo;
}