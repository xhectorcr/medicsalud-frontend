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
    // Log del payload para debugging
    console.log('📤 Enviando reserva con payload:', payload);

    // IMPORTANTE: mismo body que usas en Postman
    const body = {
      medicoDni: payload.medicoDni,
      sedeId: payload.sedeId,
      fechaCita: payload.fechaCita,
      horaCita: payload.horaCita
    };

    console.log('📤 Body formateado:', body);

    try {
      const resp = await api.post<ReservaResponse>('/api/reservas/paciente', body);
      console.log('✅ Reserva creada exitosamente:', resp.data);
      return resp.data;
    } catch (error: any) {
      console.error('❌ Error al crear reserva:', error);
      console.error('Response data:', error?.response?.data);
      console.error('Response status:', error?.response?.status);
      throw error;
    }
  }
}
