import { PostViewModel } from './post-view-model';

export class PostPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
}
