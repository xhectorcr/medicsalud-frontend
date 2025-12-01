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
  private patientsCache: Patient[] = [];

  async getPatients(forceRefresh: boolean = false): Promise<Patient[]> {
    if (this.patientsCache.length > 0 && !forceRefresh) {
      return this.patientsCache;
    }

    const resp = await api.get<Patient[]>(this.BASE_URL);
    this.patientsCache = resp.data ?? [];
    return this.patientsCache;
  }
}
