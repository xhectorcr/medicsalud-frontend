import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoHorariosService, HorarioBackend } from './medico-horarios.service';
import { ReservaService, ReservaResponse } from './reserva.service';

type SlotStatus = 'available' | 'booked';

interface Slot {
  id: number;
  time: string;
  horaInicio: string;
  horaFin: string;
  status: SlotStatus;
}

@Component({
  standalone: true,
  selector: 'app-paciente-medico-availability',
  templateUrl: './paciente-medico-availability.component.html',
  styleUrls: ['./paciente-medico-availability.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class PacienteMedicoAvailabilityComponent implements OnInit {

  selectedDate = '';
  activeFilter: 'all' | SlotStatus = 'all';

  loading = false;
  errorMessage = '';

  correoMedico = '';

  medicoDni!: number;
  pacienteDni!: number;
  sedeId: number = 1;

  doctor = {
    name: '',
    speciality: '',
    clinic: '',
    photoUrl: ''
  };

  slots: Slot[] = [];


  showSuccessModal = false;
  ultimaReserva: ReservaResponse | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private horariosService: MedicoHorariosService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().substring(0, 10);

    this.route.queryParams.subscribe(async (params) => {
      this.correoMedico      = params['correo'] ?? '';
      this.doctor.name       = params['nombre'] ?? '';
      this.doctor.speciality = params['especialidad'] ?? '';
      this.doctor.photoUrl   = params['foto'] ?? '';
      this.doctor.clinic     = params['clinica'] ?? '';

      this.medicoDni   = Number(params['medicoDni']);
      this.pacienteDni = Number(localStorage.getItem('dniPaciente'));
      this.sedeId      = Number(params['sedeId'] ?? 1);

      if (!this.correoMedico) {
        this.errorMessage = 'No se pudo identificar al médico.';
        return;
      }

      await this.cargarHorarios();
    });
  }

  async cargarHorarios(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const data: HorarioBackend[] =
        await this.horariosService.getHorariosPorCorreo(this.correoMedico);

      this.slots = data.map((h) => ({
        id: h.id,
        time: `${h.horaInicio} - ${h.horaFin}`,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        status: 'available'
      }));
    } catch (err: any) {
      console.error(err);
      this.errorMessage =
        err?.response?.data?.message || 'No se pudieron cargar los horarios del médico.';
    } finally {
      this.loading = false;
    }
  }

  get filteredSlots(): Slot[] {
    if (this.activeFilter === 'all') return this.slots;
    return this.slots.filter((s) => s.status === this.activeFilter);
  }

  setFilter(filter: 'all' | SlotStatus): void {
    this.activeFilter = filter;
  }

  getStatusLabel(status: SlotStatus): string {
    if (status === 'available') return 'Disponible';
    if (status === 'booked') return 'Ocupado';
    return status;
  }

  onBack(): void {
    this.router.navigate(['/paciente/medicos']);
  }

  
  async onReserve(slot: Slot): Promise<void> {
    if (slot.status !== 'available') return;

    if (!this.medicoDni) {
      alert('No se pudo identificar al médico.');
      return;
    }

    if (!this.selectedDate) {
      alert('Selecciona una fecha para la cita.');
      return;
    }

    const payload = {
      medicoDni: this.medicoDni,
      sedeId: this.sedeId,
      fechaCita: this.selectedDate,
      horaCita: slot.horaInicio
    };

    try {
      this.loading = true;

      const reserva = await this.reservaService.crearReserva(payload);

      slot.status = 'booked';
      this.ultimaReserva = reserva;
      this.showSuccessModal = true;

    } catch (err: any) {
      console.error('Error al reservar:', err);
      alert(
        err?.response?.data?.message ||
        'No se pudo reservar la cita. Intenta nuevamente.'
      );
    } finally {
      this.loading = false;
    }
  }
  
  closeModal(): void {
    this.showSuccessModal = false;
  }

  goToMisCitas(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/paciente/reservas']); 
  }
}
