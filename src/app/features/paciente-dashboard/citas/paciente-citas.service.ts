// src/app/features/paciente/citas/paciente-citas.service.ts
import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { api } from '../../../core/http/axios-instance';


// Estados posibles en la UI
export type AppointmentStatus =
  | 'pendiente'
  | 'confirmada'
  | 'reprogramada'
  | 'rechazada';

export interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  status: AppointmentStatus;
  image: string;
}

// Ajustado al JSON que muestras en Postman
interface ReservaResponseDTO {
  id: number;
  nombrePaciente: string;
  pacienteDni: string;
  nombreMedico: string;
  medicoDni: string;
  nombreSede: string;
  fechaCreacion: string;
  fechaCita: string;
  horaCita: string;
  estadoCita: string; // "PENDIENTE", "CONFIRMADA", etc.
}

@Injectable({
  providedIn: 'root',
})
export class PacienteCitasService {
  private readonly basePath = '/api/reservas';

  getCitasPaciente(): Observable<Appointment[]> {
    // axios-instance ya pone baseURL + token
    return from(
      api.get<ReservaResponseDTO[]>(`${this.basePath}/mis-reservas`)
    ).pipe(map((res) => res.data.map((r) => this.mapReserva(r))));
  }

  private mapReserva(r: ReservaResponseDTO): Appointment {
    return {
      id: r.id,
      doctor: r.nombreMedico,
      specialty: r.nombreSede, // o especialidad real si luego la agregas
      date: `${r.fechaCita} ${r.horaCita}`,
      status: this.mapEstado(r.estadoCita),
      image: `https://i.pravatar.cc/150?u=${encodeURIComponent(
        r.nombreMedico
      )}`,
    };
  }

  private mapEstado(estado: string): AppointmentStatus {
    switch (estado) {
      case 'PENDIENTE':
        return 'pendiente';
      case 'CONFIRMADA':
        return 'confirmada';
      case 'REPROGRAMADA':
        return 'reprogramada';
      case 'RECHAZADA':
        return 'rechazada';
      default:
        return 'pendiente'; // Default fallback
    }
  }
}
