import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/auth/login']);
  }

  onRegister() {
    this.router.navigate(['/auth/register']);
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
