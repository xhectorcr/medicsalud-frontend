import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface MedicoFromApi {
    id: number;
    especialidad: string;
    estado: boolean;
    dni: number;
    usuario: {
        id: number;
        nombre: string;
        apellido: string;
        email: string;
        telefono: string | null;
    };
    sede: any;
}

@Injectable({
    providedIn: 'root'
})
export class AdminMedicosService {
    private medicosCache: MedicoFromApi[] = [];

    async getMedicos(forceRefresh: boolean = false): Promise<MedicoFromApi[]> {
        if (this.medicosCache.length > 0 && !forceRefresh) {
            return this.medicosCache;
        }

        try {
            const response = await api.get<MedicoFromApi[]>('/api/medicos/todos');
            this.medicosCache = response.data;
            return this.medicosCache;
        } catch (error) {
            throw error;
        }
    }
}
