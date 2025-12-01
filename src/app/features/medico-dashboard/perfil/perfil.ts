import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-account-settings',
  imports: [CommonModule, FormsModule, Sidebarmedicos, RouterModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class Medicoperfil {
  // Información personal
  email: string = 'carlos.perez@redcard.com';
  phone: string = '+51 987 654 321';
  specialty: string = 'Cardiología';

  // Horarios de consulta
  schedules: Schedule[] = [
    { day: 'Lunes', startTime: '08:00 AM', endTime: '01:00 PM' },
    { day: 'Miércoles', startTime: '03:00 PM', endTime: '06:00 PM' }
  ];

  days: string[] = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  times: string[] = [];

  constructor(private router: Router) {
    this.times = this.generateTimeSlots();
  }

  addSchedule(): void {
    this.schedules.push({
      day: 'Lunes',
      startTime: '09:00 AM',
      endTime: '05:00 PM'
    });
  }

  removeSchedule(index: number): void {
    this.schedules.splice(index, 1);
  }

  saveChanges(): void {
    const data = {
      email: this.email,
      phone: this.phone,
      specialty: this.specialty,
      schedules: this.schedules
    };
    console.log('Guardando cambios:', data);
    alert('Cambios guardados correctamente');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  private generateTimeSlots(): string[] {
    const slots: string[] = [];
    const periods = ['AM', 'PM'];

    periods.forEach(period => {
      for (let hour = 1; hour <= 12; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00 ${period}`);
        slots.push(`${hour.toString().padStart(2, '0')}:30 ${period}`);
      }
    });

    return slots;
  }
}
