import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoHorariosService, HorarioBackend } from './medico-horarios.service';
import { ReservaService, ReservaResponse } from './reserva.service';

type SlotStatus = 'available' | 'booked';

interface Slot {
  id: number;
  time: string;
  horaInicio: string;
  horaFin: string;
  status: SlotStatus;
}

@Component({
  standalone: true,
  selector: 'app-paciente-medico-availability',
  templateUrl: './paciente-medico-availability.component.html',
  styleUrls: ['./paciente-medico-availability.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class PacienteMedicoAvailabilityComponent implements OnInit {

  selectedDate = '';
  activeFilter: 'all' | SlotStatus = 'all';

  loading = false;
  errorMessage = '';

  correoMedico = '';

  medicoDni!: number;
  pacienteDni!: number;
  sedeId: number = 1;

  doctor = {
    name: '',
    speciality: '',
    clinic: '',
    photoUrl: ''
  };

  slots: Slot[] = [];

  showPaymentModal = false;
  paymentProcessing = false;
  selectedSlotForPayment: Slot | null = null;

  paymentInfo = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    amount: 50.00
  };

  showSuccessModal = false;
  ultimaReserva: ReservaResponse | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private horariosService: MedicoHorariosService,
    private reservaService: ReservaService
  ) { }

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().substring(0, 10);

    this.route.queryParams.subscribe(async (params) => {
      this.correoMedico = params['correo'] ?? '';
      this.doctor.name = params['nombre'] ?? '';
      this.doctor.speciality = params['especialidad'] ?? '';
      this.doctor.photoUrl = params['foto'] ?? '';
      this.doctor.clinic = params['clinica'] ?? '';

      this.medicoDni = Number(params['medicoDni']);
      this.pacienteDni = Number(localStorage.getItem('dniPaciente'));
      this.sedeId = Number(params['sedeId'] ?? 1);

      if (!this.correoMedico) {
        this.errorMessage = 'No se pudo identificar al médico.';
        return;
      }

      await this.cargarHorarios();
    });
  }

  async cargarHorarios(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const data: HorarioBackend[] =
        await this.horariosService.getHorariosPorCorreo(this.correoMedico);

      if (data.length > 0 && data[0].medicoDni) {
        this.medicoDni = typeof data[0].medicoDni === 'string'
          ? parseInt(data[0].medicoDni, 10)
          : data[0].medicoDni;
      }

      this.slots = data.map((h) => ({
        id: h.id,
        time: `${h.horaInicio} - ${h.horaFin}`,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        status: 'available'
      }));
    } catch (err: any) {
      this.errorMessage =
        err?.response?.data?.message || 'No se pudieron cargar los horarios del médico.';
    } finally {
      this.loading = false;
    }
  }

  get filteredSlots(): Slot[] {
    if (this.activeFilter === 'all') return this.slots;
    return this.slots.filter((s) => s.status === this.activeFilter);
  }

  setFilter(filter: 'all' | SlotStatus): void {
    this.activeFilter = filter;
  }

  getStatusLabel(status: SlotStatus): string {
    if (status === 'available') return 'Disponible';
    if (status === 'booked') return 'Ocupado';
    return status;
  }

  onBack(): void {
    this.router.navigate(['/paciente/medicos']);
  }

  async onReserve(slot: Slot): Promise<void> {
    if (slot.status !== 'available') return;

    if (!this.medicoDni || !this.selectedDate) {
      this.errorMessage = 'Datos incompletos para realizar la reserva.';
      return;
    }

    this.selectedSlotForPayment = slot;
    this.showPaymentModal = true;
  }

  async agendarDirecto(slot: Slot): Promise<void> {
    if (slot.status !== 'available') return;

    if (!this.medicoDni || !this.selectedDate) {
      this.errorMessage = 'Datos incompletos para agendar la cita.';
      return;
    }

    const confirmar = confirm(`¿Confirmar cita para ${this.selectedDate} a las ${slot.horaInicio}?`);

    if (!confirmar) return;

    this.loading = true;

    const payload = {
      medicoDni: this.medicoDni,
      sedeId: this.sedeId,
      fechaCita: this.selectedDate,
      horaCita: slot.horaInicio
    };

    try {
      const reservaPromise = this.reservaService.crearReserva(payload);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      const reserva = await Promise.race([reservaPromise, timeoutPromise]) as ReservaResponse;

      slot.status = 'booked';
      this.ultimaReserva = reserva;
      this.showSuccessModal = true;

    } catch (err: any) {
      this.errorMessage = err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'No se pudo agendar la cita.';
    } finally {
      this.loading = false;
    }
  }

  async processPayment(): Promise<void> {
    if (!this.paymentInfo.cardNumber || !this.paymentInfo.cardHolder ||
      !this.paymentInfo.expiryDate || !this.paymentInfo.cvv) {
      this.errorMessage = 'Por favor completa todos los campos de pago.';
      return;
    }

    if (this.paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      this.errorMessage = 'El número de tarjeta debe tener 16 dígitos.';
      return;
    }

    if (this.paymentInfo.cvv.length !== 3) {
      this.errorMessage = 'El CVV debe tener 3 dígitos.';
      return;
    }

    this.paymentProcessing = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.createReservation();
  }

  async createReservation(): Promise<void> {
    if (!this.selectedSlotForPayment) return;

    const payload = {
      medicoDni: this.medicoDni,
      sedeId: this.sedeId,
      fechaCita: this.selectedDate,
      horaCita: this.selectedSlotForPayment.horaInicio
    };

    try {
      const reservaPromise = this.reservaService.crearReserva(payload);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      const reserva = await Promise.race([reservaPromise, timeoutPromise]) as ReservaResponse;

      this.selectedSlotForPayment.status = 'booked';
      this.ultimaReserva = reserva;

      this.showPaymentModal = false;
      this.paymentProcessing = false;
      this.showSuccessModal = true;

      this.paymentInfo = {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        amount: 50.00
      };
      this.selectedSlotForPayment = null;

    } catch (err: any) {
      this.paymentProcessing = false;
      this.showPaymentModal = false;
      this.selectedSlotForPayment = null;

      this.errorMessage = err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'No se pudo completar la reserva.';

      this.paymentInfo = {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        amount: 50.00
      };
    }
  }

  cancelPayment(): void {
    this.showPaymentModal = false;
    this.paymentProcessing = false;
    this.selectedSlotForPayment = null;
    this.paymentInfo = {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      amount: 50.00
    };
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentInfo.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentInfo.expiryDate = value;
  }

  closeModal(): void {
    this.showSuccessModal = false;
  }

  goToMisCitas(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/paciente/reservas']);
  }
}
