// reserva.service.ts
import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface CrearReservaPayload {
  medicoDni: number;
  sedeId: number;
  fechaCita: string; 
  horaCita: string;  
}

export interface ReservaResponse {
  id: number;
  nombrePaciente: string;
  pacienteDni: number;
  nombreMedico: string;
  medicoDni: number;
  nombreSede: string;
  fechaCreacion: string;
  fechaCita: string;
  horaCita: string;
  estadoCita: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  async crearReserva(payload: CrearReservaPayload): Promise<ReservaResponse> {
    // IMPORTANTE: mismo body que usas en Postman
    const resp = await api.post<ReservaResponse>('/api/reservas/paciente', {
      medicoDni: payload.medicoDni,
      sedeId: payload.sedeId,
      fechaCita: payload.fechaCita,
      horaCita: payload.horaCita
    });

    return resp.data;
  }
}
