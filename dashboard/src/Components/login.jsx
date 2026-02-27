// LoginPage.jsx
// Usa el cliente global de Supabase definido en supabaseClient.js

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ← ajusta la ruta según tu estructura

// ─── Componente de Autenticación ──────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text: "" }
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Animación de montaje (separado para evitar setState síncrono en el mismo efecto)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Escuchar cambios de sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const clearMessage = () => setMessage(null);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessage();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "¡Bienvenido de vuelta!" });
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessage();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Cuenta creada. Revisa tu correo para confirmar." });
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessage();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Enlace de recuperación enviado a tu correo." });
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    clearMessage();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setLoading(false);
  };

  // ─── Vista post-login ────────────────────────────────────────────────────────
  if (session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-mono">
        <div
          className="bg-[#111118] border border-[#2a2a3a] rounded-2xl p-10 max-w-md w-full text-center"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}
        >
          <div className="w-16 h-16 bg-[#7c3aed]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#7c3aed]/40">
            <svg className="w-8 h-8 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl text-white mb-2 font-semibold tracking-tight">Sesión iniciada</h2>
          <p className="text-[#6b7280] text-sm mb-8 break-all">{session.user.email}</p>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-[#1a1a2e] border border-[#2a2a3a] text-[#a78bfa] text-sm font-medium hover:bg-[#7c3aed]/10 hover:border-[#7c3aed]/50 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    );
  }

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#7c3aed]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-[#2563eb]/4 rounded-full blur-[100px]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#1e1e2e] rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Logo / Ícono */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-14 h-14 bg-linear-to-br from-[#7c3aed] to-[#2563eb] rounded-xl flex items-center justify-center shadow-lg shadow-[#7c3aed]/30">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#111118]" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              {isLogin && "Iniciar sesión"}
              {isRegister && "Crear cuenta"}
              {isReset && "Recuperar contraseña"}
            </h1>
            <p className="text-[#6b7280] text-sm">
              {isLogin && "Bienvenido de vuelta"}
              {isRegister && "Únete hoy"}
              {isReset && "Te enviaremos un enlace al correo"}
            </p>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-3 border ${
                message.type === "error"
                  ? "bg-[#ef4444]/10 border-[#ef4444]/30 text-[#fca5a5]"
                  : "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#86efac]"
              }`}
            >
              <span className="shrink-0 mt-0.5">
                {message.type === "error" ? "⚠" : "✓"}
              </span>
              {message.text}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={isLogin ? handleLogin : isRegister ? handleRegister : handleReset} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5 tracking-wide uppercase">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all duration-200"
              />
            </div>

            {/* Contraseña */}
            {!isReset && (
              <div>
                <label className="block text-xs font-medium text-[#9ca3af] mb-1.5 tracking-wide uppercase">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Olvidé contraseña */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode("reset"); clearMessage(); }}
                  className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Botón principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 mt-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm font-semibold hover:from-[#6d28d9] hover:to-[#5b21b6] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#7c3aed]/20 relative overflow-hidden group"
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>
                {isLogin && "Iniciar sesión"}
                {isRegister && "Crear cuenta"}
                {isReset && "Enviar enlace"}
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Divider + OAuth (solo en login/register) */}
          {!isReset && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#1e1e2e]" />
                <span className="text-xs text-[#374151] tracking-wider uppercase">o continúa con</span>
                <div className="flex-1 h-px bg-[#1e1e2e]" />
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] text-[#d1d5db] text-sm font-medium hover:bg-[#1a1a2e] hover:border-[#2a2a3a] transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </button>
            </>
          )}

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-[#6b7280]">
            {isLogin && (
              <>
                ¿No tienes cuenta?{" "}
                <button onClick={() => { setMode("register"); clearMessage(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] font-medium transition-colors">
                  Regístrate
                </button>
              </>
            )}
            {isRegister && (
              <>
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => { setMode("login"); clearMessage(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] font-medium transition-colors">
                  Iniciar sesión
                </button>
              </>
            )}
            {isReset && (
              <button onClick={() => { setMode("login"); clearMessage(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] font-medium transition-colors flex items-center gap-1 mx-auto">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio de sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}