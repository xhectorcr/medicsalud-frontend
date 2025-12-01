import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface MedicoBackend {
  id: number;
  nombre: string;
  especialidad: string;
  dni: number;
  correo: string; 
  sede: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MedicosService {
  async getMedicosActivos(): Promise<MedicoBackend[]> {
    const resp = await api.get<MedicoBackend[]>('/api/medicos/activos');
    return resp.data;
  }
}
