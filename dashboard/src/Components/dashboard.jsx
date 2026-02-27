import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getMultipleStockPrices } from "../services/finanzasService";

// --- FUNCIONES DE UTILIDAD ---
const formatVolume = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v;
};

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

// Función clave para mapear lo que recibes de Alpha Vantage
const mapAlphaData = (stockFromService, assetFromSupabase) => {
  if (!stockFromService) return null;

  return {
    ...stockFromService,
    name: assetFromSupabase.name || "ETF Asset", 
    shares: assetFromSupabase.quantity,
  };
};

// --- COMPONENTES VISUALES ---
const Badge = ({ positive, children }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${positive ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" : "bg-red-400/10 text-red-400 border border-red-400/20"}`}>
    {positive ? "▲" : "▼"} {children}
  </span>
);

const StatBlock = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px" }} className="text-zinc-500 uppercase">{label}</span>
    <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-zinc-200 text-xs font-medium">{value}</span>
  </div>
);

const MiniChart = ({ high, low, price, open }) => {
  const range = high - low;
  const pricePos = ((price - low) / range) * 100;
  const openPos = ((open - low) / range) * 100;
  const positive = price >= open;
  return (
    <div className="relative w-full h-1 rounded-full bg-zinc-800 mt-3">
      <div className={`absolute h-full rounded-full ${positive ? "bg-emerald-400/40" : "bg-red-400/40"}`} style={{ left: `${Math.min(openPos, pricePos)}%`, width: `${Math.abs(pricePos - openPos)}%` }} />
      <div className={`absolute w-2 h-2 rounded-full -translate-y-1/2 top-1/2 border-2 ${positive ? "bg-emerald-400 border-emerald-400/50" : "bg-red-400 border-red-400/50"}`} style={{ left: `calc(${pricePos}% - 4px)` }} />
    </div>
  );
};

const StockCard = ({ stock }) => {
  const positive = stock.change >= 0;
  return (
    <div className="relative rounded-2xl p-4 border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-mono">{stock.symbol}</span>
            <Badge positive={positive}>{stock.changePercent.toFixed(2)}%</Badge>
          </div>
          <p className="text-zinc-500 text-xs italic">{stock.name}</p>
        </div>
        <div className="text-right">
          <div className="text-white font-bold font-mono text-lg">${stock.price.toFixed(2)}</div>
          <span className={`font-mono text-sm ${positive ? "text-emerald-400" : "text-red-400"}`}>{positive ? "+" : ""}${stock.change.toFixed(2)}</span>
        </div>
      </div>
      <MiniChart high={stock.high} low={stock.low} price={stock.price} open={stock.open} />
      <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/50">
        <StatBlock label="Open" value={`$${stock.open.toFixed(2)}`} />
        <StatBlock label="Prev" value={`$${stock.previousClose.toFixed(2)}`} />
        <StatBlock label="Vol" value={formatVolume(stock.volume)} />
      </div>
      <div className="mt-4">
        <span className="text-zinc-500 text-[9px] uppercase font-mono block">En cartera</span>
        <p className="text-zinc-200 text-sm font-bold font-mono">{stock.shares} acc · {formatCurrency(stock.shares * stock.price)}</p>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function StockDashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Obtener la sesión actual y cargar el portfolio
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadPortfolio(session.user.id);
      }
    });
  }, []);

  async function loadPortfolio(userId) {
    try {
      console.log("📊 Cargando activos para el usuario:", userId);

      // Consulta assets del usuario logueado
      const { data: assets, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (assets.length === 0) {
        console.warn("⚠️ No se encontraron activos para este usuario.");
        setStocks([]);
        setLoading(false);
        return;
      }

      console.log(`✅ Se encontraron ${assets.length} activos:`, assets.map(a => a.ticker).join(", "));

      // Procesar con Alpha Vantage de forma secuencial (controlando rate limit)
      const tickers = assets.map(a => a.ticker.trim().toUpperCase());
      
      const results = await getMultipleStockPrices(tickers, (current, total, ticker) => {
        setLoadingProgress(`Cargando ${ticker} (${current}/${total})...`);
      });

      // Mapear resultados exitosos
      const stocksData = results
        .filter(r => r.success && r.data)
        .map(r => {
          const asset = assets.find(a => a.ticker.trim().toUpperCase() === r.ticker);
          return mapAlphaData(r.data, asset);
        })
        .filter(s => s !== null);

      console.log("📈 Activos cargados correctamente:", stocksData.length);
      setStocks(stocksData);

    } catch (err) {
      console.error("❌ Error crítico en el flujo de datos:", err);
    } finally {
      setLoading(false);
      setLoadingProgress("");
    }
  }

  // Lógica de filtrado y totales
  const filtered = stocks.filter(s => {
    if (filter === "up") return s.change >= 0;
    if (filter === "down") return s.change < 0;
    return true;
  });

  const totalValue = stocks.reduce((acc, s) => acc + (s.price * s.shares), 0);
  const totalGain = stocks.reduce((acc, s) => acc + (s.change * s.shares), 0);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-mono">
      <div className="animate-pulse text-lg mb-2">Cargando mercado...</div>
      {loadingProgress && <div className="text-zinc-500 text-sm">{loadingProgress}</div>}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Mono:wght@400;500&display=swap');
        body { background: #0a0a0b; }
      `}</style>

      <div className="min-h-screen bg-zinc-950">
        <div className="sticky top-0 z-10 bg-zinc-950/90 border-b border-zinc-800/60 px-6 py-4 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-zinc-500 text-[9px] uppercase font-mono tracking-widest">Balance Total</p>
              <h1 className="text-white font-bold text-3xl font-mono">{formatCurrency(totalValue)}</h1>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-[9px] uppercase font-mono tracking-widest">Ganancia Hoy</p>
              <span className={`font-bold text-2xl font-mono ${totalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {totalGain >= 0 ? "+" : ""}{formatCurrency(totalGain)}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Filtros */}
            <div className="flex gap-2 mb-8">
                {["all", "up", "down"].map(k => (
                    <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-xl border text-[10px] font-mono uppercase transition-all ${filter === k ? "bg-white text-black border-white" : "text-zinc-500 border-zinc-800 hover:text-white"}`}>
                        {k === "all" ? "Todos" : k === "up" ? "Alzas" : "Bajas"}
                    </button>
                ))}
            </div>

            {stocks.length === 0 ? (
              <div className="text-center text-zinc-500 py-12">
                <p className="text-lg mb-2">No hay activos en tu cartera</p>
                <p className="text-sm">Agrega activos desde Supabase para verlos aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map(s => (
                      <StockCard key={s.symbol} stock={s} onBuy={() => {}} onSell={() => {}} />
                  ))}
              </div>
            )}
        </div>
      </div>
    </>
  );
}
