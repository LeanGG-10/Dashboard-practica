const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_ALPHA_URL = 'https://www.alphavantage.co/query';

// Control de rate limiting (5 peticiones por minuto en plan gratuito)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 13000; // 13 segundos entre peticiones

// Configuración de caché (30 días)
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 días en ms

// Función para esperar entre peticiones
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`⏳ Esperando ${Math.ceil(waitTime/1000)}s para siguiente petición...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

// Función para obtener precio con rate limiting
export const getStockPrice = async (ticker) => {
  // 1. REVISAR CACHÉ PRIMERO (No gasta créditos)
  const cacheKey = `price_${ticker}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, time } = JSON.parse(cached);
    // Usamos caché si no ha expirado (30 días)
    if (Date.now() - time < CACHE_DURATION) {
      const daysOld = Math.round((Date.now() - time) / 86400000);
      console.log(`🚀 Usando caché para ${ticker} (${daysOld} días old)`);
      return data; 
    }
  }

  // 2. Esperar por rate limiting antes de hacer la petición
  await waitForRateLimit();

  try {
    // Realizar la petición
    const response = await fetch(
      `${BASE_ALPHA_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
    );

    console.log(`📡 Consultando Alpha Vantage para ${ticker}...`);
    
    // Validamos la respuesta HTTP
    const data = await response.json();
    console.log("Respuesta de Alpha Vantage:", data);

    // Validamos el límite de la API 
    if (data["Note"] || data["Information"]) {
      console.warn("⚠️ Límite alcanzado - Guardando en caché error temporal");
      localStorage.setItem(cacheKey, JSON.stringify({
        data: null,
        time: Date.now() - (CACHE_DURATION - 60000), // Expira en 1 minuto
        error: "rate_limit"
      }));
      throw new Error("Límite de peticiones alcanzado. Reintenta en 1 minuto.");
    }

    const quote = data["Global Quote"];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`Ticker ${ticker} no encontrado`);
    }

    const mappedData = {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      open: parseFloat(quote["02. open"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      volume: parseInt(quote["06. volume"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      latestTradingDay: quote["07. latest trading day"],
      previousClose: parseFloat(quote["08. previous close"])
    };

    // GUARDAR EN CACHÉ por 30 días
    localStorage.setItem(cacheKey, JSON.stringify({
      data: mappedData,
      time: Date.now()
    }));

    return mappedData;

  } catch (error) {
    console.error(`❌ Error en FinanceService para ${ticker}:`, error.message);
    throw error;
  }
};

// Función para obtener varios tickers de forma secuencial
export const getMultipleStockPrices = async (tickers, onProgress) => {
  const results = [];
  const total = tickers.length;
  
  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    console.log(`📊 Progreso: ${i + 1}/${total} - Obteniendo ${ticker}`);
    
    try {
      const data = await getStockPrice(ticker);
      results.push({ ticker, data, success: true });
    } catch (error) {
      console.error(`Error obteniendo ${ticker}:`, error.message);
      results.push({ ticker, data: null, success: false, error: error.message });
    }
    
    if (onProgress) {
      onProgress(i + 1, total, ticker);
    }
  }
  
  return results;
};

// Función para limpiar caché manualmente
export const clearCache = () => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('price_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`🗑️ Caché limpiado: ${keysToRemove.length} elementos eliminados`);
};
