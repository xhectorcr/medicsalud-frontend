import { Component } from '@angular/core';

interface Cita {
  id: number;
  paciente: string;
  fecha: string;
  hora: string;
  motivo: string;
}

@Component({
  selector: 'app-medicoscitas',
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss']
})
export class Medicoscitas {
  citas: Cita[] = [
    {
      id: 1,
      paciente: 'Sofía Rodríguez',
      fecha: '2024-07-20',
      hora: '10:00 AM',
      motivo: 'Consulta general'
    },
    {
      id: 2,
      paciente: 'Juan Pérez',
      fecha: '2024-07-21',
      hora: '02:00 PM',
      motivo: 'Dolor de espalda'
    },
    {
      id: 3,
      paciente: 'Ana Martínez',
      fecha: '2024-07-22',
      hora: '11:30 AM',
      motivo: 'Control de rutina'
    },
    {
      id: 4,
      paciente: 'Luis García',
      fecha: '2024-07-22',
      hora: '03:05 PM',
      motivo: 'Fiebre y tos'
    }
  ];

  aceptarCita(cita: Cita): void {
    console.log('Aceptar cita:', cita);
    // Implementar lógica para aceptar la cita
  }

  rechazarCita(cita: Cita): void {
    console.log('Rechazar cita:', cita);
    // Implementar lógica para rechazar la cita
  }

  reprogramarCita(cita: Cita): void {
    console.log('Reprogramar cita:', cita);
    // Implementar lógica para reprogramar la cita
  }
}