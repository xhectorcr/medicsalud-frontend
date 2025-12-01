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
  private medicosCache: MedicoBackend[] = [];

  async getMedicosActivos(forceRefresh: boolean = false): Promise<MedicoBackend[]> {
    if (this.medicosCache.length > 0 && !forceRefresh) {
      return this.medicosCache;
    }

    try {
      const resp = await api.get<MedicoBackend[]>('/api/medicos/activos');
      this.medicosCache = resp.data;
      return this.medicosCache;
    } catch (error) {
      throw error;
    }
  }
}
