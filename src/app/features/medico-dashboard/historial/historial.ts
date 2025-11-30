import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';

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
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  grupoSanguineo: string;
  image: string;
}

@Component({
  selector: 'app-patient-history',
  imports: [CommonModule, Sidebarmedicos],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss']
})
export class Medicohistorial {
  patients: Patient[] = [
    {
      id: 1,
      nombre: 'Carlos Pérez',
      fechaNacimiento: '10 de marzo de 1985',
      genero: 'Masculino',
      grupoSanguineo: 'O+',
      image: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: 2,
      nombre: 'Ana García',
      fechaNacimiento: '22 de julio de 1990',
      genero: 'Femenino',
      grupoSanguineo: 'A+',
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 3,
      nombre: 'Roberto Díaz',
      fechaNacimiento: '05 de noviembre de 1978',
      genero: 'Masculino',
      grupoSanguineo: 'B-',
      image: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  selectedPatient: Patient | null = null;

  // Data stores for each patient (mock database)
  private patientRecords: { [key: number]: any } = {
    1: {
      medicalHistory: {
        alergias: 'Penicilina',
        enfermedadesCronicas: 'Hipertensión',
        cirugiasPrevias: 'Apendicectomía (2003)'
      },
      diagnosis: {
        principal: 'Hipertensión Arterial Esencial (Primaria)',
        tratamiento: 'Losartán 50mg, una vez al día.'
      },
      previousConsults: [
        { tipo: 'Consulta General', fecha: '5 de enero de 2024' },
        { tipo: 'Seguimiento de Hipertensión', fecha: '15 de febrero de 2024' },
        { tipo: 'Vacunación (Gripe)', fecha: '22 de marzo de 2024' }
      ]
    },
    2: {
      medicalHistory: {
        alergias: 'Ninguna',
        enfermedadesCronicas: 'Asma leve',
        cirugiasPrevias: 'Ninguna'
      },
      diagnosis: {
        principal: 'Bronquitis Aguda',
        tratamiento: 'Salbutamol inhalador, reposo.'
      },
      previousConsults: [
        { tipo: 'Urgencias', fecha: '10 de marzo de 2024' },
        { tipo: 'Revisión', fecha: '20 de marzo de 2024' }
      ]
    },
    3: {
      medicalHistory: {
        alergias: 'Polen, Ácaros',
        enfermedadesCronicas: 'Diabetes Tipo 2',
        cirugiasPrevias: 'Hernia Inguinal (2015)'
      },
      diagnosis: {
        principal: 'Diabetes Mellitus Tipo 2',
        tratamiento: 'Metformina 850mg, dieta baja en carbohidratos.'
      },
      previousConsults: [
        { tipo: 'Control Diabetes', fecha: '12 de enero de 2024' },
        { tipo: 'Nutrición', fecha: '15 de enero de 2024' },
        { tipo: 'Podología', fecha: '01 de febrero de 2024' }
      ]
    }
  };

  // Current displayed data
  medicalHistory: MedicalHistory | null = null;
  diagnosis: Diagnosis | null = null;
  previousConsults: PreviousConsult[] = [];

  searchTerm: string = '';

  get filteredPatients(): Patient[] {
    return this.patients.filter(patient =>
      patient.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  constructor() {
    // Select first patient by default
    if (this.patients.length > 0) {
      this.selectPatient(this.patients[0]);
    }
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    const record = this.patientRecords[patient.id];
    if (record) {
      this.medicalHistory = record.medicalHistory;
      this.diagnosis = record.diagnosis;
      this.previousConsults = record.previousConsults;
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }
}