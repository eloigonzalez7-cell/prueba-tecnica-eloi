import { PaginatePodcasts } from "@/features/podcasts/application/PaginatePodcasts";

describe("PaginatePodcasts", () => {
  const useCase = new PaginatePodcasts();
  const items = Array.from({ length: 25 }, (_, index) => index + 1);

  it("returns the requested page and metadata", () => {
    expect(useCase.execute(items, 2, 10)).toEqual({
      items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      total: 25,
      page: 2,
      pageSize: 10,
      pageCount: 3,
    });
  });

  it("clamps page to the last page", () => {
    const result = useCase.execute(items, 99, 10);
    expect(result.page).toBe(3);
    expect(result.items).toEqual([21, 22, 23, 24, 25]);
  });

  it("clamps invalid page size and page to 1", () => {
    const result = useCase.execute(items, 0, 0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(1);
    expect(result.items).toEqual([1]);
  });

  it("returns an empty page when the list is empty", () => {
    expect(useCase.execute([], 1, 10)).toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      pageCount: 1,
    });
  });
});
