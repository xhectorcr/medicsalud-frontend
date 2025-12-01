import { Injectable } from '@angular/core';
import { api } from '../../../core/http/axios-instance';

export interface RecetaBackend {
    id: number;
    pacienteId: number;
    pacienteNombre: string;
    medicoId: number;
    medicoNombre: string;
    medicamentoId: number;
    medicamentoNombre: string;
    dosis: string;
    indicaciones: string;
    fechaCreacion: string;
}

@Injectable({
    providedIn: 'root'
})
export class RecetasService {
    private recetasCache: RecetaBackend[] = [];

    async getRecetasPaciente(forceRefresh: boolean = false): Promise<RecetaBackend[]> {
        if (this.recetasCache.length > 0 && !forceRefresh) {
            return this.recetasCache;
        }

        try {
            const resp = await api.get<RecetaBackend[]>('/api/recetas/paciente/me');
            this.recetasCache = resp.data;
            return this.recetasCache;
        } catch (error) {
            throw error;
        }
    }
}
