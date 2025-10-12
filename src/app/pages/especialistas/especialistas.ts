import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';

@Component({
  selector: 'app-especialistas',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './especialistas.html',
  styleUrls: ['./especialistas.scss']
})
export class Especialistas {

  doctors = [
    {
      name: 'Dr. Alejandro Vargas',
      specialty: 'Medicina General',
      bio: 'Con más de 15 años de experiencia, el Dr. Vargas se especializa en la prevención y el tratamiento integral de la salud del adulto.',
      imageUrl: 'assets/images/doctors/doctor-male-1.jpg' // Ruta a la imagen del doctor
    },
    {
      name: 'Dra. Sofía Castillo',
      specialty: 'Pediatría',
      bio: 'Apasionada por la salud infantil, la Dra. Castillo acompaña a los más pequeños desde el nacimiento hasta la adolescencia.',
      imageUrl: 'assets/images/doctors/doctor-female-1.jpg'
    },
    {
      name: 'Dra. Elena Rivas',
      specialty: 'Ginecología y Obstetricia',
      bio: 'Experta en salud femenina, ofrece un cuidado compasivo y experto durante todas las etapas de la vida de la mujer.',
      imageUrl: 'assets/images/doctors/doctor-female-2.jpg'
    },
    {
      name: 'Dr. Ricardo Mendoza',
      specialty: 'Cardiología',
      bio: 'Líder en el diagnóstico y tratamiento de enfermedades cardiovasculares, utilizando tecnología de vanguardia.',
      imageUrl: 'assets/images/doctors/doctor-male-2.jpg'
    },
    {
      name: 'Dra. Isabel Torres',
      specialty: 'Dermatología',
      bio: 'Especialista en el cuidado de la piel, la Dra. Torres combina la ciencia y la estética para lograr resultados excepcionales.',
      imageUrl: 'assets/images/doctors/doctor-female-3.jpg'
    },
    {
      name: 'Dr. Javier Nuñez',
      specialty: 'Oftalmología',
      bio: 'Dedicado a preservar y mejorar la visión de sus pacientes con un enfoque en la prevención y tratamientos avanzados.',
      imageUrl: 'assets/images/doctors/doctor-male-3.jpg'
    },
    // Puedes seguir agregando más doctores para cada especialidad aquí
  ];
}