function pagination(docCount: number, items: any, page: number, limit: number) {
  return { count: docCount, items, page, limit };
}

export default pagination;
