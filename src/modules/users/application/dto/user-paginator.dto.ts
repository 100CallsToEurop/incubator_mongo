import { UserViewModel } from './user-view.model';

export class UserPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewModel[];
}
