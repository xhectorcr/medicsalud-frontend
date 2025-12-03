// src/app/features/admin-dashboard/services/admin-dashboard.service.ts
import { Injectable } from '@angular/core';
import { api } from '../../../../core/http/axios-instance';


export interface DashboardStats {
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

export interface RecentActivity {
  id: number;
  tipo: 'cita' | 'paciente' | 'medico';
  descripcion: string;
  fecha: string;
  hora: string;
}

export interface UpcomingAppointment {
  id: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'confirmada' | 'pendiente' | 'en-proceso' | 'reprogramada' | 'rechazada';
}

export interface AdminDashboardResponse {
  stats: DashboardStats;
  actividadReciente: RecentActivity[];
  proximasCitas: UpcomingAppointment[];
}

// tipos simplificados según tu JSON
interface MedicoActivo {
  id: number;
  nombre: string;
  // ...
}

interface PacienteActivo {
  id: number;
  // ...
}

interface Reserva {
  id: number;
  nombrePaciente: string;
  pacienteDni: number;
  nombreMedico: string;
  medicoDni: number | null;
  nombreSede: string;
  fechaCreacion: string; // "2025-11-09T22:07:04.410717"
  fechaCita: string;     // "2025-11-15"
  horaCita: string;      // "10:30:00"
  estadoCita: string;   // "PENDIENTE", "CONFIRMADA", etc.
}

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private readonly MEDICOS_ACTIVOS_URL = '/api/medicos/activos';
  private readonly PACIENTES_ACTIVOS_URL = '/api/pacientes/todos';
  private readonly RESERVAS_URL = '/api/reservas/lista';

  private dashboardCache: AdminDashboardResponse | null = null;

  async getDashboard(forceRefresh: boolean = false): Promise<AdminDashboardResponse> {
    if (this.dashboardCache && !forceRefresh) {
      return this.dashboardCache;
    }

    // Inicializamos arrays vacíos por defecto
    let medicosActivos: MedicoActivo[] = [];
    let pacientesActivos: PacienteActivo[] = [];
    let reservas: Reserva[] = [];

    try {
      // Usamos Promise.allSettled para que si falla uno, no fallen los demás
      const results = await Promise.allSettled([
        api.get<MedicoActivo[]>(this.MEDICOS_ACTIVOS_URL),
        api.get<PacienteActivo[]>(this.PACIENTES_ACTIVOS_URL),
        api.get<Reserva[]>(this.RESERVAS_URL),
      ]);

      // 0: Medicos
      if (results[0].status === 'fulfilled') {
        medicosActivos = results[0].value.data || [];
      } else {
        console.error('Error cargando médicos:', results[0].reason);
      }

      // 1: Pacientes
      if (results[1].status === 'fulfilled') {
        pacientesActivos = results[1].value.data || [];
      } else {
        console.error('Error cargando pacientes:', results[1].reason);
      }

      // 2: Reservas
      if (results[2].status === 'fulfilled') {
        reservas = results[2].value.data || [];
      } else {
        console.error('Error cargando reservas:', results[2].reason);
        // Si falla reservas, seguimos con array vacío
      }
    } catch (error) {
      console.error('Error inesperado en getDashboard:', error);
      // En caso de error catastrófico en Promise.allSettled (raro), devolvemos estructura vacía o re-lanzamos
    }

    // --- Citas (reservas) ---
    const hoyStr = this.getTodayString();
    const reservasHoy = reservas.filter(r => r.fechaCita === hoyStr);

    const completadas = reservas.filter(r => r.estadoCita === 'CONFIRMADA').length;
    const pendientes = reservas.filter(r => r.estadoCita === 'PENDIENTE').length;

    const stats: DashboardStats = {
      medicos: {
        total: medicosActivos.length,
        activos: medicosActivos.length,
        inactivos: 0,
      },
      pacientes: {
        total: pacientesActivos.length,
        activos: pacientesActivos.length,
        nuevosEsteMes: 0,
      },
      citas: {
        hoy: reservasHoy.length,
        pendientes,
        completadas,
        canceladas: reservas.filter(r => r.estadoCita === 'RECHAZADA').length,
      },
    };


    const proximasCitas: UpcomingAppointment[] = reservas
      .filter(r => r.fechaCita >= hoyStr)
      .sort((a, b) => (a.fechaCita + a.horaCita).localeCompare(b.fechaCita + b.horaCita))
      .slice(0, 4)
      .map(r => ({
        id: r.id,
        paciente: r.nombrePaciente,
        medico: r.nombreMedico,
        especialidad: r.nombreSede, // de momento usamos la sede como texto extra
        fecha: r.fechaCita,
        hora: r.horaCita.slice(0, 5), // "10:30"
        estado: (r.estadoCita === 'CONFIRMADA' ? 'confirmada' :
          r.estadoCita === 'PENDIENTE' ? 'pendiente' :
            r.estadoCita === 'REPROGRAMADA' ? 'reprogramada' :
              r.estadoCita === 'RECHAZADA' ? 'rechazada' : 'pendiente') as any,
      }));

    // Actividad reciente se puede montar más adelante
    const actividadReciente: RecentActivity[] = [];

    this.dashboardCache = {
      stats,
      actividadReciente,
      proximasCitas,
    };

    return this.dashboardCache;
  }

  private getTodayString(): string {
    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const d = today.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`; // "YYYY-MM-DD"
  }
}
