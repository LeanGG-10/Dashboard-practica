export const validateAuthForm = (email, password, mode) => {
  if (!email.includes("@")) return "Email inválido";
  if (mode !== "reset" && password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  return null;
};