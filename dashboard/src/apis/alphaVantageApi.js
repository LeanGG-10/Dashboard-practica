const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export async function fetchGlobalQuote(ticker) {
  const response = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
      ticker,
    )}&apikey=${API_KEY}`,
  );

  return await response.json();
}