import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';
import { MedicamentoService, Medicamento, CrearMedicamentoDTO } from './services/medicamento.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './medicamentos.html',
  styleUrls: ['./medicamentos.scss']
})
export class Adminmedicamentos implements OnInit {
  medicamentos: Medicamento[] = [];
  mostrarModal = false;
  modoEdicion = false;
  medicamentoActual: Medicamento = this.inicializarMedicamento();
  loading = false;

  constructor(private medicamentoService: MedicamentoService) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  async cargarMedicamentos() {
    this.loading = true;
    try {
      this.medicamentos = await this.medicamentoService.getMedicamentosActivos();
    } catch (error) {
      console.error('Error cargando medicamentos:', error);
      alert('Error al cargar la lista de medicamentos');
    } finally {
      this.loading = false;
    }
  }

  inicializarMedicamento(): Medicamento {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      precioVenta: 0,
      codigoBarras: '',
      requiereReceta: false,
      estado: true
    };
  }

  abrirModalNuevo(): void {
    this.medicamentoActual = this.inicializarMedicamento();
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(med: Medicamento): void {
    this.medicamentoActual = { ...med };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.medicamentoActual = this.inicializarMedicamento();
  }

  async guardarMedicamento() {
    if (!this.medicamentoActual.nombre || this.medicamentoActual.precioVenta < 0) {
      alert('Por favor complete los campos obligatorios correctamente');
      return;
    }

    const dto: CrearMedicamentoDTO = {
      nombre: this.medicamentoActual.nombre,
      descripcion: this.medicamentoActual.descripcion,
      precioVenta: this.medicamentoActual.precioVenta,
      codigoBarras: this.medicamentoActual.codigoBarras,
      requiereReceta: this.medicamentoActual.requiereReceta
    };

    try {
      if (this.modoEdicion) {
        await this.medicamentoService.actualizarMedicamento(this.medicamentoActual.id, dto);
        alert('Medicamento actualizado correctamente');
      } else {
        await this.medicamentoService.crearMedicamento(dto);
        alert('Medicamento creado correctamente');
      }
      this.cerrarModal();
      this.cargarMedicamentos();
    } catch (error) {
      console.error('Error guardando medicamento:', error);
      alert('Error al guardar el medicamento');
    }
  }

  async eliminarMedicamento(id: number) {
    if (confirm('¿Está seguro de eliminar este medicamento?')) {
      try {
        await this.medicamentoService.eliminarMedicamento(id);
        alert('Medicamento eliminado correctamente');
        this.cargarMedicamentos();
      } catch (error) {
        console.error('Error eliminando medicamento:', error);
        alert('Error al eliminar el medicamento');
      }
    }
  }
}