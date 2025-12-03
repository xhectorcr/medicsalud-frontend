import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';
import { InventarioService, InventarioItem, AgregarInventarioDTO } from './services/inventario.service';
import { MedicamentoService, Medicamento } from '../medicamentos/services/medicamento.service';

@Component({
    selector: 'app-inventario',
    standalone: true,
    imports: [CommonModule, FormsModule, Sidebaradmin],
    templateUrl: './inventario.html',
    styleUrls: ['./inventario.scss']
})
export class Admininventario implements OnInit {
    inventario: InventarioItem[] = [];
    medicamentos: Medicamento[] = [];

    mostrarModal = false;
    loading = false;

    // Objeto para el formulario
    nuevoItem = {
        medicamentoId: 0,
        cantidad: 0
    };

    // Filtros
    filtroNombre = '';
    filtroSede = '';

    constructor(
        private inventarioService: InventarioService,
        private medicamentoService: MedicamentoService
    ) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    async cargarDatos() {
        this.loading = true;
        try {
            const [inventarioData, medicamentosData] = await Promise.all([
                this.inventarioService.getInventarioActivo(),
                this.medicamentoService.getMedicamentosActivos()
            ]);
            this.inventario = inventarioData;
            this.medicamentos = medicamentosData;
        } catch (error) {
            console.error('Error cargando datos:', error);
            alert('Error al cargar los datos del inventario');
        } finally {
            this.loading = false;
        }
    }

    // Getter para filtrar la lista
    get inventarioFiltrado(): InventarioItem[] {
        return this.inventario.filter(item => {
            const coincideNombre = item.medicamentoNombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
            const coincideSede = this.filtroSede === '' || item.sedeNombre === this.filtroSede;
            return coincideNombre && coincideSede;
        });
    }

    // Getter para obtener sedes únicas para el filtro
    get sedes(): string[] {
        return [...new Set(this.inventario.map(item => item.sedeNombre))];
    }

    abrirModalNuevo(): void {
        this.nuevoItem = {
            medicamentoId: 0,
            cantidad: 0
        };
        this.mostrarModal = true;
    }

    cerrarModal(): void {
        this.mostrarModal = false;
    }

    async guardarItem() {
        if (!this.nuevoItem.medicamentoId || this.nuevoItem.cantidad <= 0) {
            alert('Por favor seleccione un medicamento y una cantidad válida');
            return;
        }

        const medicamentoSeleccionado = this.medicamentos.find(m => m.id == this.nuevoItem.medicamentoId);
        if (!medicamentoSeleccionado) {
            alert('Medicamento no válido');
            return;
        }

        const dto: AgregarInventarioDTO = {
            sedeId: 1, // Hardcoded as requested
            codigoBarras: medicamentoSeleccionado.codigoBarras,
            cantidad: this.nuevoItem.cantidad
        };

        try {
            await this.inventarioService.agregarInventario(dto);
            alert('Stock agregado correctamente');
            this.cerrarModal();
            this.cargarDatos();
        } catch (error) {
            console.error('Error agregando stock:', error);
            alert('Error al agregar stock al inventario');
        }
    }

    eliminarItem(id: number): void {
        // Implementar si existe endpoint de eliminar inventario, por ahora solo alerta
        alert('Funcionalidad de eliminar inventario no disponible en API por el momento');
    }

    limpiarFiltros(): void {
        this.filtroNombre = '';
        this.filtroSede = '';
    }
}