import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebarmedicos } from '../../../layout/sidebar/medicos/medicos';
import { api } from '../../../core/http/axios-instance';

interface Horario {
    id?: number;
    fecha: string; // YYYY-MM-DD
    horaInicio: string; // HH:mm:ss
    horaFin: string; // HH:mm:ss
    estado?: string;
    medicoDni?: string;
}

@Component({
    selector: 'app-medico-horarios',
    standalone: true,
    imports: [CommonModule, FormsModule, Sidebarmedicos],
    templateUrl: './horarios.html',
    styleUrls: ['./horarios.scss']
})
export class Medicohorarios implements OnInit {
    horarios: Horario[] = [];
    loading = false;

    // Nuevo horario
    nuevoHorario: Horario = {
        fecha: '',
        horaInicio: '08:00',
        horaFin: '12:00'
    };

    editingId: number | null = null;

    // Generar horas para select (cada 30 min)
    horasDisponibles: string[] = [];

    constructor(private cdr: ChangeDetectorRef) {
        this.generateTimeSlots();
        // Inicializar fecha con hoy
        const today = new Date();
        this.nuevoHorario.fecha = today.toISOString().split('T')[0];
    }

    ngOnInit(): void {
        this.loadHorarios();
    }

    generateTimeSlots() {
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            this.horasDisponibles.push(`${hour}:00`);
            this.horasDisponibles.push(`${hour}:30`);
        }
    }

    async loadHorarios() {
        this.loading = true;
        try {
            const response = await api.get<Horario[]>('/api/horarios/medico');
            this.horarios = response.data;
        } catch (error) {
            console.error('Error cargando horarios', error);
            this.horarios = [];
        } finally {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    resetForm() {
        const today = new Date();
        this.nuevoHorario = {
            fecha: today.toISOString().split('T')[0],
            horaInicio: '08:00',
            horaFin: '12:00'
        };
        this.editingId = null;
    }

    iniciarEdicion(horario: Horario) {
        this.editingId = horario.id!;
        // Asegurar formato HH:mm para el select (quitar segundos si vienen)
        const inicio = horario.horaInicio.substring(0, 5);
        const fin = horario.horaFin.substring(0, 5);

        this.nuevoHorario = {
            ...horario,
            horaInicio: inicio,
            horaFin: fin
        };
    }

    cancelarEdicion() {
        this.resetForm();
    }

    async guardarHorario() {
        if (this.nuevoHorario.horaInicio >= this.nuevoHorario.horaFin) {
            alert('La hora de inicio debe ser menor a la hora de fin');
            return;
        }

        // Formatear payload para enviar HH:mm:ss
        const payload = {
            fecha: this.nuevoHorario.fecha,
            horaInicio: this.nuevoHorario.horaInicio.length === 5 ? `${this.nuevoHorario.horaInicio}:00` : this.nuevoHorario.horaInicio,
            horaFin: this.nuevoHorario.horaFin.length === 5 ? `${this.nuevoHorario.horaFin}:00` : this.nuevoHorario.horaFin
        };

        try {
            if (this.editingId) {
                // Actualizar (PUT)
                await api.put(`/api/horarios/${this.editingId}`, payload);
                alert('Horario actualizado correctamente');
            } else {
                // Crear (POST)
                await api.post('/api/horarios', payload);
                alert('Horario agregado correctamente');
            }

            await this.loadHorarios();
            this.resetForm();
        } catch (error) {
            console.error('Error guardando horario', error);
            alert('No se pudo guardar el horario');
        }
    }

    async eliminarHorario(id: number | undefined) {
        if (!id) return;
        if (!confirm('¿Estás seguro de eliminar este horario?')) return;

        try {
            await api.delete(`/api/horarios/${id}`);
            await this.loadHorarios();
            alert('Horario eliminado correctamente');
        } catch (error) {
            console.error('Error eliminando horario', error);
            alert('No se pudo eliminar el horario');
        }
    }
}
