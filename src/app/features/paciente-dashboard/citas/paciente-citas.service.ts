import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

// AJUSTA estos campos a tu ReservaResponseDTO real
interface ReservaResponseDTO {
  id: number;
  nombreMedico: string;
  especialidadMedico: string;
  fechaCita: string;
  horaCita: string;
  estadoCita: string;      // PENDIENTE / CONFIRMADA / etc.
  fotoMedicoUrl?: string;  // opcional
}

@Injectable({
  providedIn: 'root',
})
export class PacienteCitasService {
  // Pruébalo así primero. Luego cambias por tu environment si quieres.
  private readonly apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  getCitasPaciente(pacienteId: number): Observable<Appointment[]> {
    return this.http
      .get<ReservaResponseDTO[]>(`${this.apiUrl}/paciente/${pacienteId}`)
      .pipe(map((res) => res.map((r) => this.mapReserva(r))));
  }

  private mapReserva(r: ReservaResponseDTO): Appointment {
    return {
      id: r.id,
      doctor: r.nombreMedico,
      specialty: r.especialidadMedico,
      date: this.formatFechaHora(r.fechaCita, r.horaCita),
      status: this.mapEstado(r.estadoCita),
      image:
        r.fotoMedicoUrl ||
        `https://i.pravatar.cc/150?u=${encodeURIComponent(r.nombreMedico)}`,
    };
  }

  private mapEstado(value: string): AppointmentStatus {
    const v = value.toLowerCase();
    if (v.includes('pend')) return 'pendiente';
    if (v.includes('conf')) return 'confirmada';
    if (v.includes('repro')) return 'reprogramada';
    if (v.includes('rech')) return 'rechazada';
    return 'pendiente';
  }

  private formatFechaHora(fecha: string, hora: string): string {
    return `${fecha} ${hora}`;
  }
}
