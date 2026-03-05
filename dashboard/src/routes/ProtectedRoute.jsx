import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function ProtectedRoute() {
  const { session, initializing } = useSession();

  if (initializing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-mono">
        Cargando...
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

