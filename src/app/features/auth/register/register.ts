import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header';
import { RegisterService, RegisterRequest } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
})
export class Register implements OnInit {
  firstName: string = '';
  lastName: string = '';
  dni: string = '';
  birthdate: string = '';
  phone: string = '';
  address: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    // 1) No navega ni llama backend si hay errores de validación
    this.errorMessage = '';

    if (!this.validateForm()) {
      return; 
    }

    this.loading = true;

    try {
      const payload: RegisterRequest = {
        nombre: this.firstName.trim(),
        apellido: this.lastName.trim(),
        dni: this.dni.trim(),
        email: this.email.trim(),
        clave: this.password,
        fechaNacimiento: this.birthdate,
        telefono: this.phone.replace(/\D/g, ''),
        direccion: this.address.trim(),
      };

      console.log('Payload registro:', payload);

      // 2) Esperar a que el backend confirme el registro
      const resp = await this.registerService.register(payload);
      console.log('Respuesta registro:', resp);

      this.loading = false;

      // 3) SOLO aquí, cuando el registro fue correcto, cambiamos de página
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      console.error(error);
      this.loading = false;

      // 4) Si hay error solo mensaje en rojo
      if (error?.response?.status === 400) {
        this.errorMessage =
          error.response.data?.message || 'Datos inválidos en el registro';
      } else if (error?.response?.status === 409) {
        this.errorMessage = 'El correo o DNI ya se encuentra registrado';
      } else {
        this.errorMessage = 'Error al registrar usuario. Inténtalo nuevamente.';
      }
    }
  }

  private validateForm(): boolean {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.dni ||
      !this.birthdate ||
      !this.phone ||
      !this.address ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Por favor completa todos los campos';
      return false;
    }

    if (this.firstName.trim().length < 2) {
      this.errorMessage = 'El nombre debe tener al menos 2 caracteres';
      return false;
    }
    if (this.lastName.trim().length < 2) {
      this.errorMessage = 'El apellido debe tener al menos 2 caracteres';
      return false;
    }

    const dniDigits = this.dni.replace(/\D/g, '');
    if (dniDigits.length !== 8) {
      this.errorMessage = 'El DNI debe tener 8 dígitos';
      return false;
    }

    if (!this.validateAge()) {
      this.errorMessage = 'Debes ser mayor de 18 años para registrarte';
      return false;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido';
      return false;
    }

    const phoneDigits = this.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      this.errorMessage = 'El número de celular debe tener al menos 9 dígitos';
      return false;
    }

    if (this.address.trim().length < 5) {
      this.errorMessage = 'La dirección debe ser más detallada';
      return false;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }

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

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get hasError(): boolean {
    return this.errorMessage.length > 0;
  }
}
