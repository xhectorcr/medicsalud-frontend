import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';

@Component({
  selector: 'app-pacienteperfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebarpaciente],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class Pacienteperfil {
  formData = {
    email: '',
    phone: '',
    address: ''
  };

  constructor(private router: Router) { }

  onSubmit() {
    console.log('Guardando cambios:', this.formData);
    alert('Cambios guardados correctamente');
  }

  logout() {
    localStorage.clear(); 
    this.router.navigate(['/auth/login']);
  }
}
