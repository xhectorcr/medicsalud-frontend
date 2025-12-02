
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';
import { PacientePerfilService, PacientePerfil } from './paciente-perfil.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-pacienteperfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebarpaciente],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class Pacienteperfil implements OnInit {
  formData: PacientePerfil = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private perfilService: PacientePerfilService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  async cargarPerfil() {
    this.loading = true;

    try {
      // Ya no necesitamos pasar el DNI, el endpoint /me usa el token
      const data = await this.perfilService.getPerfil();
      this.formData = { ...data };
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error cargando perfil:', error);
      this.errorMessage = 'Error al cargar los datos del perfil.';
    } finally {
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  async onSubmit() {
    this.loading = true;
    try {
      await this.perfilService.updatePerfil(this.formData);
      this.toastService.show('Cambios guardados correctamente', 'success');
    } catch (error) {
      console.error('Error guardando perfil:', error);
      this.toastService.show('Error al guardar los cambios', 'error');
    } finally {
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
