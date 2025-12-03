import { Injectable } from '@angular/core';
import { api } from '../../../../core/http/axios-instance';

export interface InventarioItem {
    id: number;
    sedeId: number;
    sedeNombre: string;
    medicamentoId: number;
    medicamentoNombre: string;
    stock: number;
    estado: boolean;
}

export interface AgregarInventarioDTO {
    sedeId: number;
    codigoBarras: string;
    cantidad: number;
}

@Injectable({
    providedIn: 'root'
})
export class InventarioService {
    private readonly BASE_URL = '/api/inventarios';

    async getInventarioActivo(): Promise<InventarioItem[]> {
        try {
            const response = await api.get<InventarioItem[]>(`${this.BASE_URL}/activos`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener inventario:', error);
            throw error;
        }
    }

    async agregarInventario(dto: AgregarInventarioDTO): Promise<void> {
        try {
            await api.post(`${this.BASE_URL}/agregar`, dto);
        } catch (error) {
            console.error('Error al agregar inventario:', error);
            throw error;
        }
    }
}
