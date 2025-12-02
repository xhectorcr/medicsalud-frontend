// src/app/features/paciente/citas/citas.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';
import {
  Appointment,
  AppointmentStatus,
  PacienteCitasService,
} from './paciente-citas.service';

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
    private citasService: PacienteCitasService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarCitas();
  }

  private cargarCitas(): void {
    this.citasService.getCitasPaciente().subscribe({
      next: (citas) => {
        this.appointments = citas;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando citas', err);
        this.appointments = [];
        this.cd.detectChanges();
      },
    });
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

  getStatusLabel(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      reprogramada: 'Reprogramada',
      rechazada: 'Rechazada',
    };
    return labels[status];
  }
}
