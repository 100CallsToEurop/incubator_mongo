import { SortDirection } from "../modules/paginator/models/query-params.model";

export const sortUtils = (sortBy?: string, sortDirection?: SortDirection) => {
  const sortDefault = 'createdAt';
  let sort = `-${sortDefault}`;
  if (sortBy && sortDirection) {
    sortDirection === SortDirection.DESC
      ? (sort = `-${sortBy}`)
      : (sort = `${sortBy}`);
  } else if (sortDirection) {
    sortDirection === SortDirection.DESC
      ? (sort = `-${sortDefault}`)
      : (sort = sortDefault);
  } else if (sortBy) {
    sort = `-${sortBy}`;
  }
  return sort;
};