import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../layout/header/header";


@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent]
})
export class Register implements OnInit {
  firstName: string = '';
  lastName: string = '';
  birthdate: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    // private authService: AuthService  // Descomentar cuando tengas el servicio
  ) {}

  ngOnInit(): void {
    // Verificar si ya hay sesión activa
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

  onSubmit(): void {
    // Limpiar mensaje de error previo
    this.errorMessage = '';

    // Validaciones
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // Simular registro de usuario
    this.registerUser();
  }

  private validateForm(): boolean {
    // Validar campos vacíos
    if (!this.firstName || !this.lastName || !this.birthdate || !this.phone || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos';
      return false;
    }

    // Validar nombres y apellidos (mínimo 2 caracteres cada uno)
    if (this.firstName.trim().length < 2) {
      this.errorMessage = 'El nombre debe tener al menos 2 caracteres';
      return false;
    }
    if (this.lastName.trim().length < 2) {
      this.errorMessage = 'El apellido debe tener al menos 2 caracteres';
      return false;
    }

    // Validar edad (mayor de 18 años)
    if (!this.validateAge()) {
      this.errorMessage = 'Debes ser mayor de 18 años para registrarte';
      return false;
    }

    // Validar formato de email
    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido';
      return false;
    }

    // Validar teléfono (mínimo 9 dígitos)
    const phoneDigits = this.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      this.errorMessage = 'El número de celular debe tener al menos 9 dígitos';
      return false;
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    return true;
  }

  private validateAge(): boolean {
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private registerUser(): void {
    // Aquí iría tu llamada al servicio de registro
    // Ejemplo:
    /*
    const userData = {
      role: this.userRole,
      name: this.name,
      birthdate: this.birthdate,
      phone: this.phone,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData)
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Mostrar mensaje de éxito
          alert('Registro exitoso. Por favor inicia sesión.');
          // Redirigir al login
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Error al registrar usuario';
        }
      });
    */

    // Simulación temporal (eliminar en producción)
    setTimeout(() => {
      this.loading = false;
      console.log('Registro exitoso:', {
        firstName: this.firstName,
        lastName: this.lastName,
        birthdate: this.birthdate,
        phone: this.phone,
        email: this.email
      });
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.router.navigate(['/auth/login']);
    }, 1500);
  }

  // Método auxiliar para mostrar mensajes de error
  get hasError(): boolean {
    return this.errorMessage.length > 0;
  }

  // Método para limpiar el mensaje de error
  clearError(): void {
    this.errorMessage = '';
  }
}