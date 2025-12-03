// src/app/core/http/axios-instance.ts
import axios, { AxiosRequestHeaders, AxiosError } from 'axios';

// Comprobación para determinar si el código se está ejecutando en el entorno del navegador (cliente).
// Esto es esencial para aplicaciones con SSR como Angular Universal.
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const api = axios.create({
  // Nota: Es mejor usar variables de entorno para el baseURL en un entorno de producción/Railway.
  baseURL: 'https://resourceful-cooperation-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});


const clearAuthAndRedirect = () => {
  if (isBrowser) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

  
    window.location.href = '/auth/login';
  }
};


api.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const exp = localStorage.getItem('tokenExpiration');
      if (exp && Date.now() > Number(exp)) {
        clearAuthAndRedirect();
        return Promise.reject(new axios.Cancel('Token expirado en el cliente'));
      }

      const token = localStorage.getItem('authToken');
      const type = localStorage.getItem('tokenType') || 'Bearer';

      if (token) {
        const headers: AxiosRequestHeaders = (config.headers || {}) as AxiosRequestHeaders;
        headers.Authorization = `${type} ${token}`;
        config.headers = headers;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {

      if (isBrowser) {
        const data = error.response?.data as any;
        if (data?.error === 'token_expired') {
          alert('Tu sesión ha expirado. Vuelve a iniciar sesión.');
        }
      }

      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);