import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';
import { MedicosService, MedicoBackend } from './medicos.service';
import { Router } from '@angular/router';
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  correo: string;
  dni: number;
  sede: string | null;
}

@Component({
  selector: 'app-pacientesmedicos',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebarpaciente],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
})
export class Pacientemedico implements OnInit {
  searchTerm: string = '';

  doctors: Doctor[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private medicosService: MedicosService,
    private router: Router,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  async cargarMedicos(): Promise<void> {
    this.errorMessage = '';
    this.loading = true;

    try {
      // Try to get cached data first (or fetch if not available)
      const data: MedicoBackend[] = await this.medicosService.getMedicosActivos();

      this.doctors = data.map((m, index) => ({
        id: m.id,
        name: m.nombre,
        specialty: m.especialidad,
        correo: m.correo,
        dni: m.dni,
        sede: m.sede,
        image: 'https://i.pravatar.cc/150?img=' + ((index % 10) + 1),
      }));

      this.loading = false;
      this.cd.detectChanges();
    } catch (error: any) {
      console.error(error);
      this.errorMessage =
        error?.response?.data?.message || 'No se pudo cargar la lista de médicos.';
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  get filteredDoctors(): Doctor[] {
    if (!this.searchTerm) {
      return this.doctors;
    }

    const term = this.searchTerm.toLowerCase();
    return this.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term)
    );
  }

  verDisponibilidad(doctor: Doctor) {
    console.log('🔍 Navegando con doctor:', doctor);

    this.router.navigate(
      ['/paciente/horarios-medico'],
      {
        queryParams: {
          correo: doctor.correo,
          nombre: doctor.name,
          especialidad: doctor.specialty,
          foto: doctor.image,
          medicoDni: doctor.dni,
          sedeId: 1,  // TODO: usar doctor.sede cuando esté disponible
          clinica: doctor.sede || 'Clínica Principal'
        }
      }
    );
  }
}
