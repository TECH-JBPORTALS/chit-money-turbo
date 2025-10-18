import { PgSelect } from "@cmt/db";
import { getPagination } from "./paginate";

export async function withPagination<T extends PgSelect>(
  baseQuery: T,
  pageIndex: number,
  pageSize: number
) {
  const { offset } = getPagination(pageIndex, pageSize);

  const paginatedQuery = baseQuery.limit(pageSize).offset(offset);

  return paginatedQuery;
}
