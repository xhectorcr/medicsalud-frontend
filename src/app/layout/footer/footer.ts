import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  onContactClick() {
    console.log('Redirigir a contacto');
    // Implementar redirección a página de contacto
  }

  onSocialClick(platform: string) {
    console.log(`Abrir ${platform}`);
    // Implementar redirección a redes sociales
  }

  onLinkClick(link: string) {
    console.log(`Navegar a ${link}`);
    // Implementar navegación
  }
}