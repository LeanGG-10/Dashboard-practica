import { useState, useEffect } from 'react';
import StockDashboard from './Components/dashboard';
import LoginPage from './View/Login';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual al iniciar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-mono">
        Cargando...
      </div>
    );
  }

  // Si hay sesión, mostrar dashboard; si no, mostrar login
  return session ? <StockDashboard /> : <LoginPage />;
}

export default App;
