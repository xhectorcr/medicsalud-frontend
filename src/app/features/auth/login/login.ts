import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header';
import { LoginService, LoginResponse } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
})
export class Login implements OnInit {
  userRole: 'paciente' | 'medico' | 'admin' = 'paciente';
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('username');
    if (savedEmail) {
      this.email = savedEmail;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const resp: LoginResponse = await this.loginService.login({
        email: this.email,
        password: this.password,
      });

      // token y datos del usuario
      localStorage.setItem('authToken', resp.token);
      localStorage.setItem('tokenType', resp.type);
      localStorage.setItem('username', resp.username);
      localStorage.setItem('roles', JSON.stringify(resp.roles || []));
      localStorage.setItem('userEmail', this.email);

      // expiración CLIENTE: 2 horas desde ahora
      const twoHoursMs = 2 * 60 * 60 * 1000;
      const expirationTimestamp = Date.now() + twoHoursMs;
      localStorage.setItem('tokenExpiration', String(expirationTimestamp));

      // (opcional) guardar lo que mande el backend solo para debug
      if ((resp as any).fechaExpiracion) {
        localStorage.setItem(
          'tokenExpirationServer',
          (resp as any).fechaExpiracion
        );
      }

      const roles = resp.roles || [];
      const hasAdmin = roles.includes('ROLE_ADMIN');
      const hasMedico = roles.includes('ROLE_MEDICO');
      const hasPaciente = roles.includes('ROLE_PACIENTE');

      // validar selección vs roles reales
      if (this.userRole === 'admin' && !hasAdmin) {
        this.errorMessage = 'No tienes permisos de administrador';
        return;
      }

      if (this.userRole === 'medico' && !hasMedico) {
        this.errorMessage = 'No tienes permisos de médico';
        return;
      }

      if (this.userRole === 'paciente' && !hasPaciente) {
        this.errorMessage = 'No tienes permisos de paciente';
        return;
      }

      localStorage.setItem('userRole', this.userRole);
      this.redirectToRole(this.userRole);
    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 401) {
        this.errorMessage = 'Correo o contraseña incorrectos';
      } else if (error?.message === 'Token expirado en el cliente') {
        this.errorMessage = 'Tu sesión ha expirado, vuelve a iniciar sesión.';
      } else {
        this.errorMessage = 'Error al iniciar sesión. Inténtalo nuevamente.';
      }
    } finally {
      this.loading = false;
    }
  }

  private redirectToRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/sidebaradmin']);
        break;
      case 'medico':
        this.router.navigate(['/medicos/citas']);
        break;
      case 'paciente':
        this.router.navigate(['/paciente/medicos']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/auth/forgot-password']);
  }

  get hasError(): boolean {
    return this.errorMessage.length > 0;
  }
}
