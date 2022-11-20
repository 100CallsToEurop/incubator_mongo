import { IComment } from '../../domain/interfaces/comment.interface';
import { CommentViewModel } from './comment-view-model.dto';
export class CommentPaginatorRepository {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IComment[];
}
export class CommentPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
}
