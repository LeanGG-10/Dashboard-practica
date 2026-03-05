import { authApi } from "../apis/supabase/authApi";

export const authService = {
  login(email, password) {
    return authApi.signInWithPassword(email, password);
  },

  register(email, password) {
    return authApi.signUp(email, password);
  },

  resetPassword(email) {
    return authApi.resetPasswordForEmail(
      email,
      `${window.location.origin}/update-password`,
    );
  },

  loginWithGoogle() {
    return authApi.signInWithGoogle(window.location.origin);
  },

  logout() {
    return authApi.signOut();
  },

  onAuthStateChange(callback) {
    return authApi.onAuthStateChange(callback);
  },

  getSession() {
    return authApi.getSession();
  },
};