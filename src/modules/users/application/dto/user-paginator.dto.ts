import { IUser } from '../../domain/interfaces/user.interface';
import { UserViewModel } from './user-view.model';

export class UserPaginatorRepository {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IUser[];
}

export class UserPaginator {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewModel[];
}
