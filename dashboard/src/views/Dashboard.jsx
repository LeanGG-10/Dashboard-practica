import { useEffect, useMemo, useState } from "react";
import StockCard from "../components/stocks/StockCard";
import { useSession } from "../hooks/useSession";
import { getMultipleStockPrices } from "../services/marketDataService";
import { getUserAssets } from "../services/portfolioService";
import { useAuth } from "../hooks/useAuth";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const mapAlphaData = (stockFromService, assetFromSupabase) => {
  if (!stockFromService) return null;

  return {
    ...stockFromService,
    name: assetFromSupabase.name || "ETF Asset",
    shares: assetFromSupabase.quantity,
  };
};

export default function DashboardPage() {
  const { session } = useSession();

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [filter, setFilter] = useState("all");
  const { logout } = useAuth();

  const handleLogout = () => {
    console.log("Logout clicked test");
    logout();
  };
  useEffect(() => {
    if (!session?.user?.id) return;
    loadPortfolio(session.user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  async function loadPortfolio(userId) {
    setLoading(true);
    setLoadingProgress("");

    try {
      const assets = await getUserAssets(userId);

      if (assets.length === 0) {
        setStocks([]);
        return;
      }

      const tickers = assets.map((a) => a.ticker.trim().toUpperCase());

      const results = await getMultipleStockPrices(
        tickers,
        (current, total, ticker) => {
          setLoadingProgress(`Cargando ${ticker} (${current}/${total})...`);
        },
      );

      const stocksData = results
        .filter((r) => r.success && r.data)
        .map((r) => {
          const asset = assets.find(
            (a) => a.ticker.trim().toUpperCase() === r.ticker,
          );
          return asset ? mapAlphaData(r.data, asset) : null;
        })
        .filter(Boolean);

      setStocks(stocksData);
    } catch (err) {
      console.error("Error crítico en el flujo de datos:", err);
    } finally {
      setLoading(false);
      setLoadingProgress("");
    }
  }

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      if (filter === "up") return s.change >= 0;
      if (filter === "down") return s.change < 0;
      return true;
    });
  }, [stocks, filter]);

  const totalValue = useMemo(
    () => stocks.reduce((acc, s) => acc + s.price * s.shares, 0),
    [stocks],
  );
  const totalGain = useMemo(
    () => stocks.reduce((acc, s) => acc + s.change * s.shares, 0),
    [stocks],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-mono">
        <div className="animate-pulse text-lg mb-2">Cargando mercado...</div>
        {loadingProgress && (
          <div className="text-zinc-500 text-sm">{loadingProgress}</div>
        )}
      </div>
    );
  }

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
              <p className="text-zinc-500 text-[9px] uppercase font-mono tracking-widest">
                Balance Total
              </p>
              <h1 className="text-white font-bold text-3xl font-mono">
                {formatCurrency(totalValue)}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-[9px] uppercase font-mono tracking-widest">
                Ganancia Hoy
              </p>
              <span
                className={`font-bold text-2xl font-mono ${
                  totalGain >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {totalGain >= 0 ? "+" : ""}
                {formatCurrency(totalGain)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 py-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <span className="text-zinc-500 group-hover:text-red-400 text-[10px] font-mono uppercase tracking-tight">
                Cerrar Sesión
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-600 group-hover:text-red-400"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex gap-2 mb-8">
            {["all", "up", "down"].map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-xl border text-[10px] font-mono uppercase transition-all ${
                  filter === k
                    ? "bg-white text-black border-white"
                    : "text-zinc-500 border-zinc-800 hover:text-white"
                }`}
              >
                {k === "all" ? "Todos" : k === "up" ? "Alzas" : "Bajas"}
              </button>
            ))}
          </div>

          {stocks.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              <p className="text-lg mb-2">No hay activos en tu cartera</p>
              <p className="text-sm">Agrega activos para verlos aquí</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((s) => (
                <StockCard key={s.symbol} stock={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
