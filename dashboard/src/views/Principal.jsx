import { useNavigate } from "react-router-dom";

// }
//Falta pulir detalles porque está de prueba
const TEAM = [
  {
    name: "Valeria Torres",
    role: "Lead Developer",
    initials: "VT",
    color: "#c9a84c",
  },
  {
    name: "Sebastián Ruiz",
    role: "UI/UX Designer",
    initials: "SR",
    color: "#6e9e7c",
  },
  {
    name: "Camila Flores",
    role: "Backend Engineer",
    initials: "CF",
    color: "#7a8cbf",
  },
  {
    name: "Andrés Mora",
    role: "Data Analyst",
    initials: "AM",
    color: "#b56e6e",
  },
];

const FEATURES = [
  {
    icon: "◈",
    title: "Portafolio en Tiempo Real",
    desc: "Visualiza el valor total de tus activos con actualizaciones al instante del mercado.",
  },
  {
    icon: "⬡",
    title: "Análisis de Mercado",
    desc: "Gráficas interactivas de índices, acciones y criptomonedas con indicadores técnicos.",
  },
  {
    icon: "◎",
    title: "Alertas Inteligentes",
    desc: "Configura umbrales de precio y recibe notificaciones cuando el mercado se mueva.",
  },
  {
    icon: "⟐",
    title: "Historial de Transacciones",
    desc: "Registro completo de compras y ventas con rendimiento por activo y período.",
  },
];


