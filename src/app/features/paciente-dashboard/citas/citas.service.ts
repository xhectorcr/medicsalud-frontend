import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ReservaResponseDTO {
    id: number;
    nombreMedico: string;
    especialidadMedico: string;
    fechaCita: string;
    horaCita: string;
    estadoCita: string;
    fotoMedicoUrl?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class CitasService {
    private citasCache: Map<number, ReservaResponseDTO[]> = new Map();

    constructor(private http: HttpClient) { }

    getCitasPaciente(pacienteId: number, forceRefresh: boolean = false): Observable<ReservaResponseDTO[]> {
        if (this.citasCache.has(pacienteId) && !forceRefresh) {
            return of(this.citasCache.get(pacienteId)!);
        }

        const url = `http://localhost:8080/api/reservas/paciente/${pacienteId}`;
        return this.http.get<ReservaResponseDTO[]>(url).pipe(
            tap(data => this.citasCache.set(pacienteId, data))
        );
    }
}
