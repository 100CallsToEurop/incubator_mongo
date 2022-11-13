import { CommentViewModel } from './comment-view-model.dto';

export class CommentPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
}
