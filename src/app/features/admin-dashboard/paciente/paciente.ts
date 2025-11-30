import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';

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
  selector: 'app-patients',
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './paciente.html',
  styleUrls: ['./paciente.scss']
})
export class Adminpaciente implements OnInit {

  // Siempre inicializados → Angular deja de marcar error
  patients: Patient[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: '12345678',
      email: 'juan.perez@email.com',
      telefono: '+54 11 1234-5678',
      fechaNacimiento: '1985-03-15',
      obraSocial: 'OSDE',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'González',
      dni: '23456789',
      email: 'maria.gonzalez@email.com',
      telefono: '+54 11 2345-6789',
      fechaNacimiento: '1990-07-22',
      obraSocial: 'Swiss Medical',
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      dni: '34567890',
      email: 'carlos.rodriguez@email.com',
      telefono: '+54 11 3456-7890',
      fechaNacimiento: '1978-11-03',
      obraSocial: 'Galeno',
      estado: 'inactivo'
    }
  ];

  filteredPatients: Patient[] = [];

  searchTerm: string = '';
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedPatient: Patient | null = null;
  patientToDelete: Patient | null = null;

  patientForm: Patient = this.getEmptyPatient();

  // Getter para evitar error del template
  get activePatientsCount(): number {
    return this.patients.filter(p => p.estado === 'activo').length;
  }

  ngOnInit(): void {
    this.filteredPatients = [...this.patients];
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
      estado: 'activo'
    };
  }

  filterPatients(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
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
      const newId = Math.max(...this.patients.map(p => p.id), 0) + 1;
      this.patientForm.id = newId;
      this.patients.push({ ...this.patientForm });
    } else {
      const index = this.patients.findIndex(p => p.id === this.patientForm.id);
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
      this.patients = this.patients.filter(p => p.id !== idToDelete);
      this.filterPatients();
      this.closeDeleteModal();
    }
  }

  toggleStatus(patient: Patient): void {
    patient.estado = patient.estado === 'activo' ? 'inactivo' : 'activo';
  }
}
