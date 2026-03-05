import { fetchGlobalQuote } from "../apis/alphaVantageApi";

// Alpha Vantage (plan gratuito): ~5 requests/min.
const MIN_REQUEST_INTERVAL_MS = 13_000;
let lastRequestTime = 0;
const inflightByTicker = new Map();
const SHOULD_RATE_LIMIT = !import.meta.env.VITEST;

const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

function getCacheKey(ticker) {
  return `price_${ticker.toUpperCase()}`;
}

function readCache(ticker) {
  const raw = localStorage.getItem(getCacheKey(ticker));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(ticker, payload) {
  localStorage.setItem(getCacheKey(ticker), JSON.stringify(payload));
}

async function waitForRateLimit() {
  if (!SHOULD_RATE_LIMIT) {
    lastRequestTime = Date.now();
    return;
  }
  const now = Date.now();
  const since = now - lastRequestTime;
  if (since < MIN_REQUEST_INTERVAL_MS) {
    const waitMs = MIN_REQUEST_INTERVAL_MS - since;
    await new Promise((r) => setTimeout(r, waitMs));
  }
  lastRequestTime = Date.now();
}

function mapGlobalQuoteToQuote(globalQuote) {
  if (!globalQuote || Object.keys(globalQuote).length === 0) return null;

  return {
    symbol: globalQuote["01. symbol"],
    price: parseFloat(globalQuote["05. price"]),
    open: parseFloat(globalQuote["02. open"]),
    high: parseFloat(globalQuote["03. high"]),
    low: parseFloat(globalQuote["04. low"]),
    volume: parseInt(globalQuote["06. volume"]),
    change: parseFloat(globalQuote["09. change"]),
    changePercent: parseFloat(
      String(globalQuote["10. change percent"] ?? "").replace("%", ""),
    ),
    latestTradingDay: globalQuote["07. latest trading day"],
    previousClose: parseFloat(globalQuote["08. previous close"]),
  };
}

export async function getStockPrice(ticker) {
  const cache = readCache(ticker);
  if (cache && Date.now() - cache.time < CACHE_DURATION_MS) {
    if (cache.error === "rate_limit") {
      throw new Error("Límite de peticiones alcanzado. Reintenta en 1 minuto.");
    }
    if (cache.data) return cache.data;
  }

  const upper = ticker.toUpperCase();
  if (inflightByTicker.has(upper)) return await inflightByTicker.get(upper);

  const promise = (async () => {
    await waitForRateLimit();

    try {
      const data = await fetchGlobalQuote(upper);

      if (data?.Note || data?.Information) {
        writeCache(upper, {
          data: null,
          time: Date.now() - (CACHE_DURATION_MS - 60_000), // expira en ~1 min
          error: "rate_limit",
        });
        throw new Error("Límite de peticiones alcanzado. Reintenta en 1 minuto.");
      }

      const mapped = mapGlobalQuoteToQuote(data?.["Global Quote"]);
      if (!mapped) throw new Error(`Ticker ${upper} no encontrado`);

      writeCache(upper, { data: mapped, time: Date.now() });
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(message);
    } finally {
      inflightByTicker.delete(upper);
    }
  })();

  inflightByTicker.set(upper, promise);
  return await promise;
}

export async function getMultipleStockPrices(tickers, onProgress) {
  const results = [];
  const total = tickers.length;

  for (let i = 0; i < tickers.length; i++) {
    const t = tickers[i];
    try {
      const data = await getStockPrice(t);
      results.push({ ticker: t.toUpperCase(), data, success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        ticker: t.toUpperCase(),
        data: null,
        success: false,
        error: message,
      });
    }

    if (onProgress) onProgress(i + 1, total, t.toUpperCase());
  }

  return results;
}

export function clearMarketDataCache() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("price_")) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

