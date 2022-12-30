
export class BanInfo{
  isBanned: boolean
  banDate: string
  banReason: string
}
export class UserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: BanInfo;
}
