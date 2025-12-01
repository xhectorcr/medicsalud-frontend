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
import { Medicohistorial } from './features/medico-dashboard/historial/historial';
import { Medicoperfil } from './features/medico-dashboard/perfil/perfil';
import { Admingestiongeneral } from './features/admin-dashboard/gestiongeneral/gestiongeneral';
import { Adminmedicos } from './features/admin-dashboard/medicos/medicos';
import { Adminpaciente } from './features/admin-dashboard/paciente/paciente';
import { Adminperfil } from './features/admin-dashboard/perfil/perfil';
import { MedicShop } from './pages/medicshop/medicshop';
import { Adminmedicamentos } from './features/admin-dashboard/medicamentos/medicamentos';
import { Admininventario } from './features/admin-dashboard/inventario/inventario';
export const routes: Routes = [

	// Public
	{ path: '', component: HomeComponent },
	{ path: 'servicios', component: Servicios },
	{ path: 'especialistas', component: Especialistas },
	{ path: 'medicshop', component: MedicShop },


	// Auth
	{ path: 'auth/login', component: Login },
	{ path: 'auth/register', component: Register },

	//Admin
	{ path: 'admin/gestiongeneral', component: Admingestiongeneral },
	{ path: 'admin/paciente', component: Adminpaciente },
	{ path: 'admin/medicos', component: Adminmedicos },
	{ path: 'admin/perfil', component: Adminperfil },
	{ path: 'admin/medicamentos', component: Adminmedicamentos },
	{ path: 'admin/inventario', component: Admininventario }, // Inventory route

	//Medico
	{ path: 'medicos/citas', component: Medicoscitas },
	{ path: 'medicos/historialpaciente', component: Medicohistorial },
	{ path: 'medicos/perfil', component: Medicoperfil },

	//Paciente
	{ path: 'paciente/medicos', component: Pacientemedico },
	{ path: 'paciente/citas', component: Pacientecitas },
	{ path: 'paciente/recetas', component: Pacienterecetas },
	{ path: 'paciente/perfil', component: Pacienteperfil },



	{ path: 'sidebar', component: Sidebarpaciente },
	{ path: 'sidebarmedicos', component: Sidebarmedicos },
	{ path: 'sidebaradmin', component: Sidebaradmin }

];
