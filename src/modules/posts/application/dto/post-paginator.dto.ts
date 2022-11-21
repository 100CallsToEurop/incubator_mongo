import { IPost } from '../../domain/interfaces/post.interface';
import { PostViewModel } from './post-view-model';

export class PostPaginatorRepository {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IPost[];
}

export class PostPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
}
