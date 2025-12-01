import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header';
import { FooterComponent } from "../../layout/footer/footer";

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.scss']
})
export class Servicios {

  specialties = [
    {
      name: 'Medicina General',
      description: 'Atención primaria integral para pacientes de todas las edades. Diagnóstico y tratamiento de enfermedades comunes.',
      icon: 'fas fa-stethoscope'
    },
    {
      name: 'Pediatría',
      description: 'Cuidado médico especializado para bebés, niños y adolescentes, enfocado en su crecimiento y desarrollo saludable.',
      icon: 'fas fa-child'
    },
    {
      name: 'Ginecología y Obstetricia',
      description: 'Salud integral de la mujer, incluyendo embarazo, parto y manejo de enfermedades del sistema reproductivo.',
      icon: 'fas fa-venus'
    },
    {
      name: 'Cardiología',
      description: 'Diagnóstico y tratamiento de enfermedades del corazón y del sistema circulatorio, como hipertensión y arritmias.',
      icon: 'fas fa-heartbeat'
    },
    {
      name: 'Dermatología',
      description: 'Cuidado de la piel, cabello y uñas. Tratamiento de condiciones como acné, psoriasis y cáncer de piel.',
      icon: 'fas fa-allergies' // Un ícono relacionado con la piel
    },
    {
      name: 'Oftalmología',
      description: 'Salud visual y ocular. Diagnóstico y tratamiento de enfermedades como cataratas, glaucoma y defectos refractivos.',
      icon: 'fas fa-eye'
    },
    {
      name: 'Otorrinolaringología',
      description: 'Tratamiento de enfermedades y trastornos del oído, nariz, garganta, cabeza y cuello.',
      icon: 'fas fa-deaf'
    },
    {
      name: 'Traumatología y Ortopedia',
      description: 'Manejo de lesiones del sistema musculoesquelético, incluyendo huesos, articulaciones, ligamentos y músculos.',
      icon: 'fas fa-bone'
    },
    {
      name: 'Odontología',
      description: 'Salud bucal completa, desde limpiezas y empastes hasta tratamientos de conducto y ortodoncia.',
      icon: 'fas fa-tooth'
    },
    {
      name: 'Psicología',
      description: 'Apoyo para la salud mental y el bienestar emocional, tratando ansiedad, depresión y otros trastornos.',
      icon: 'fas fa-brain'
    },
    {
      name: 'Urología',
      description: 'Diagnóstico y tratamiento de enfermedades del tracto urinario masculino y femenino, y del sistema reproductor masculino.',
      icon: 'fas fa-male' // Ícono representativo
    },
    {
      name: 'Gastroenterología',
      description: 'Cuidado del sistema digestivo y sus trastornos, incluyendo esófago, estómago, intestinos, hígado y páncreas.',
      icon: 'fas fa-bacteria' // Ícono relacionado con el sistema digestivo
    },
    {
      name: 'Medicina Interna',
      description: 'Atención a adultos con enfermedades complejas o múltiples, coordinando el cuidado y previniendo enfermedades.',
      icon: 'fas fa-notes-medical'
    },
    {
      name: 'Nutrición y Dietética',
      description: 'Asesoramiento para una alimentación saludable, control de peso y dietas terapéuticas para diversas condiciones.',
      icon: 'fas fa-apple-alt'
    },
    {
      name: 'Fisioterapia y Rehabilitación',
      description: 'Recuperación de la movilidad y función física a través de terapia manual, ejercicio y técnicas especializadas.',
      icon: 'fas fa-running'
    }
  ];

}