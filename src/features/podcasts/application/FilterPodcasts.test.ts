import { FilterPodcasts } from "@/features/podcasts/application/FilterPodcasts";
import { Podcast } from "@/features/podcasts/domain/Podcast";

const images = { small: "s", medium: "m", large: "l" };

function podcast(id: string, title: string, author: string) {
  return new Podcast(id, title, author, images);
}

describe("FilterPodcasts", () => {
  const useCase = new FilterPodcasts();
  const catalog = [
    podcast("1", "The Daily", "The New York Times"),
    podcast("2", "Crime Junkie", "audiochuck"),
    podcast("3", "Daily Tech News", "All About Android"),
  ];

  it("returns all podcasts when query is empty or whitespace", () => {
    expect(useCase.execute(catalog, "")).toHaveLength(3);
    expect(useCase.execute(catalog, "   ")).toHaveLength(3);
  });

  it("filters by title case-insensitively", () => {
    const result = useCase.execute(catalog, "daily");
    expect(result.map((p) => p.id)).toEqual(["1", "3"]);
  });

  it("filters by author", () => {
    const result = useCase.execute(catalog, "audiochuck");
    expect(result.map((p) => p.id)).toEqual(["2"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(useCase.execute(catalog, "xyz-no-match")).toEqual([]);
  });
});
