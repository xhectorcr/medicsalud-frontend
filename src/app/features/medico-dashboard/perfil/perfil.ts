import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';
import { api } from '../../../core/http/axios-instance';

interface MedicoProfile {
  id: number;
  nombre: string;
  especialidad: string;
  correo: string;
  dni: number;
  sede: any;
  telefono: string;
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebarmedicos, RouterModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class Medicoperfil implements OnInit {
  // Información personal
  email: string = '';
  phone: string = '';
  specialty: string = ''; // Read-only or fetched
  loading = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile() {
    this.loading = true;
    try {
      // Endpoint actualizado según imagen
      const response = await api.get<MedicoProfile>('/api/medicos/me');
      const data = response.data;

      this.email = data.correo;
      this.phone = data.telefono;
      this.specialty = data.especialidad;

      // Actualizar localStorage para persistencia
      localStorage.setItem('medicoEmail', this.email);
      localStorage.setItem('medicoPhone', this.phone);
      localStorage.setItem('medicoEspecialidad', this.specialty);

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando perfil', error);
      // Fallback a localStorage si falla la API
      this.email = localStorage.getItem('medicoEmail') || '';
      this.phone = localStorage.getItem('medicoPhone') || '';
      this.specialty = localStorage.getItem('medicoEspecialidad') || '';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async saveChanges(): Promise<void> {
    const data = {
      email: this.email,
      telefono: this.phone
    };

    try {
      await api.put('/api/medicos/perfil', data);
      alert('Perfil actualizado correctamente');

      // Actualizar localStorage si es necesario
      localStorage.setItem('medicoEmail', this.email);
      localStorage.setItem('medicoPhone', this.phone);

    } catch (error) {
      console.error('Error actualizando perfil', error);
      alert('No se pudo actualizar el perfil');
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
