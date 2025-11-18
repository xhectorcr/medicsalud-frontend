// src/app/core/http/axios-instance.ts
import axios, { AxiosRequestHeaders } from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const type = localStorage.getItem('tokenType') || 'Bearer';

    if (token) {
      // asegurar que headers tenga el tipo correcto
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
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('username');
      localStorage.removeItem('roles');
      localStorage.removeItem('userRole');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
