import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';

interface Receta {
  id: number;
  medicamento: string;
  dosis: string;
  fecha: string;
  medico: string;
}

@Component({
  selector: 'app-pacienterecetas',
  standalone: true,
  imports: [CommonModule, Sidebarpaciente],
  templateUrl: './recetas.html',
  styleUrls: ['./recetas.scss']
})
export class Pacienterecetas {
  recetas: Receta[] = [
    {
      id: 1,
      medicamento: 'Paracetamol',
      dosis: '500mg cada 8 horas',
      fecha: '2024-01-15',
      medico: 'Dr. Carlos Pérez'
    },
    {
      id: 2,
      medicamento: 'Ibuprofeno',
      dosis: '400mg cada 6 horas',
      fecha: '2023-12-20',
      medico: 'Dra. Ana García'
    },
    {
      id: 3,
      medicamento: 'Amoxicilina',
      dosis: '750mg cada 12 horas',
      fecha: '2023-11-08',
      medico: 'Dr. Luis Fernández'
    }
  ];

  nuevaReceta(): void {
    console.log('Crear nueva receta');
  }

  verReceta(receta: Receta): void {
    console.log('Ver receta:', receta);
  }
}

