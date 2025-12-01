import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';
import { CitasService, ReservaResponseDTO } from './citas.service';

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

  constructor(
    private citasService: CitasService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const pacienteId = 1; // luego lo sacas del token/usuario logueado
    this.cargarCitas(pacienteId);
  }

  private cargarCitas(pacienteId: number): void {
    this.citasService.getCitasPaciente(pacienteId).subscribe({
      next: (reservas) => {
        this.appointments = reservas.map((r) => this.mapReserva(r));
        this.cd.detectChanges(); // Force update
      },
      error: (err) => {
        console.error('Error cargando citas', err);
        this.appointments = []; // para que el *ngIf funcione sin romper
        this.cd.detectChanges(); // Force update
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
