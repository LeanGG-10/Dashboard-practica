import { supabase } from "../supabaseClient";


export const authService = {
  login: (email, password) => 
    supabase.auth.signInWithPassword({ email, password }),

  register: (email, password) => 
    supabase.auth.signUp({ email, password }),

  resetPassword: (email) => 
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    }),

  loginWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Redirige al usuario de vuelta a tu dashboard tras el login
        redirectTo: window.location.origin, 
      },
    });
  },

  logout: () => supabase.auth.signOut(),

  onAuthStateChange: (callback) => 
    supabase.auth.onAuthStateChange(callback),

  getSession: () => supabase.auth.getSession(),
};