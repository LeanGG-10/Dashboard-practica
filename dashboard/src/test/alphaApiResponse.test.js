import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStockPrice } from '../services/finanzasService';

// 1. SIMULADOR DE MEMORIA REAL PARA LOCALSTORAGE
// Esto asegura que getItem devuelva lo que setItem guardó
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn((key) => { delete store[key]; })
  };
})();

// Reemplazamos el localStorage global con nuestro simulador
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// 2. Mock global de fetch
globalThis.fetch = vi.fn();

describe('FinanceService - Alpha Vantage API', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); 
    localStorage.clear(); // Ahora esto sí limpia el 'store' interno
  });

  it('debe mapear correctamente los datos de la API a números (HU02)', async () => {
    const mockResponse = {
      "Global Quote": {
        "01. symbol": "VOO",
        "02. open": "632.6100",
        "05. price": "500.25",
        "10. change percent": "0.50%",
        "07. latest trading day": "2026-02-20"
      }
    };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getStockPrice('VOO');

    expect(result.symbol).toBe('VOO');
    expect(result.price).toBe(500.25);
    expect(typeof result.price).toBe('number');
    expect(result.changePercent).toBe(0.5); 
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('debe usar el caché de LocalStorage y NO llamar a la API si el dato es reciente', async () => {
    const ticker = 'VOO';
    const mockData = { symbol: 'VOO', price: 500.25, changePercent: 0.5 };
    
    // Guardamos el dato en nuestro simulador real
    localStorage.setItem(`price_${ticker}`, JSON.stringify({
      data: mockData,
      time: Date.now()
    }));

    const result = await getStockPrice(ticker);

    // Verificaciones:
    expect(result.price).toBe(500.25);
    // ¡AHORA SÍ! Fetch no debe haber sido llamado porque el simulador devolvió el dato
    expect(fetch).not.toHaveBeenCalled(); 
  });

  it('debe lanzar un error cuando se alcanza el límite de la API (Note)', async () => {
    const mockRateLimit = {
      "Note": "Thank you for using Alpha Vantage! Our standard API rate limit is 5 requests per minute..."
    };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockRateLimit),
    });

    await expect(getStockPrice('VOO')).rejects.toThrow("Límite de peticiones alcanzado");
  });

  it('debe lanzar un error cuando el ticker no existe', async () => {
    const mockEmpty = { "Global Quote": {} };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockEmpty),
    });

    await expect(getStockPrice('INVALID')).rejects.toThrow("Ticker INVALID no encontrado");
  });
});