import { LikesInfoViewModel } from './comment-likes-info.dto';

export class CommentatorViewModel {
  userId: string;
  userLogin: string;
}

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: CommentatorViewModel;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
}
