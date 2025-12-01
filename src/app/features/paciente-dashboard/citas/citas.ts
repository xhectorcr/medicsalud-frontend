import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  status: 'pendiente' | 'confirmada' | 'reprogramada' | 'rechazada';
  image: string;
}

interface Tab {
  id: string;
  label: string;
}

interface ReservaResponseDTO {
  id: number;
  nombreMedico: string;
  especialidadMedico: string;
  fechaCita: string;  
  horaCita: string;    
  estadoCita: string;   
  fotoMedicoUrl?: string | null;
}

@Component({
  selector: 'app-pacientecitas',
  standalone: true,
  imports: [CommonModule, Sidebarpaciente],
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss'],
})
export class Pacientecitas implements OnInit {
  activeTab: string = 'todas';

  tabs: Tab[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'confirmada', label: 'Confirmadas' },
    { id: 'reprogramada', label: 'Reprogramadas' },
    { id: 'rechazada', label: 'Rechazadas' },
  ];

  appointments: Appointment[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const pacienteId = 1; // luego lo sacas del token/usuario logueado
    this.cargarCitas(pacienteId);
  }

  private cargarCitas(pacienteId: number): void {
    // CAMBIA ESTA URL a la de tu backend real
    const url = `http://localhost:8080/api/reservas/paciente/${pacienteId}`;

    this.http.get<ReservaResponseDTO[]>(url).subscribe({
      next: (reservas) => {
        this.appointments = reservas.map((r) => this.mapReserva(r));
      },
      error: (err) => {
        console.error('Error cargando citas', err);
        this.appointments = []; // para que el *ngIf funcione sin romper
      },
    });
  }

  private mapReserva(r: ReservaResponseDTO): Appointment {
    return {
      id: r.id,
      doctor: r.nombreMedico,
      specialty: r.especialidadMedico,
      date: `${r.fechaCita} ${r.horaCita}`,
      status: this.mapEstado(r.estadoCita),
      image:
        r.fotoMedicoUrl ||
        `https://i.pravatar.cc/150?u=${encodeURIComponent(r.nombreMedico)}`,
    };
  }

  private mapEstado(estado: string): Appointment['status'] {
    const v = estado.toLowerCase();
    if (v.includes('pend')) return 'pendiente';
    if (v.includes('conf')) return 'confirmada';
    if (v.includes('repro')) return 'reprogramada';
    if (v.includes('rech')) return 'rechazada';
    return 'pendiente';
  }

  get filteredAppointments(): Appointment[] {
    if (this.activeTab === 'todas') {
      return this.appointments;
    }
    return this.appointments.filter((apt) => apt.status === this.activeTab);
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      reprogramada: 'Reprogramada',
      rechazada: 'Rechazada',
    };
    return labels[status] || status;
  }
}
