import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebarpaciente } from '../../../layout/sidebar/paciente/paciente';
import { RecetasService, RecetaBackend } from './recetas.service';

interface Receta {
  id: number;
  medicamento: string;
  dosis: string;
  fecha: string;
  medico: string;
}

@Component({
  selector: 'app-pacienterecetas',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebarpaciente],
  templateUrl: './recetas.html',
  styleUrls: ['./recetas.scss']
})
export class Pacienterecetas implements OnInit {

  recetas: Receta[] = [];
  loading = true;
  error?: string;

  // Buscador
  searchTerm = '';

  constructor(
    private recetasService: RecetasService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarRecetas();
  }

  /**
   * Llamada al backend para obtener recetas del paciente actual.
   */
  private async cargarRecetas(): Promise<void> {
    this.loading = true;
    this.error = undefined;

    try {
      const data = await this.recetasService.getRecetasPaciente();

      this.recetas = data.map(r => ({
        id: r.id,
        medicamento: r.medicamentoNombre,
        dosis: r.dosis,
        fecha: r.fechaCreacion.slice(0, 10), // yyyy-MM-dd
        medico: r.medicoNombre
      }));

      this.loading = false;
      this.cd.detectChanges(); // Force update

    } catch (err) {
      console.error('Error al cargar recetas', err);
      this.error = 'No se pudieron cargar tus recetas. Intenta nuevamente.';
      this.loading = false;
      this.cd.detectChanges(); // Force update
    }
  }

  /**
   * Getter que devuelve las recetas filtradas según el buscador.
   */
  get filteredRecetas(): Receta[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.recetas;

    return this.recetas.filter(r =>
      r.medicamento.toLowerCase().includes(term) ||
      r.medico.toLowerCase().includes(term) ||
      r.dosis.toLowerCase().includes(term) ||
      r.fecha.toLowerCase().includes(term)
    );
  }

  /**
   * Acción al ver una receta
   */
  verReceta(receta: Receta): void {
    console.log('Ver receta:', receta);
    // Aquí luego puedes abrir un modal con indicaciones completas
  }

  /**
   * Acción crear nueva receta
   */
  nuevaReceta(): void {
    console.log('Crear nueva receta');
    // Solo para médicos — luego lo manejas
  }
}
