import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoHorariosService, HorarioBackend } from './medico-horarios.service';

type SlotStatus = 'available' | 'booked';

interface Slot {
  id: number;
  time: string;    
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

  doctor = {
    name: '',
    speciality: '',
    clinic: '',
    photoUrl: ''
  };

  slots: Slot[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private horariosService: MedicoHorariosService
  ) {}

  ngOnInit(): void {
   
    this.selectedDate = new Date().toISOString().substring(0, 10);

    this.route.queryParams.subscribe(async (params) => {
      this.correoMedico      = params['correo'] ?? '';
      this.doctor.name       = params['nombre'] ?? '';
      this.doctor.speciality = params['especialidad'] ?? '';
      this.doctor.photoUrl   = params['foto'] ?? '';

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

      // Por ahora todos como "available"; luego podrás marcar booked según reservas
      this.slots = data.map((h) => ({
        id: h.id,
        time: `${h.horaInicio} - ${h.horaFin}`,
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

  onReserve(slot: Slot): void {
    if (slot.status !== 'available') return;
    // aquí luego llamas al endpoint de crear reserva
    console.log('Reservar slot', slot, 'para médico', this.correoMedico);
  }
}