export default function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  }


  return (
    <div
      style={{
        fontFamily: "'DM Serif Display', Georgia, serif",
        background: "#0a0c0f",
        color: "#e8e2d4",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .gold { color: #c9a84c; }
        .mono { font-family: 'DM Mono', monospace; }
        .sans { font-family: 'DM Sans', sans-serif; }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a9185;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #e8e2d4; }

        .btn-primary {
          background: #c9a84c;
          color: #0a0c0f;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 28px;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .btn-primary:hover {
          background: #e0be6a;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }

        .btn-outline {
          background: transparent;
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 11px 27px;
          border: 1px solid #c9a84c44;
          cursor: pointer;
          transition: all 0.25s;
        }
        .btn-outline:hover {
          border-color: #c9a84c;
          background: #c9a84c11;
        }

        .ticker-track {
          display: flex;
          gap: 0;
          transition: none;
        }

        .stat-card {
          background: #0f1318;
          border: 1px solid #1e2530;
          padding: 24px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c44, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .stat-card:hover { border-color: #c9a84c33; transform: translateY(-2px); }
        .stat-card:hover::before { opacity: 1; }

        .feature-card {
          background: #0d1016;
          border: 1px solid #1a2030;
          padding: 32px;
          transition: all 0.3s;
          position: relative;
        }
        .feature-card:hover {
          border-color: #c9a84c44;
          background: #111520;
        }

        .team-card {
          background: #0f1318;
          border: 1px solid #1e2530;
          padding: 28px 24px;
          text-align: center;
          transition: all 0.3s;
        }
        .team-card:hover {
          border-color: #c9a84c33;
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }

        .divider-line {
          width: 40px;
          height: 1px;
          background: #c9a84c;
          margin: 16px 0;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-1 { animation: fadeInUp 0.7s ease forwards; }
        .fade-in-2 { animation: fadeInUp 0.7s 0.15s ease both; }
        .fade-in-3 { animation: fadeInUp 0.7s 0.3s ease both; }
        .fade-in-4 { animation: fadeInUp 0.7s 0.45s ease both; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise" />

      {/* ── NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,12,15,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #1e2530",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,9 26,23 14,26 2,23 2,9" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
            <polygon points="14,7 21,11 21,20 14,23 7,20 7,11" fill="#c9a84c" opacity="0.2" />
            <line x1="14" y1="2" x2="14" y2="26" stroke="#c9a84c" strokeWidth="1" opacity="0.5" />
            <line x1="2" y1="9" x2="26" y2="23" stroke="#c9a84c" strokeWidth="1" opacity="0.3" />
            <line x1="26" y1="9" x2="2" y2="23" stroke="#c9a84c" strokeWidth="1" opacity="0.3" />
          </svg>
          <span style={{ fontSize: "18px", letterSpacing: "0.05em" }}>
            <span className="gold">Analizar Portafolio</span>
          </span>
        </div>

        {/* En un futuro puede servir por ahora no*/}
        {/* <div style={{ display: "flex", gap: "32px" }}>
          {["Mercado", "Portafolios", "Análisis", "Precios"].map((l) => (
            <span key={l} className="nav-link">{l}</span>
          ))}
        </div> */}

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={handleLogin} className="btn-primary">Iniciar Sesión</button>
        </div>
      </nav>

      {/* ── TICKER ── */}
      
      {/* ── HERO ── */}
      <section
        className="grid-bg"
        style={{
          position: "relative",
          padding: "100px 48px 80px",
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
          minHeight: "calc(100vh - 108px)",
        }}
      >
        {/* Glow orbs */}
        <div
          className="glow-orb"
          style={{ width: 400, height: 400, background: "#c9a84c", opacity: 0.07, top: -100, left: -100 }}
        />
        <div
          className="glow-orb"
          style={{ width: 300, height: 300, background: "#7a8cbf", opacity: 0.08, bottom: 0, right: 100 }}
        />

        {/* Left */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            className="fade-in-1 mono"
            style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#c9a84c", marginBottom: "20px", textTransform: "uppercase" }}
          >
            ◈ Dashboard Financiero
          </div>

          <h1
            className="fade-in-2"
            style={{ fontSize: "clamp(42px, 5vw, 68px)", lineHeight: "1.05", marginBottom: "28px", letterSpacing: "-0.02em" }}
          >
            Tu mercado.<br />
            <em style={{ color: "#c9a84c" }}>Tu portafolio.</em><br />
            En tiempo real.
          </h1>

          <p
            className="fade-in-3 sans"
            style={{ fontSize: "16px", color: "#7a7268", lineHeight: "1.8", maxWidth: "440px", marginBottom: "40px", fontWeight: 300 }}
          >
            Monitorea el valor de tus activos, analiza tendencias del mercado
            y toma decisiones de inversión con datos precisos y actualizados
            al instante.
          </p>


          {/* Stats row */}
          
        </div>

        {/* Right – Dashboard Preview */}
          
      </section>

      {/* ── MARKET CARDS ── */}
      
      {/* ── FEATURES ── */}
      <section style={{ padding: "100px 48px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          <div>
            <div className="mono gold" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
              ◈ Funcionalidades
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
              Todo lo que<br />
              <em style={{ color: "#c9a84c" }}>necesitas saber</em><br />
              sobre tu dinero.
            </h2>
            <div className="divider-line" />
            <p className="sans" style={{ fontSize: "15px", color: "#7a7268", lineHeight: "1.8", fontWeight: 300, maxWidth: "380px" }}>
              AUXIS centraliza la información de mercado y tus posiciones
              en un panel limpio, profesional y completamente personalizable.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: "24px", marginBottom: "16px", color: "#c9a84c" }}>{f.icon}</div>
                <div style={{ fontSize: "15px", marginBottom: "10px", letterSpacing: "-0.01em" }}>{f.title}</div>
                <div className="sans" style={{ fontSize: "13px", color: "#5a5450", lineHeight: "1.7", fontWeight: 300 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        style={{
          background: "#07080b",
          borderTop: "1px solid #1e2530",
          padding: "100px 48px",
        }}
        id="equipo"
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="mono gold" style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
              ◈ El Equipo
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", letterSpacing: "-0.02em", lineHeight: "1.1" }}>
              Construido por personas<br />
              <em style={{ color: "#c9a84c" }}>apasionadas por las finanzas.</em>
            </h2>
            <div style={{ width: "40px", height: "1px", background: "#c9a84c", margin: "20px auto 0" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: `${member.color}22`,
                    border: `1px solid ${member.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <span className="mono" style={{ fontSize: "16px", color: member.color, letterSpacing: "0.05em" }}>
                    {member.initials}
                  </span>
                </div>
                <div style={{ fontSize: "17px", marginBottom: "6px", letterSpacing: "-0.01em" }}>
                  {member.name}
                </div>
                <div
                  className="sans"
                  style={{ fontSize: "12px", color: "#5a5450", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {member.role}
                </div>
                <div
                  style={{ width: "24px", height: "1px", background: member.color, margin: "16px auto 0", opacity: 0.5 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #1e2530",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px", letterSpacing: "0.05em" }}>
            <span className="gold">AUX</span>IS
          </span>
          <span className="sans" style={{ fontSize: "12px", color: "#3a3530" }}>
            © 2026 · Dashboard Financiero
          </span>
        </div>
        <div className="sans" style={{ fontSize: "12px", color: "#3a3530", letterSpacing: "0.04em" }}>
          Los datos mostrados son de carácter informativo. No constituyen asesoría financiera.
        </div>
      </footer>
    </div>
  );
}