import { Injectable } from '@angular/core';
import { api } from '../../../../core/http/axios-instance';

export interface Medicamento {
    id: number;
    nombre: string;
    descripcion: string;
    precioVenta: number;
    codigoBarras: string;
    requiereReceta: boolean;
    estado: boolean;
}

export interface CrearMedicamentoDTO {
    nombre: string;
    descripcion: string;
    precioVenta: number;
    codigoBarras: string;
    requiereReceta: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MedicamentoService {
    private readonly BASE_URL = '/api/medicamentos';

    async getMedicamentosActivos(): Promise<Medicamento[]> {
        try {
            const response = await api.get<Medicamento[]>(`${this.BASE_URL}/lista/activos`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener medicamentos:', error);
            throw error;
        }
    }

    async crearMedicamento(medicamento: CrearMedicamentoDTO): Promise<Medicamento> {
        try {
            const response = await api.post<Medicamento>(this.BASE_URL, medicamento);
            return response.data;
        } catch (error) {
            console.error('Error al crear medicamento:', error);
            throw error;
        }
    }

    async actualizarMedicamento(id: number, medicamento: CrearMedicamentoDTO): Promise<Medicamento> {
        try {
            const response = await api.put<Medicamento>(`${this.BASE_URL}/${id}`, medicamento);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar medicamento:', error);
            throw error;
        }
    }

    async eliminarMedicamento(id: number): Promise<void> {
        try {
            await api.delete(`${this.BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error al eliminar medicamento:', error);
            throw error;
        }
    }
}
