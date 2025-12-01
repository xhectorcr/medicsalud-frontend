import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';
import { AdminMedicosService, MedicoFromApi } from './admin-medicos.service';

interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  obraSocial: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-adminmedicos',
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss'],
})
export class Adminmedicos implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];

  searchTerm: string = '';
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedPatient: Patient | null = null;
  patientToDelete: Patient | null = null;

  patientForm: Patient = this.getEmptyPatient();

  constructor(
    private medicosService: AdminMedicosService,
    private cd: ChangeDetectorRef
  ) { }

  get activePatientsCount(): number {
    return this.patients.filter((p) => p.estado === 'activo').length;
  }

  async ngOnInit(): Promise<void> {
    await this.loadMedicos();
  }

  getEmptyPatient(): Patient {
    return {
      id: 0,
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      fechaNacimiento: '',
      obraSocial: '',
      estado: 'activo',
    };
  }

  async loadMedicos(): Promise<void> {
    try {
      const data = await this.medicosService.getMedicos();

      this.patients = data.map((m) => ({
        id: m.id,
        nombre: m.usuario.nombre,
        apellido: m.usuario.apellido,
        dni: String(m.dni),
        email: m.usuario.email,
        telefono: m.usuario.telefono ?? '',
        fechaNacimiento: '',
        obraSocial: m.especialidad,
        estado: m.estado ? 'activo' : 'inactivo',
      }));

      this.filteredPatients = [...this.patients];
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error cargando médicos', error);
      this.filteredPatients = [];
      this.cd.detectChanges();
    }
  }

  filterPatients(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(
      (patient) =>
        patient.nombre.toLowerCase().includes(term) ||
        patient.apellido.toLowerCase().includes(term) ||
        patient.dni.includes(term) ||
        patient.email.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.patientForm = this.getEmptyPatient();
    this.showModal = true;
  }

  openEditModal(patient: Patient): void {
    this.modalMode = 'edit';
    this.selectedPatient = patient;
    this.patientForm = { ...patient };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPatient = null;
    this.patientForm = this.getEmptyPatient();
  }

  savePatient(): void {
    if (this.modalMode === 'create') {
      const newId = Math.max(...this.patients.map((p) => p.id), 0) + 1;
      this.patientForm.id = newId;
      this.patients.push({ ...this.patientForm });
    } else {
      const index = this.patients.findIndex((p) => p.id === this.patientForm.id);
      if (index !== -1) {
        this.patients[index] = { ...this.patientForm };
      }
    }
    this.filterPatients();
    this.closeModal();
  }

  openDeleteModal(patient: Patient): void {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  confirmDelete(): void {
    if (this.patientToDelete) {
      const idToDelete = this.patientToDelete.id;
      this.patients = this.patients.filter((p) => p.id !== idToDelete);
      this.filterPatients();
      this.closeDeleteModal();
    }
  }

  toggleStatus(patient: Patient): void {
    patient.estado = patient.estado === 'activo' ? 'inactivo' : 'activo';
  }
}
