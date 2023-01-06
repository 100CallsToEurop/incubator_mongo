import { LikesInfoViewModel } from '../../../../../modules/comments/api/queryRepository/dto';

export class PostInfo {
  id: string;
  title: string;
  blogId: string;
  blogName: string;
}

export class CommentatorInfo {
  userId: string;
  userLogin: string;
}

export class BloggerCommentViewModel {
  id: string;
  content: string;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
  commentatorInfo: CommentatorInfo;
  postInfo: PostInfo;
}
