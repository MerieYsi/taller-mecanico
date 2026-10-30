const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+([ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

export const validarNombre = (t: string) =>
  t.trim().length >= 2 && soloLetras.test(t.trim());
export const validarEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const validarPassword = (pw: string) =>
  pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
export const validarDni = (dni: string) => /^\d{7,8}$/.test(dni);
export const validarTelefono = (t: string) => /^\d{8,15}$/.test(t);
export const validarPatente = (p: string) => p.trim().length >= 6;