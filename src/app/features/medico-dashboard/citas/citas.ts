import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';
import { api } from '../../../core/http/axios-instance';
import { MedicoHorariosService, HorarioBackend } from '../../paciente-dashboard/medico-horaios/medico-horarios.service';

interface Appointment {
  id: number;
  patientName: string;
  reason: string;
  date: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'REPROGRAMADA' | 'RECHAZADA';
  image: string;
  originalDate?: string; // Para reprogramación
  originalTime?: string; // Para reprogramación
  patientDni?: number;
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
  estadoCita: string;
}

@Component({
  selector: 'app-medicocitas',
  standalone: true,
  imports: [CommonModule, Sidebarmedicos, FormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss'],
})
export class Medicoscitas implements OnInit {
  activeTab: string = 'todas';

  tabs: Tab[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'PENDIENTE', label: 'Pendientes' },
    { id: 'CONFIRMADA', label: 'Confirmadas' },
    { id: 'REPROGRAMADA', label: 'Reprogramadas' },
    { id: 'RECHAZADA', label: 'Rechazadas' },
  ];

  appointments: Appointment[] = [];

  // Modal Reprogramación
  showRescheduleModal = false;
  selectedAppointment: Appointment | null = null;
  availableSlots: HorarioBackend[] = [];
  selectedDateForReschedule: string = '';
  loadingSlots = false;
  rescheduleLoading = false;

  // Modal Genérico (Variables mantenidas por compatibilidad, aunque usamos native alerts)
  showGenericModal = false;
  modalType: 'info' | 'confirm' = 'info';
  modalTitle = '';
  modalMessage = '';
  pendingAction: (() => void) | null = null;

  constructor(
    private horariosService: MedicoHorariosService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadAppointments();
    this.selectedDateForReschedule = new Date().toISOString().split('T')[0];
  }

  // === Carga de citas desde el backend ===
  private async loadAppointments(): Promise<void> {
    try {
      const response = await api.get<ReservaFromApi[]>('/api/reservas/lista');

      this.appointments = response.data.map((r) => ({
        id: r.id,
        patientName: r.nombrePaciente,
        reason: '',
        date: this.formatDateTime(r.fechaCita, r.horaCita),
        status: r.estadoCita as any,
        image: 'https://i.pravatar.cc/150?u=' + r.pacienteDni,
        originalDate: r.fechaCita,
        originalTime: r.horaCita,
        patientDni: r.pacienteDni
      }));
      this.cdr.detectChanges(); // Forzar detección de cambios tras la carga
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
    return this.appointments.filter((apt) => apt.status === 'CONFIRMADA').slice(0, 3);
  }

  // === UI ===
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDIENTE: 'Pendiente',
      CONFIRMADA: 'Confirmada',
      REPROGRAMADA: 'Reprogramada',
      RECHAZADA: 'Rechazada',
    };
    return labels[status] || status;
  }

  // === Acciones ===
  async acceptAppointment(id: number): Promise<void> {
    try {
      await api.put(`/api/reservas/confirmar/${id}`);
      await this.loadAppointments(); // Recarga forzada
      // alert('Cita confirmada correctamente');
    } catch (error) {
      console.error('Error al confirmar cita', error);
      alert('No se pudo confirmar la cita');
    }
  }

  rejectAppointment(id: number): void {
    if (confirm('¿Estás seguro de rechazar esta cita?')) {
      this.executeReject(id);
    }
  }

  private async executeReject(id: number) {
    try {
      await api.put(`/api/reservas/rechazar/${id}`);
      await this.loadAppointments(); // Recarga forzada
      // alert('Cita rechazada correctamente');
    } catch (error) {
      console.error('Error al rechazar cita', error);
      alert('No se pudo rechazar la cita');
    }
  }

  async markAsPending(id: number): Promise<void> {
    try {
      await api.put(`/api/reservas/pendiente/${id}`);
      await this.loadAppointments(); // Recarga forzada
      // alert('La cita ha vuelto a estado Pendiente');
    } catch (error) {
      console.error('Error al cambiar a pendiente', error);
      alert('No se pudo cambiar el estado a Pendiente');
    }
  }

  // === Reprogramación ===
  openRescheduleModal(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.showRescheduleModal = true;
    this.loadAvailableSlots();
  }

  closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.selectedAppointment = null;
    this.availableSlots = [];
  }

  async loadAvailableSlots(): Promise<void> {
    if (!this.selectedDateForReschedule) return;

    this.loadingSlots = true;
    try {
      const correoMedico = localStorage.getItem('correoMedico') || 'medico@example.com';
      const data = await this.horariosService.getHorariosPorCorreo(correoMedico);

      const selectedDayName = this.getDayName(this.selectedDateForReschedule).toUpperCase();

      this.availableSlots = data.filter(h =>
        h.dia.toUpperCase() === selectedDayName &&
        h.estado === 'DISPONIBLE'
      );

    } catch (error) {
      console.error('Error cargando horarios', error);
      this.availableSlots = [];
    } finally {
      this.loadingSlots = false;
    }
  }

  async confirmReschedule(slot: HorarioBackend): Promise<void> {
    if (!this.selectedAppointment) return;

    this.rescheduleLoading = true;
    try {
      const payload = {
        fechaCita: this.selectedDateForReschedule,
        horaCita: slot.horaInicio
      };

      await api.put(`/api/reservas/reprogramar/${this.selectedAppointment.id}`, payload);

      await this.loadAppointments(); // Recarga forzada

      this.closeRescheduleModal();
      alert('Cita reprogramada con éxito');
    } catch (error) {
      console.error('Error al reprogramar', error);
      alert('Error al reprogramar la cita');
    } finally {
      this.rescheduleLoading = false;
    }
  }

  onDateChange(): void {
    this.loadAvailableSlots();
  }

  // === Generic Modal Helpers (Legacy) ===
  showInfoModal(title: string, message: string): void {
    alert(`${title}: ${message}`);
  }

  showConfirmModal(title: string, message: string, action: () => void): void {
    if (confirm(message)) {
      action();
    }
  }

  closeGenericModal(): void {
    this.showGenericModal = false;
    this.pendingAction = null;
  }

  confirmGenericAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.closeGenericModal();
  }

  private updateLocalStatus(id: number, status: 'PENDIENTE' | 'CONFIRMADA' | 'REPROGRAMADA' | 'RECHAZADA'): void {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = status;
    }
  }

  private getDayName(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }
}
