export type AppointmentStatus =
  | 'pendiente'
  | 'confirmada'
  | 'reprogramada'
  | 'rechazada';

export interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  status: AppointmentStatus;
  image: string;
}
