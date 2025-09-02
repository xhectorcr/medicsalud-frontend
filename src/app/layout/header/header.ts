import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  onLogin() {
    console.log('Redirigir a login');
    // Aquí implementarías la redirección al login
  }

  onRegister() {
    console.log('Redirigir a registro');
    // Aquí implementarías la redirección al registro
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
