export abstract class Paginated<T> {
  abstract items: T;

  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;

  public static getPaginated<T>(data: {
    items: T;
    count: number;
    page: number;
    size: number;
  }): Paginated<T> {
    return {
      items: data.items,
      totalCount: data.count,
      pagesCount: Math.ceil(data.count / data.size),
      page: data.page,
      pageSize: data.size,
    };
  }
}
