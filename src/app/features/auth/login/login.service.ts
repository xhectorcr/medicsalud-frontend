import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  fechaExpiracion: string;
  username: string;
  roles: string[];   
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', payload);
    return response.data as LoginResponse;
  }
}
