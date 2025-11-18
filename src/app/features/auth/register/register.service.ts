import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  dni: string;              
  email: string;
  clave: string;
  fechaNacimiento: string;  
  telefono: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  async register(payload: RegisterRequest): Promise<any> {
    const response = await api.post('/api/usuarios/crear-paciente', payload);
    return response.data;
  }
}
