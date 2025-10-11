import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-pacientecitas',
  standalone: true,
  imports: [CommonModule, Sidebarpaciente],
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss'],
})
export class Pacientecitas {
  activeTab: string = 'todas';

  tabs: Tab[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'confirmada', label: 'Confirmadas' },
    { id: 'reprogramada', label: 'Reprogramadas' },
    { id: 'rechazada', label: 'Rechazadas' }
  ];

  appointments: Appointment[] = [
    {
      id: 1,
      doctor: 'Dr. Ricardo García',
      specialty: 'Cardiólogo',
      date: '15 de Julio, 10:00 AM',
      status: 'pendiente',
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      doctor: 'Dra. Sofía Martínez',
      specialty: 'Dermatóloga',
      date: '20 de Julio, 11:30 AM',
      status: 'confirmada',
      image: 'https://i.pravatar.cc/150?img=45'
    },
    {
      id: 3,
      doctor: 'Dr. Carlos López',
      specialty: 'Pediatra',
      date: '25 de Julio, 9:00 AM',
      status: 'reprogramada',
      image: 'https://i.pravatar.cc/150?img=33'
    },
    {
      id: 4,
      doctor: 'Dra. Elena Ramírez',
      specialty: 'Neuróloga',
      date: '30 de Julio, 2:00 PM',
      status: 'rechazada',
      image: 'https://i.pravatar.cc/150?img=47'
    }
  ];

  get filteredAppointments(): Appointment[] {
    if (this.activeTab === 'todas') {
      return this.appointments;
    }
    return this.appointments.filter(apt => apt.status === this.activeTab);
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      reprogramada: 'Reprogramada',
      rechazada: 'Rechazada'
    };
    return labels[status] || status;
  }
}
