import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebaradmin } from '../../../layout/sidebar/admin/admin';

interface Medicamento {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  codigoBarras: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebaradmin],
  templateUrl: './medicamentos.html',
  styleUrls: ['./medicamentos.scss']
})
export class Adminmedicamentos {
  medicamentos: Medicamento[] = [
    {
      id: 1,
      nombre: 'Paracetamol 500mg',
      descripcion: 'Analgésico y antipirético',
      precio: 12.50,
      codigoBarras: '7501234567890'
    },
    {
      id: 2,
      nombre: 'Ibuprofeno 400mg',
      descripcion: 'Antiinflamatorio no esteroideo',
      precio: 18.00,
      codigoBarras: '7501234567891'
    }
  ];

  mostrarModal = false;
  modoEdicion = false;
  medicamentoActual: Medicamento = this.inicializarMedicamento();

  inicializarMedicamento(): Medicamento {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      codigoBarras: ''
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

  guardarMedicamento(): void {
    if (!this.medicamentoActual.nombre || !this.medicamentoActual.precio) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    if (this.modoEdicion) {
      const index = this.medicamentos.findIndex(m => m.id === this.medicamentoActual.id);
      if (index !== -1) {
        this.medicamentos[index] = { ...this.medicamentoActual };
      }
    } else {
      const nuevoId = this.medicamentos.length > 0
        ? Math.max(...this.medicamentos.map(m => m.id)) + 1
        : 1;
      this.medicamentos.push({ ...this.medicamentoActual, id: nuevoId });
    }

    this.cerrarModal();
  }

  eliminarMedicamento(id: number): void {
    if (confirm('¿Está seguro de eliminar este medicamento?')) {
      this.medicamentos = this.medicamentos.filter(m => m.id !== id);
    }
  }
}