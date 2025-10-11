import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebarmedicos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
})
export class Sidebarmedicos {

  menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

}

