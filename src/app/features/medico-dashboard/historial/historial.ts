import { Component } from '@angular/core';

interface PatientData {
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  grupoSanguineo: string;
}

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

@Component({
  selector: 'app-patient-history',
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss']
})
export class Medicohistorial {
  patientData: PatientData = {
    nombre: 'Carlos Pérez',
    fechaNacimiento: '10 de marzo de 1985',
    genero: 'Masculino',
    grupoSanguineo: 'O+'
  };

  medicalHistory: MedicalHistory = {
    alergias: 'Penicilina',
    enfermedadesCronicas: 'Hipertensión',
    cirugiasPrevias: 'Apendicectomía (2003)'
  };

  diagnosis: Diagnosis = {
    principal: 'Hipertensión Arterial Esencial (Primaria)',
    tratamiento: 'Losartán 50mg, una vez al día.'
  };

  previousConsults: PreviousConsult[] = [
    { tipo: 'Consulta General', fecha: '5 de enero de 2024' },
    { tipo: 'Seguimiento de Hipertensión', fecha: '15 de febrero de 2024' },
    { tipo: 'Vacunación (Gripe)', fecha: '22 de marzo de 2024' }
  ];
}