const formatVolume = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v;
};

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const Badge = ({ positive, children }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${
      positive
        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
        : "bg-red-400/10 text-red-400 border border-red-400/20"
    }`}
  >
    {positive ? "▲" : "▼"} {children}
  </span>
);

const StatBlock = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <span
      style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px" }}
      className="text-zinc-500 uppercase"
    >
      {label}
    </span>
    <span
      style={{ fontFamily: "'DM Mono', monospace" }}
      className="text-zinc-200 text-xs font-medium"
    >
      {value}
    </span>
  </div>
);

const MiniChart = ({ high, low, price, open }) => {
  const range = high - low;
  const safeRange = range === 0 ? 1 : range;
  const pricePos = ((price - low) / safeRange) * 100;
  const openPos = ((open - low) / safeRange) * 100;
  const positive = price >= open;

  return (
    <div className="relative w-full h-1 rounded-full bg-zinc-800 mt-3">
      <div
        className={`absolute h-full rounded-full ${
          positive ? "bg-emerald-400/40" : "bg-red-400/40"
        }`}
        style={{
          left: `${Math.min(openPos, pricePos)}%`,
          width: `${Math.abs(pricePos - openPos)}%`,
        }}
      />
      <div
        className={`absolute w-2 h-2 rounded-full -translate-y-1/2 top-1/2 border-2 ${
          positive
            ? "bg-emerald-400 border-emerald-400/50"
            : "bg-red-400 border-red-400/50"
        }`}
        style={{ left: `calc(${pricePos}% - 4px)` }}
      />
    </div>
  );
};

export default function StockCard({ stock }) {
  const positive = stock.change >= 0;

  return (
    <div className="relative rounded-2xl p-4 border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-mono">
              {stock.symbol}
            </span>
            <Badge positive={positive}>{stock.changePercent.toFixed(2)}%</Badge>
          </div>
          <p className="text-zinc-500 text-xs italic">{stock.name}</p>
        </div>
        <div className="text-right">
          <div className="text-white font-bold font-mono text-lg">
            ${stock.price.toFixed(2)}
          </div>
          <span
            className={`font-mono text-sm ${
              positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {positive ? "+" : ""}${stock.change.toFixed(2)}
          </span>
        </div>
      </div>

      <MiniChart
        high={stock.high}
        low={stock.low}
        price={stock.price}
        open={stock.open}
      />

      <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/50">
        <StatBlock label="Open" value={`$${stock.open.toFixed(2)}`} />
        <StatBlock label="Prev" value={`$${stock.previousClose.toFixed(2)}`} />
        <StatBlock label="Vol" value={formatVolume(stock.volume)} />
      </div>

      <div className="mt-4">
        <span className="text-zinc-500 text-[9px] uppercase font-mono block">
          En cartera
        </span>
        <p className="text-zinc-200 text-sm font-bold font-mono">
          {stock.shares} acc · {formatCurrency(stock.shares * stock.price)}
        </p>
      </div>
    </div>
  );
}
