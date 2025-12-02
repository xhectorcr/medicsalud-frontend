// src/app/core/http/axios-instance.ts
import axios, { AxiosRequestHeaders, AxiosError } from 'axios';

// Comprobación para determinar si el código se está ejecutando en el entorno del navegador (cliente).
// Esto es esencial para aplicaciones con SSR como Angular Universal.
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const api = axios.create({
  // Nota: Es mejor usar variables de entorno para el baseURL en un entorno de producción/Railway.
  baseURL: 'https://backend-web-production-e5ac.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Función que limpia el almacenamiento local (localStorage) y redirige al inicio de sesión.
 * Solo se ejecuta si estamos en el navegador.
 */
const clearAuthAndRedirect = () => {
  if (isBrowser) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    // Usar location.href para forzar la redirección del navegador.
    window.location.href = '/auth/login';
  }
};

// Interceptor de Peticiones (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    // La lógica de token/localStorage solo se ejecuta si estamos en el navegador.
    if (isBrowser) {
      // 1) Validar expiración antes de enviar la petición
      const exp = localStorage.getItem('tokenExpiration');
      if (exp && Date.now() > Number(exp)) {
        // token ya expiró en el cliente
        clearAuthAndRedirect();
        // Rechazar la promesa para cancelar la petición en Axios.
        return Promise.reject(new axios.Cancel('Token expirado en el cliente'));
      }

      // 2) Adjuntar el token si existe
      const token = localStorage.getItem('authToken');
      const type = localStorage.getItem('tokenType') || 'Bearer';

      if (token) {
        // Aseguramos que config.headers exista y tenga el tipo correcto para TypeScript
        const headers: AxiosRequestHeaders = (config.headers || {}) as AxiosRequestHeaders;
        headers.Authorization = `${type} ${token}`;
        config.headers = headers;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuestas (Response Interceptor)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      // Si el código es 401 (No autorizado), limpiamos la sesión y redirigimos.
      
      // Si estamos en el navegador, mostramos la alerta.
      if (isBrowser) {
        // si tu backend devuelve { error: "token_expired" }
        const data = error.response?.data as any;
        if (data?.error === 'token_expired') {
          // Usamos 'alert' con cautela, ya que bloquea el hilo principal. 
          // Es seguro usarlo aquí porque estamos dentro del bloque 'isBrowser'.
          alert('Tu sesión ha expirado. Vuelve a iniciar sesión.');
        }
      }
      
      // La redirección también se ejecuta solo si es en el navegador.
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);