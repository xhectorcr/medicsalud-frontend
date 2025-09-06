import { Component } from '@angular/core';
import { HeaderComponent } from "../../layout/header/header";
import { FooterComponent } from "../../layout/footer/footer";

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [HeaderComponent, FooterComponent]
})
export class HomeComponent {

  services = [
    {
      title: 'Medicina General',
      description: 'Consultas médicas generales y chequeos preventivos.'
    },
    {
      title: 'Pediatría',
      description: 'Atención médica especializada para niños y adolescentes.'
    },
    {
      title: 'Cardiología',
      description: 'Diagnóstico y tratamiento de enfermedades del corazón.'
    },
    {
      title: 'Oftalmología',
      description: 'Cuidado integral de la salud visual y ocular.'
    }
  ];

}