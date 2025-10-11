import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

@Component({
  selector: 'app-pacientesmedicos',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebarpaciente],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
})
export class Pacientemedico{
  searchTerm: string = '';
  
  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Ricardo García',
      specialty: 'Cardiología',
      image: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      name: 'Dra. Sofía Martínez',
      specialty: 'Dermatología',
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 3,
      name: 'Dr. Alejandro López',
      specialty: 'Pediatría',
      image: 'https://i.pravatar.cc/150?img=13'
    },
    {
      id: 4,
      name: 'Dra. Isabel Fernández',
      specialty: 'Ginecología',
      image: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: 5,
      name: 'Dr. Javier Sánchez',
      specialty: 'Neurología',
      image: 'https://i.pravatar.cc/150?img=14'
    },
    {
      id: 6,
      name: 'Dra. Laura Torres',
      specialty: 'Oftalmología',
      image: 'https://i.pravatar.cc/150?img=10'
    }
  ];

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

  verDisponibilidad(doctor: Doctor): void {
    console.log('Ver disponibilidad de:', doctor.name);
    // Aquí puedes implementar la lógica para ver disponibilidad
  }
}