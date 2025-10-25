import { Routes } from '@angular/router';


import { HomeComponent } from './pages/home/home';
import { Pacientemedico } from './features/paciente-dashboard/medicos/medicos';
import { Pacienteperfil } from './features/paciente-dashboard/perfil/perfil';
import { Sidebarpaciente } from './layout/sidebar/paciente/paciente';
import { Sidebarmedicos } from './layout/sidebar/medicos/medicos';
import { Sidebaradmin } from './layout/sidebar/admin/admin';
import { Medicoscitas } from './features/medico-dashboard/citas/citas';
import { Pacientecitas } from './features/paciente-dashboard/citas/citas';
import { Pacienterecetas } from './features/paciente-dashboard/recetas/recetas';
import { Especialistas } from './pages/especialistas/especialistas';
import { Servicios } from './pages/servicios/servicios';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [

	// Public
	{ path: '', component: HomeComponent },
	{ path: 'servicios', component: Servicios },
	{ path: 'especialistas', component: Especialistas },

	// Auth
	{ path: 'auth/login', component: Login },
	{ path: 'auth/register', component: Register },

	//Paciente
	{ path: 'paciente/medicos', component: Pacientemedico },
	{ path: 'paciente/citas', component: Pacientecitas },
	{ path: 'paciente/recetas', component: Pacienterecetas },
	{ path: 'paciente/perfil', component: Pacienteperfil },

	//Medico
	{ path: 'medicos/citas', component: Medicoscitas },

	{ path: 'sidebar', component: Sidebarpaciente  },
	{ path: 'sidebarmedicos', component: Sidebarmedicos  },
	{ path: 'sidebaradmin', component: Sidebaradmin }

];
