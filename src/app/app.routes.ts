import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { HomeComponent } from './pages/home/home';
import { Pacientemedico } from './features/paciente-dashboard/medicos/medicos';
import { Pacienteperfil } from './features/paciente-dashboard/perfil/perfil';
import { Sidebarpaciente } from './layout/sidebar/paciente/paciente';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'auth/login', component: Login },
	{ path: 'auth/register', component: Register },
	{ path: 'paciente/medicos', component: Pacientemedico },
	{ path: 'paciente/perfil', component: Pacienteperfil },
	{ path: 'sidebar', component: Sidebarpaciente  } 
];
