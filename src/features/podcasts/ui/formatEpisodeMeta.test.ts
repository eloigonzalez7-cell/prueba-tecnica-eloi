import {
  formatEpisodeDate,
  formatEpisodeDuration,
} from "@/features/podcasts/ui/formatEpisodeMeta";

describe("formatEpisodeDate", () => {
  it("formats as DD/MM/YYYY", () => {
    expect(formatEpisodeDate(new Date(2024, 0, 5))).toBe("05/01/2024");
  });
});

describe("formatEpisodeDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatEpisodeDuration(65_000)).toBe("1:05");
  });

  it("formats hours when needed", () => {
    expect(formatEpisodeDuration(3_661_000)).toBe("1:01:01");
  });

  it("clamps negative values to zero", () => {
    expect(formatEpisodeDuration(-1)).toBe("0:00");
  });
});
