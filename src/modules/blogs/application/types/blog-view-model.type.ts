import { Paginator } from '../../../../modules/paginator/types/paginator.type';

export type BlogViewModel = {
  id: string;
  name: string;
  youtubeUrl: string;
  createdAt: string;
};

export class BlogPaginator implements Paginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
}
