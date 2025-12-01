import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule, FormsModule, Sidebaradmin, RouterModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class Adminperfil {
  // Información personal
  email: string = 'admin@medicsalud.com';
  phone: string = '+51 987 654 321';
  name: string = 'Administrador Principal';

  constructor(private router: Router) { }

  saveChanges(): void {
    console.log('Guardando cambios...', {
      email: this.email,
      phone: this.phone,
      name: this.name
    });
    // Aquí implementarías la lógica para guardar en el backend
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
