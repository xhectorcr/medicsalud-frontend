// src/app/features/admin-dashboard/paciente/admin-pacientes.service.ts
import { Injectable } from '@angular/core';
import { api } from './../../../core/http/axios-instance';

export interface Patient {
  id: number;
  nombreUsuario: string;
  dni: number;
  email: string;
  telefono: string;
  rol: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminPacientesService {
  private readonly BASE_URL = '/api/pacientes/todos';

  async getPatients(): Promise<Patient[]> {
    const resp = await api.get<Patient[]>(this.BASE_URL);
    return resp.data ?? [];
  }
}
