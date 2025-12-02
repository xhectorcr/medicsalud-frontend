import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface PacientePerfil {
    id?: number;
    nombreUsuario?: string;
    dni?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    fotoPerfil?: string | null;
    rol?: string;
    estado?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PacientePerfilService {

    constructor() { }

    async getPerfil(dni?: string): Promise<PacientePerfil> {
        // Usamos el endpoint /me que retorna los datos del usuario autenticado
        const response = await api.get<PacientePerfil>('/api/pacientes/me');
        return response.data;
    }

    async updatePerfil(data: PacientePerfil): Promise<PacientePerfil> {
        const response = await api.put<PacientePerfil>('/api/pacientes/actualizar', data);
        return response.data;
    }
}
