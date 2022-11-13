export enum SortDirection{
   ASC = "asc",
   DESC = "desc"
}

export type PaginatorInputModel = {
  PageNumber?: number;
  PageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type Paginator = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
};
