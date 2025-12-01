import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';
import { api } from '../../../core/http/axios-instance';

interface Appointment {
  id: number;
  patientName: string;
  reason: string;
  date: string;
  status: 'pendiente' | 'confirmada' | 'reprogramada' | 'rechazada';
  image: string;
}

interface Tab {
  id: string;
  label: string;
}

interface ReservaFromApi {
  id: number;
  nombrePaciente: string;
  pacienteDni: number;
  nombreMedico: string;
  medicoDni: number | null;
  nombreSede: string;
  fechaCreacion: string;
  fechaCita: string;
  horaCita: string;
  estadoCita: boolean;
}

@Component({
  selector: 'app-medicocitas',
  standalone: true,
  imports: [CommonModule, Sidebarmedicos],
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss'],
})
export class Medicoscitas implements OnInit {
  activeTab: string = 'todas';

  tabs: Tab[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'confirmada', label: 'Confirmadas' },
    { id: 'reprogramada', label: 'Reprogramadas' },
    { id: 'rechazada', label: 'Rechazadas' },
  ];

  appointments: Appointment[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadAppointments();
  }

  // === Carga de citas desde el backend ===
  private async loadAppointments(): Promise<void> {
    try {
      const response = await api.get<ReservaFromApi[]>('/api/reservas/lista');

      this.appointments = response.data.map((r) => ({
        id: r.id,
        patientName: r.nombrePaciente,
        // si luego tienes "motivo" en el backend, lo mapeas aquí
        reason: '',
        date: this.formatDateTime(r.fechaCita, r.horaCita),
        status: r.estadoCita ? 'confirmada' : 'pendiente',
        image: 'https://i.pravatar.cc/150?u=' + r.pacienteDni, // avatar en base al DNI
      }));
    } catch (error) {
      console.error('Error cargando citas médicas', error);
      this.appointments = [];
    }
  }

  private formatDateTime(fecha: string, hora: string): string {
    try {
      const dt = new Date(`${fecha}T${hora}`);
      return dt.toLocaleString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return `${fecha}, ${hora.substring(0, 5)}`;
    }
  }

  // === Getters para tabs y "citas que se acercan" ===
  get filteredAppointments(): Appointment[] {
    if (this.activeTab === 'todas') {
      return this.appointments;
    }
    return this.appointments.filter((apt) => apt.status === this.activeTab);
  }

  get upcomingAppointments(): Appointment[] {
    // por ahora, tomamos las confirmadas como "que se acercan"
    return this.appointments.filter((apt) => apt.status === 'confirmada').slice(0, 3);
  }

  // === UI ===
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

  // === Acciones (de momento solo cambian el estado en memoria) ===
  acceptAppointment(id: number): void {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = 'confirmada';
    }
  }

  rejectAppointment(id: number): void {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = 'rechazada';
    }
  }

  rescheduleAppointment(id: number): void {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = 'reprogramada';
      alert(`Reprogramar cita para ${apt.patientName}`);
    }
  }
}
