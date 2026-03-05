import { supabase } from "./client";

export const authApi = {
  signInWithPassword(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  signUp(email, password) {
    return supabase.auth.signUp({ email, password });
  },

  resetPasswordForEmail(email, redirectTo) {
    return supabase.auth.resetPasswordForEmail(email, { redirectTo });
  },

  signInWithGoogle(redirectTo) {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  },

  signOut() {
    return supabase.auth.signOut();
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  getSession() {
    return supabase.auth.getSession();
  },
};

