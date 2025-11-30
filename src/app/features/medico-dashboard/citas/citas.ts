import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';

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

@Component({
  selector: 'app-medicocitas',
  standalone: true,
  imports: [CommonModule, Sidebarmedicos],
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss'],
})
export class Medicoscitas {
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
      patientName: 'Juan Pérez',
      reason: 'Dolor de pecho',
      date: '15 de Julio, 10:00 AM',
      status: 'pendiente',
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      patientName: 'María Rodríguez',
      reason: 'Control dermatológico',
      date: '20 de Julio, 11:30 AM',
      status: 'confirmada',
      image: 'https://i.pravatar.cc/150?img=45'
    },
    {
      id: 3,
      patientName: 'Carlos López',
      reason: 'Fiebre alta',
      date: '25 de Julio, 9:00 AM',
      status: 'reprogramada',
      image: 'https://i.pravatar.cc/150?img=33'
    },
    {
      id: 4,
      patientName: 'Elena Ramírez',
      reason: 'Migraña crónica',
      date: '30 de Julio, 2:00 PM',
      status: 'rechazada',
      image: 'https://i.pravatar.cc/150?img=47'
    },
    {
      id: 5,
      patientName: 'Ana García',
      reason: 'Chequeo general',
      date: '01 de Agosto, 08:00 AM',
      status: 'pendiente',
      image: 'https://i.pravatar.cc/150?img=5'
    }
  ];

  get filteredAppointments(): Appointment[] {
    if (this.activeTab === 'todas') {
      return this.appointments;
    }
    return this.appointments.filter(apt => apt.status === this.activeTab);
  }

  get upcomingAppointments(): Appointment[] {
    // Logic to simulate upcoming appointments (e.g., confirmed ones)
    return this.appointments.filter(apt => apt.status === 'confirmada').slice(0, 2);
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

  acceptAppointment(id: number): void {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = 'confirmada';
      // Here you would typically call a service to update the backend
    }
  }

  rejectAppointment(id: number): void {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = 'rechazada';
    }
  }

  rescheduleAppointment(id: number): void {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = 'reprogramada';
      // Logic to open a modal or date picker would go here
      alert(`Reprogramar cita para ${apt.patientName}`);
    }
  }
}
