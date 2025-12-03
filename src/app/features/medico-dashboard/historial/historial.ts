import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';
import { api } from '../../../core/http/axios-instance';
import { FormsModule } from '@angular/forms';

interface MedicalHistory {
  alergias: string;
  enfermedadesCronicas: string;
  cirugiasPrevias: string;
}

interface Diagnosis {
  principal: string;
  tratamiento: string;
}

interface PreviousConsult {
  tipo: string;
  fecha: string;
}

interface Patient {
  id: number;
  dni: number;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  grupoSanguineo: string;
  image: string;
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
  estadoCita: boolean;
}

// historial que devuelve tu backend
interface ClinicalHistoryFromApi {
  id: number;
  fechaRegistro: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  estado: boolean;
  pacienteId: number;
  pacienteNombre: string;
  pacienteDni: number;
  medicoId: number;
  medicoNombre: string;
}

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebarmedicos],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss'],
})
export class Medicohistorial implements OnInit {
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;

  // historial completo del paciente seleccionado
  histories: ClinicalHistoryFromApi[] = [];

  // Antecedentes médicos (por ahora genérico, hasta que tengas endpoint)
  medicalHistory: MedicalHistory | null = {
    alergias: '-',
    enfermedadesCronicas: '-',
    cirugiasPrevias: '-',
  };

  searchTerm: string = '';
  loading = false;

  // formulario de nuevo historial
  showNewHistoryForm = false;
  newHistory = {
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  };

  constructor(private cdr: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    await this.loadPatientsFromReservas();
  }

  // ================== PACIENTES ==================

  get filteredPatients(): Patient[] {
    return this.patients.filter((patient) =>
      patient.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  private async loadPatientsFromReservas(): Promise<void> {
    console.log('Cargando pacientes desde reservas...');
    try {
      const resp = await api.get<ReservaFromApi[]>('/api/reservas/lista');
      console.log('Reservas cargadas:', resp.data);

      const map = new Map<number, Patient>();

      resp.data.forEach((r) => {
        if (!map.has(r.pacienteDni)) {
          map.set(r.pacienteDni, {
            id: r.pacienteDni,
            dni: r.pacienteDni,
            nombre: r.nombrePaciente,
            fechaNacimiento: 'No registrado',
            genero: 'No registrado',
            grupoSanguineo: 'No registrado',
            image: 'https://i.pravatar.cc/150?u=' + r.pacienteDni,
          });
        }
      });

      this.patients = Array.from(map.values());
      console.log('Pacientes únicos encontrados:', this.patients.length);

      if (this.patients.length > 0) {
        this.selectPatient(this.patients[0]);
      }
      this.cdr.detectChanges(); // Force update
    } catch (err) {
      console.error('Error cargando pacientes desde reservas', err);
      this.patients = [];
      this.cdr.detectChanges(); // Force update
    }
  }

  async selectPatient(patient: Patient): Promise<void> {
    console.log('Paciente seleccionado:', patient);
    this.selectedPatient = patient;
    this.showNewHistoryForm = false;
    await this.loadHistoryByDni(patient.dni);
  }

  // ================== HISTORIAL ==================

  private async loadHistoryByDni(dni: number): Promise<void> {
    console.log('Cargando historial para DNI:', dni);
    this.loading = true;
    this.cdr.detectChanges(); // Force update for loading state
    try {
      const resp = await api.get<ClinicalHistoryFromApi[]>(
        `/api/historiales/paciente/${dni}`
      );
      console.log('Historial cargado:', resp.data);
      this.histories = resp.data ?? [];
    } catch (err) {
      console.error('Error cargando historial clínico', err);
      this.histories = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // Force update
    }
  }

  private formatDate(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  private get lastHistory(): ClinicalHistoryFromApi | null {
    if (!this.histories.length) return null;
    return [...this.histories].sort(
      (a, b) =>
        new Date(b.fechaRegistro).getTime() -
        new Date(a.fechaRegistro).getTime()
    )[0];
  }

  // lo usas igual que antes en el template
  get previousConsults(): PreviousConsult[] {
    return this.histories.map((h) => ({
      tipo: h.diagnostico,
      fecha: this.formatDate(h.fechaRegistro),
    }));
  }

  get diagnosis(): Diagnosis | null {
    const last = this.lastHistory;
    if (!last) return null;
    return {
      principal: last.diagnostico,
      tratamiento: last.tratamiento,
    };
  }

  // ================== NUEVO HISTORIAL ==================

  toggleNewHistory(): void {
    this.showNewHistoryForm = !this.showNewHistoryForm;
  }

  async createHistory(): Promise<void> {
    if (!this.selectedPatient) return;

    const body = {
      pacienteDni: this.selectedPatient.dni,
      diagnostico: this.newHistory.diagnostico.trim(),
      tratamiento: this.newHistory.tratamiento.trim(),
      observaciones: this.newHistory.observaciones.trim(),
    };

    console.log('Creando nuevo historial con payload:', body);

    if (!body.diagnostico || !body.tratamiento) {
      alert('Diagnóstico y tratamiento son obligatorios.');
      return;
    }

    this.loading = true;
    try {
      await api.post<ClinicalHistoryFromApi>(
        '/api/historiales',
        body
      );

      console.log('Historial creado exitosamente. Recargando lista...');

      // Recarga forzada del historial
      await this.loadHistoryByDni(this.selectedPatient.dni);

      // limpiamos formulario
      this.newHistory = {
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
      };
      this.showNewHistoryForm = false;
      alert('Historial médico creado correctamente');
    } catch (err) {
      console.error('Error creando historial clínico', err);
      alert('No se pudo crear el historial clínico.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
