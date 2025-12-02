import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface HorarioBackend {
  id: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  medicoDni: string | number;
}

@Injectable({ providedIn: 'root' })
export class MedicoHorariosService {
  async getHorariosPorCorreo(correo: string): Promise<HorarioBackend[]> {
    const resp = await api.get<HorarioBackend[]>('/api/horarios/medico', {
      params: { email: correo }
    });
    return resp.data;
  }
}
