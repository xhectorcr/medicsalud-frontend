import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';

interface DashboardStats {
  medicos: {
    total: number;
    activos: number;
    inactivos: number;
  };
  pacientes: {
    total: number;
    activos: number;
    nuevosEsteMes: number;
  };
  citas: {
    hoy: number;
    pendientes: number;
    completadas: number;
    canceladas: number;
  };
}

interface RecentActivity {
  id: number;
  tipo: 'cita' | 'paciente' | 'medico';
  descripcion: string;
  fecha: string;
  hora: string;
}

interface UpcomingAppointment {
  id: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'confirmada' | 'pendiente' | 'en-proceso';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './gestiongeneral.html',
  styleUrls: ['./gestiongeneral.scss']
})
export class Admingestiongeneral implements OnInit {

  stats: DashboardStats = {
    medicos: { total: 45, activos: 42, inactivos: 3 },
    pacientes: { total: 1248, activos: 1180, nuevosEsteMes: 87 },
    citas: { hoy: 24, pendientes: 156, completadas: 3420, canceladas: 89 }
  };

  recentActivities: RecentActivity[] = [
    { id: 1, tipo: 'paciente', descripcion: 'Nuevo paciente registrado: María González', fecha: '2024-11-17', hora: '10:30' },
    { id: 2, tipo: 'cita', descripcion: 'Cita completada con Dr. Ramírez', fecha: '2024-11-17', hora: '09:15' },
    { id: 3, tipo: 'medico', descripcion: 'Dr. Carlos Pérez actualizó su perfil', fecha: '2024-11-17', hora: '08:45' },
    { id: 4, tipo: 'cita', descripcion: 'Nueva cita agendada para mañana', fecha: '2024-11-16', hora: '18:20' },
    { id: 5, tipo: 'paciente', descripcion: 'Paciente Juan Martínez dio de baja', fecha: '2024-11-16', hora: '16:00' }
  ];

  upcomingAppointments: UpcomingAppointment[] = [
    { id: 1, paciente: 'Ana García', medico: 'Dr. Martínez', especialidad: 'Cardiología', fecha: '2024-11-17', hora: '14:00', estado: 'confirmada' },
    { id: 2, paciente: 'Pedro López', medico: 'Dra. Fernández', especialidad: 'Pediatría', fecha: '2024-11-17', hora: '15:30', estado: 'pendiente' },
    { id: 3, paciente: 'Laura Sánchez', medico: 'Dr. Ramírez', especialidad: 'Dermatología', fecha: '2024-11-17', hora: '16:00', estado: 'confirmada' },
    { id: 4, paciente: 'Carlos Ruiz', medico: 'Dr. Torres', especialidad: 'Traumatología', fecha: '2024-11-18', hora: '09:00', estado: 'confirmada' }
  ];

  currentDate: Date = new Date();

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('Dashboard data loaded');
  }

  get medicosActivosPercentage(): number {
    return Math.round((this.stats.medicos.activos / this.stats.medicos.total) * 100);
  }

  get pacientesActivosPercentage(): number {
    return Math.round((this.stats.pacientes.activos / this.stats.pacientes.total) * 100);
  }

  get citasCompletadasPercentage(): number {
    const total = this.stats.citas.completadas + this.stats.citas.canceladas;
    return Math.round((this.stats.citas.completadas / total) * 100);
  }

  getActivityIcon(tipo: 'cita' | 'paciente' | 'medico'): string {
    const icons = {
      cita: '📅',
      paciente: '👤',
      medico: '⚕️'
    };
    return icons[tipo];
  }

  getStatusClass(estado: string): string {
    return estado.toLowerCase().replace(' ', '-');
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    console.log('Dashboard refreshed');
  }
}
