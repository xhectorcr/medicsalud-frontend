import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../layout/header/header';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent]
})
export class Login implements OnInit {
  userRole: string = 'paciente';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    // private authService: AuthService  // Descomentar cuando tengas el servicio
  ) {}

  ngOnInit(): void {
    // Verificar si ya hay sesión activa
    // if (this.authService.isLoggedIn()) {
    //   this.redirectToRole(this.authService.getUserRole());
    // }
  }

  onSubmit(): void {
    // Validación básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Simular llamada al servicio de autenticación
    // En producción, reemplazar con tu servicio real
    this.authenticateUser();
  }

  private authenticateUser(): void {
    // Aquí iría tu llamada al servicio de autenticación
    // Ejemplo:
    /*
    this.authService.login(this.email, this.password, this.userRole)
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Guardar token y datos de usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', this.userRole);
          
          // Redirigir según el rol
          this.redirectToRole(this.userRole);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Credenciales incorrectas';
        }
      });
    */

    // Simulación temporal (eliminar en producción)
    setTimeout(() => {
      this.loading = false;
      console.log('Login exitoso:', {
        role: this.userRole,
        email: this.email
      });
      
      // Guardar datos temporales
      localStorage.setItem('userRole', this.userRole);
      localStorage.setItem('userEmail', this.email);
      
      // Redirigir según rol
      this.redirectToRole(this.userRole);
    }, 1000);
  }

  private redirectToRole(role: string): void {
    switch (role) {
      case 'medico':
        this.router.navigate(['/medico/dashboard']);
        break;
      case 'paciente':
        this.router.navigate(['/paciente/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/auth/forgot-password']);
  }

  // Método auxiliar para mostrar mensajes de error
  get hasError(): boolean {
    return this.errorMessage.length > 0;
  }
}