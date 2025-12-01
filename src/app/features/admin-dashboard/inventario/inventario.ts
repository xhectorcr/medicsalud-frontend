import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';

interface ItemInventario {
    id: number;
    nombre: string;
    sede: string;
    stock: number;
}

@Component({
    selector: 'app-inventario',
    standalone: true,
    imports: [CommonModule, FormsModule, Sidebaradmin],
    templateUrl: './inventario.html',
    styleUrls: ['./inventario.scss']
})
export class Admininventario {
    constructor() {
        console.log('Admininventario initialized');
    }

    inventario: ItemInventario[] = [
        { id: 1, nombre: 'Paracetamol 500mg', sede: 'Sede Central', stock: 150 },
        { id: 2, nombre: 'Ibuprofeno 400mg', sede: 'Sede Norte', stock: 85 },
        { id: 3, nombre: 'Amoxicilina 500mg', sede: 'Sede Central', stock: 45 },
        { id: 4, nombre: 'Omeprazol 20mg', sede: 'Sede Sur', stock: 120 },
        { id: 5, nombre: 'Losartán 50mg', sede: 'Sede Este', stock: 10 }
    ];

    sedes = ['Sede Central', 'Sede Norte', 'Sede Sur', 'Sede Este', 'Sede Oeste'];

    mostrarModal = false;
    modoEdicion = false;

    // Objeto para el formulario
    itemActual: ItemInventario = {
        id: 0,
        nombre: '',
        sede: '',
        stock: 0
    };

    // Filtros
    filtroNombre = '';
    filtroSede = '';

    // Getter para filtrar la lista
    get inventarioFiltrado(): ItemInventario[] {
        return this.inventario.filter(item => {
            const coincideNombre = item.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
            const coincideSede = this.filtroSede === '' || item.sede === this.filtroSede;
            return coincideNombre && coincideSede;
        });
    }

    // Getter para el stock total (simple suma)
    get totalStock(): number {
        return this.inventarioFiltrado.reduce((acc, item) => acc + item.stock, 0);
    }

    // Métodos del Modal
    abrirModalNuevo(): void {
        this.itemActual = {
            id: 0,
            nombre: '',
            sede: '',
            stock: 0
        };
        this.modoEdicion = false;
        this.mostrarModal = true;
    }

    abrirModalEditar(item: ItemInventario): void {
        // Copia del item para no modificar directamente la tabla hasta guardar
        this.itemActual = { ...item };
        this.modoEdicion = true;
        this.mostrarModal = true;
    }

    cerrarModal(): void {
        this.mostrarModal = false;
    }

    guardarItem(): void {
        if (!this.itemActual.nombre || !this.itemActual.sede || this.itemActual.stock < 0) {
            alert('Por favor complete todos los campos correctamente');
            return;
        }

        if (this.modoEdicion) {
            // Editar existente
            const index = this.inventario.findIndex(i => i.id === this.itemActual.id);
            if (index !== -1) {
                this.inventario[index] = { ...this.itemActual };
            }
        } else {
            // Crear nuevo
            const nuevoId = this.inventario.length > 0
                ? Math.max(...this.inventario.map(i => i.id)) + 1
                : 1;
            this.inventario.push({ ...this.itemActual, id: nuevoId });
        }

        this.cerrarModal();
    }

    eliminarItem(id: number): void {
        if (confirm('¿Está seguro de eliminar este medicamento?')) {
            this.inventario = this.inventario.filter(i => i.id !== id);
        }
    }

    limpiarFiltros(): void {
        this.filtroNombre = '';
        this.filtroSede = '';
    }
}