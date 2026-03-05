import { Navigate, Route, Routes } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../views/Login";
import DashboardPage from "../views/Dashboard";
import Principal from "../views/Principal";

function IndexRedirect() {
  const { session, initializing } = useSession();

  if (initializing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-mono">
        Cargando...
      </div>
    );
  }

  return <Navigate to={session ? "/dashboard" : "/home"} replace />;
}

export default function AppRouter() {
  return (
    
      <Routes>
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Principal/>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>

    
  );
}

