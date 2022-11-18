import { IBlog } from '../../domain/interfaces/blog.interface';
import { BlogViewModel } from './blog-view-model.dto';

export class BlogPaginatorRepository {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IBlog[];
}
export class BlogPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
}
