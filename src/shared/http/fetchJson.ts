export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export type FetchJsonOptions = {
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
};

/**
 * Minimal JSON GET helper with AbortSignal support for cancelled navigations.
 */
export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(url, { signal: options.signal });

  if (!response.ok) {
    throw new HttpError(
      `Request failed with status ${response.status}`,
      response.status,
      url,
    );
  }

  return (await response.json()) as T;
}
