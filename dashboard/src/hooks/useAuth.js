import { useState, useEffect } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        authService.getSession().then(({ data: { session } }) => setSession(session));
        
        const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
        setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    const executeAuthAction = async (action, successMsg) => {
        setLoading(true);
        setMessage(null);
        const { error } = await action();
        
        if (error) setMessage({ type: "error", text: error.message });
        else if (successMsg) setMessage({ type: "success", text: successMsg });
        
        setLoading(false);
    };

    const login = (email, password) => 
        executeAuthAction(() => authService.login(email, password), "¡Bienvenido de vuelta!");

    const register = (email, password) => 
        executeAuthAction(() => authService.register(email, password), "Cuenta creada. Revisa tu correo.");

    const resetPassword = (email) => 
        executeAuthAction(() => authService.resetPassword(email), "Enlace enviado al correo.");

    const loginWithGoogle = async () => {
        setLoading(true);
        setMessage(null);
        const { error } = await authService.loginWithGoogle();
        if (error) {
            setMessage({ type: "error", text: error.message });
            setLoading(false);
        }
        // Si no hay error, el navegador se redirige.
    };

    const logout = () => executeAuthAction(() => authService.logout());

    return { session, loading, message, login, register, resetPassword, loginWithGoogle, logout, setMessage };
};
