import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../layout/header/header";
import { FooterComponent } from "../../layout/footer/footer";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen?: string;
  activo: boolean;
}

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-medicshop',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './medicshop.html',
  styleUrls: ['./medicshop.scss']
})
export class MedicShop implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'Todas';
  terminoBusqueda: string = '';

  carritoItems: CarritoItem[] = [];
  mostrarCarrito: boolean = false;
  cargando: boolean = true;

  vistaActual: 'grid' | 'list' = 'grid';

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCarrito();
  }

  cargarProductos(): void {
    this.cargando = true;

    // AQUÍ CONECTA CON TU SERVICIO QUE LLAMA AL BACKEND
    // Ejemplo:
    // this.productosService.getProductos().subscribe(data => {
    //   this.productos = data;
    //   this.productosFiltrados = data;
    //   this.extraerCategorias();
    //   this.cargando = false;
    // });

    // Datos de ejemplo mientras conectas:
    setTimeout(() => {
      this.productos = [
        {
          id: 1,
          nombre: 'Mascarilla Quirúrgica',
          descripcion: 'Caja con 50 unidades desechables',
          precio: 25.00,
          stock: 150,
          categoria: 'Protección',
          activo: true
        },
        {
          id: 2,
          nombre: 'Termómetro Digital',
          descripcion: 'Medición rápida y precisa',
          precio: 45.50,
          stock: 30,
          categoria: 'Dispositivos',
          activo: true
        },
        {
          id: 3,
          nombre: 'Alcohol en Gel 500ml',
          descripcion: 'Desinfectante antibacterial',
          precio: 18.00,
          stock: 8,
          categoria: 'Higiene',
          activo: true
        },
        {
          id: 4,
          nombre: 'Tensiómetro Digital',
          descripcion: 'Monitor de presión arterial',
          precio: 120.00,
          stock: 0,
          categoria: 'Dispositivos',
          activo: true
        }
      ];
      this.productosFiltrados = this.productos;
      this.extraerCategorias();
      this.cargando = false;
    }, 1000);
  }

  extraerCategorias(): void {
    const cats = new Set(this.productos.map(p => p.categoria));
    this.categorias = ['Todas', ...Array.from(cats)];
  }

  filtrarProductos(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const coincideCategoria = this.categoriaSeleccionada === 'Todas' ||
        p.categoria === this.categoriaSeleccionada;
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }

  agregarAlCarrito(producto: Producto): void {
    if (producto.stock > 0) {
      const itemExistente = this.carritoItems.find(item => item.producto.id === producto.id);

      if (itemExistente) {
        itemExistente.cantidad++;
      } else {
        this.carritoItems.push({ producto, cantidad: 1 });
      }

      this.guardarCarrito();
    }
  }

  eliminarDelCarrito(productoId: number): void {
    this.carritoItems = this.carritoItems.filter(item => item.producto.id !== productoId);
    this.guardarCarrito();
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad > 0) {
      const item = this.carritoItems.find(i => i.producto.id === productoId);
      if (item) {
        item.cantidad = cantidad;
        this.guardarCarrito();
      }
    } else {
      this.eliminarDelCarrito(productoId);
    }
  }

  toggleCarrito(): void {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  getTotal(): number {
    return this.carritoItems.reduce(
      (total, item) => total + (item.producto.precio * item.cantidad), 0
    );
  }

  getCantidadItems(): number {
    return this.carritoItems.reduce(
      (total, item) => total + item.cantidad, 0
    );
  }

  procesarCompra(): void {
    if (this.carritoItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // AQUÍ CONECTA CON TU BACKEND PARA PROCESAR LA COMPRA
    console.log('Procesando compra:', this.carritoItems);
    alert(`Compra procesada: Total S/. ${this.getTotal().toFixed(2)}`);

    // Vaciar carrito después de comprar
    // this.carritoItems = [];
    // this.guardarCarrito();
    // this.mostrarCarrito = false;
  }

  cambiarVista(vista: 'grid' | 'list'): void {
    this.vistaActual = vista;
  }

  private guardarCarrito(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
    }
  }

  private cargarCarrito(): void {
    if (typeof localStorage !== 'undefined') {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carritoItems = JSON.parse(carritoGuardado);
      }
    }
  }
}