import { fetchJson, HttpError } from "@/shared/http/fetchJson";

describe("fetchJson", () => {
  it("returns parsed JSON on success", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hello: "world" }),
    });

    await expect(
      fetchJson<{ hello: string }>("https://example.com/api", { fetchImpl }),
    ).resolves.toEqual({ hello: "world" });

    expect(fetchImpl).toHaveBeenCalledWith("https://example.com/api", {
      signal: undefined,
    });
  });

  it("forwards AbortSignal", async () => {
    const controller = new AbortController();
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await fetchJson("https://example.com/api", {
      fetchImpl,
      signal: controller.signal,
    });

    expect(fetchImpl).toHaveBeenCalledWith("https://example.com/api", {
      signal: controller.signal,
    });
  });

  it("throws HttpError when response is not ok", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    await expect(
      fetchJson("https://example.com/api", { fetchImpl }),
    ).rejects.toBeInstanceOf(HttpError);

    await expect(
      fetchJson("https://example.com/api", { fetchImpl }),
    ).rejects.toMatchObject({ status: 503, url: "https://example.com/api" });
  });
});
