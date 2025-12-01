// src/app/features/admin-dashboard/paciente/paciente.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';
import {
  AdminPacientesService,
  Patient,
} from './admin-pacientes.service';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-adminpaciente',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './paciente.html',
  styleUrls: ['./paciente.scss'],
})
export class Adminpaciente implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];

  searchTerm = '';

  showModal = false;
  showDeleteModal = false;
  modalMode: ModalMode = 'create';

  // formulario basado SOLO en los campos del backend
  patientForm: Patient = this.getEmptyForm();
  patientToDelete: Patient | null = null;

  constructor(private patientsService: AdminPacientesService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private async loadPatients(): Promise<void> {
    const data = await this.patientsService.getPatients();
    this.patients = data;
    this.filteredPatients = [...data];
  }

  // ======== getters para la UI ========
  get activePatientsCount(): number {
    return this.patients.filter((p) => p.estado).length;
  }

  // ======== filtro ========
  filterPatients(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter((p) => {
      const dniStr = String(p.dni ?? '');
      return (
        p.nombreUsuario.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        dniStr.includes(term)
      );
    });
  }

  // ======== helpers formulario / modales ========
  private getEmptyForm(): Patient {
    return {
      id: 0,
      nombreUsuario: '',
      dni: 0,
      email: '',
      telefono: '',
      rol: 'PACIENTE',
      estado: true,
    };
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.patientForm = this.getEmptyForm();
    this.showModal = true;
  }

  openEditModal(patient: Patient): void {
    this.modalMode = 'edit';
    this.patientForm = { ...patient };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  openDeleteModal(patient: Patient): void {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  // De momento solo impacta en el array local.
  // Luego conectas POST/PUT/DELETE al backend.
  savePatient(): void {
    if (this.modalMode === 'create') {
      const newId =
        this.patients.length > 0
          ? Math.max(...this.patients.map((p) => p.id)) + 1
          : 1;
      this.patients.push({ ...this.patientForm, id: newId });
    } else {
      this.patients = this.patients.map((p) =>
        p.id === this.patientForm.id ? { ...this.patientForm } : p
      );
    }

    this.filteredPatients = [...this.patients];
    this.filterPatients();
    this.closeModal();
  }

  confirmDelete(): void {
    if (!this.patientToDelete) return;

    this.patients = this.patients.filter(
      (p) => p.id !== this.patientToDelete!.id
    );
    this.filteredPatients = [...this.patients];
    this.filterPatients();
    this.closeDeleteModal();
  }

  toggleStatus(patient: Patient): void {
    patient.estado = !patient.estado;
  }
}
