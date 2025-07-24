interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface StrapiMeta {
  pagination: StrapiPagination;
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}
