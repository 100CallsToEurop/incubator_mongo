import { BlogViewModel } from './blog-view-model.dto';

export class BlogPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
}
