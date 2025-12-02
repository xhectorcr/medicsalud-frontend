// src/app/core/http/axios-instance.ts
import axios, { AxiosRequestHeaders, AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'http://backend-web-production-e5ac.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearAuthAndRedirect = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenType');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('username');
  localStorage.removeItem('roles');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');

  window.location.href = '/auth/login';
};

api.interceptors.request.use(
  (config) => {
    // 1) Validar expiración antes de enviar la petición
    const exp = localStorage.getItem('tokenExpiration');
    if (exp && Date.now() > Number(exp)) {
      // token ya expiró en el cliente
      clearAuthAndRedirect();
      return Promise.reject(new axios.Cancel('Token expirado en el cliente'));
    }

    // 2) Adjuntar el token si existe
    const token = localStorage.getItem('authToken');
    const type = localStorage.getItem('tokenType') || 'Bearer';

    if (token) {
      const headers: AxiosRequestHeaders = (config.headers ||
        {}) as AxiosRequestHeaders;
      headers.Authorization = `${type} ${token}`;
      config.headers = headers;
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
      // si tu backend devuelve { error: "token_expired" }
      const data = error.response?.data as any;
      if (data?.error === 'token_expired') {
        alert('Tu sesión ha expirado. Vuelve a iniciar sesión.');
      }
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);
