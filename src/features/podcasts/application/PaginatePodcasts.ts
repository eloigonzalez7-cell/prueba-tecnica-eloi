export type PagedResult<T> = {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
};

/**
 * Application use case: slice a list into a page.
 * iTunes top RSS is a single 100-item feed; pagination is applied after cache + filter.
 */
export class PaginatePodcasts {
  execute<T>(
    items: readonly T[],
    page: number,
    pageSize: number,
  ): PagedResult<T> {
    const safePageSize = Math.max(1, Math.floor(pageSize));
    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / safePageSize));
    const safePage = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);
    const start = (safePage - 1) * safePageSize;

    return {
      items: items.slice(start, start + safePageSize),
      total,
      page: safePage,
      pageSize: safePageSize,
      pageCount,
    };
  }
}
