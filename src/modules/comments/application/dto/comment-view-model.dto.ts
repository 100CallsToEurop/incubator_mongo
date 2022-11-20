import { LikesInfoViewModel } from "./comment-likes-info.dto";

export class CommentViewModel {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
}
