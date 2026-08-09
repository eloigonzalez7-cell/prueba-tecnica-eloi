const ITUNES_ORIGIN = "https://itunes.apple.com";
const DEV_PROXY_PREFIX = "/itunes-proxy";
const ALL_ORIGINS_RAW = "https://api.allorigins.win/raw?url=";

export type CorsProxyOptions = {
  /**
   * When true, rewrite iTunes URLs to the Webpack dev-server proxy.
   * Defaults to development mode.
   */
  useDevProxy?: boolean;
};

function shouldUseDevProxy(useDevProxy?: boolean): boolean {
  if (typeof useDevProxy === "boolean") {
    return useDevProxy;
  }
  return process.env.NODE_ENV === "development";
}

/**
 * Build a browser-safe URL for iTunes (no CORS).
 * - Dev: Webpack proxy `/itunes-proxy`
 * - Prod: AllOrigins raw proxy (brief recommendation)
 */
export function toCorsSafeUrl(
  targetUrl: string,
  options: CorsProxyOptions = {},
): string {
  if (shouldUseDevProxy(options.useDevProxy)) {
    if (targetUrl.startsWith(ITUNES_ORIGIN)) {
      return `${DEV_PROXY_PREFIX}${targetUrl.slice(ITUNES_ORIGIN.length)}`;
    }
    return targetUrl;
  }

  return `${ALL_ORIGINS_RAW}${encodeURIComponent(targetUrl)}`;
}
