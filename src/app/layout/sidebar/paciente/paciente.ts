import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebarpaciente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente.html',
  styleUrls: ['./paciente.scss']
})
export class Sidebarpaciente {

  menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

}

