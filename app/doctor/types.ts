import { Timestamp } from "firebase/firestore";

export interface Appointment {
  id: string;
  date: Timestamp;
  patientName: string;
  status: string;
  patientId: string;
  doctorId: string;
  createdAt: Timestamp;
}

export interface Patient {
  id: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
}
