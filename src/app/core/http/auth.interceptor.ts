// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

function clearSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenType');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('username');
  localStorage.removeItem('roles');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('authToken');
  const expStr = localStorage.getItem('tokenExpiration');
  const exp = expStr ? Number(expStr) : 0;
  const now = Date.now();

  // 1) Token expirado en el CLIENTE → cerrar sesión y redirigir
  if (token && exp && now > exp) {
    clearSession();
    router.navigate(['/auth/login']); // ajusta la ruta si es distinta
    return throwError(() => new Error('Token expirado en el cliente'));
  }

  // 2) Adjuntar Authorization si hay token válido
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 3) Manejar errores 401/403 del BACKEND
  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 || err.status === 403) {
        clearSession();
        router.navigate(['/auth/login']); // misma ruta que arriba
      }
      return throwError(() => err);
    })
  );
};
