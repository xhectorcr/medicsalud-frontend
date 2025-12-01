// src/app/features/admin-dashboard/gestiongeneral/gestiongeneral.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';
import {
  AdminDashboardService,
  AdminDashboardResponse,
  DashboardStats,
  RecentActivity,
  UpcomingAppointment,
} from './services/admin-dashboard.service';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './gestiongeneral.html',
  styleUrls: ['./gestiongeneral.scss'],
})
export class Admingestiongeneral implements OnInit {
  // SIEMPRE inicializado → el HTML puede usar stats.medicos.total sin romperse
  stats: DashboardStats = {
    medicos: {
      total: 0,
      activos: 0,
      inactivos: 0,
    },
    pacientes: {
      total: 0,
      activos: 0,
      nuevosEsteMes: 0,
    },
    citas: {
      hoy: 0,
      pendientes: 0,
      completadas: 0,
      canceladas: 0,
    },
  };

  // listas que usa el template
  recentActivities: RecentActivity[] = [];
  upcomingAppointments: UpcomingAppointment[] = [];

  currentDate: Date = new Date();

  cargando = false;
  errorMessage = '';

  constructor(
    private dashboardService: AdminDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    this.cargando = true;
    this.errorMessage = '';

    try {
      const data: AdminDashboardResponse =
        await this.dashboardService.getDashboard();

      this.stats = data.stats;
      this.recentActivities = data.actividadReciente || [];
      this.upcomingAppointments = data.proximasCitas || [];
    } catch (err) {
      const error = err as AxiosError<any>;
      console.error('Error cargando dashboard', error);

      const status = error.response?.status;
      const msg = (error.response?.data as any)?.message ?? '';

      // si el token está mal / vencido → limpiar y mandar al login
      if (
        status === 401 ||
        status === 403 ||
        (status === 500 && msg.toString().includes('JWT'))
      ) {
        this.logoutAndRedirect();
        return;
      }

      this.errorMessage = 'No se pudo cargar el panel.';
    } finally {
      this.cargando = false;
    }
  }

  private logoutAndRedirect(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    this.router.navigate(['/auth/login']);
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  // ==== getters que usa el HTML ====

  get medicosActivosPercentage(): number {
    if (this.stats.medicos.total === 0) return 0;
    return Math.round(
      (this.stats.medicos.activos / this.stats.medicos.total) * 100
    );
  }

  get pacientesActivosPercentage(): number {
    if (this.stats.pacientes.total === 0) return 0;
    return Math.round(
      (this.stats.pacientes.activos / this.stats.pacientes.total) * 100
    );
  }

  get citasCompletadasPercentage(): number {
    const total =
      this.stats.citas.completadas + this.stats.citas.canceladas || 1;
    return Math.round((this.stats.citas.completadas / total) * 100);
  }

  getActivityIcon(tipo: 'cita' | 'paciente' | 'medico'): string {
    const icons = { cita: '📅', paciente: '👤', medico: '⚕️' };
    return icons[tipo];
  }

  getStatusClass(estado: string): string {
    // confirmada → confirmada, en-proceso → en-proceso
    return estado.toLowerCase().replace(' ', '-');
  }
}
