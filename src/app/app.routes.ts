import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'auth/login', component: Login },
	{ path: 'auth/register', component: Register },
];
