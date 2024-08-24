// app/patients/utils.ts

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

export interface MedicalRecord {
  date: string;
  description: string;
}

export interface Patient {
  uid: string;
  email: string;
  displayName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: Timestamp;
}

export interface Appointment {
  id: string;
  date: Timestamp;
  status: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

export interface ClinicRequest {
  id: string;
  patientId: string;
  patientName: string;
  contactPhone: string;
  contactEmail: string;
  preferredDate: Timestamp;
  reason: string;
  primaryCarePhysicianId: string | null;
  status: "pending" | "approved" | "scheduled" | "completed" | "cancelled";
  statusLastUpdated: Timestamp;
  medicalRecordLink: string;
  urgency: "routine" | "urgent" | "emergency";
  additionalNotes: string;
  createdAt: Timestamp;
}

export const fetchPatientData = async (
  userId: string
): Promise<Patient | null> => {
  try {
    const patientRef = doc(db, "patients", userId);
    const patientSnap = await getDoc(patientRef);
    if (patientSnap.exists()) {
      return patientSnap.data() as Patient;
    } else {
      console.log("No patient data found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    toast({
      title: "Error",
      description: "Failed to fetch patient data. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchVisitCount = async (userId: string): Promise<number> => {
  try {
    const visitsRef = collection(db, "visits");
    const q = query(visitsRef, where("patientId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching visit count:", error);
    toast({
      title: "Error",
      description: "Failed to fetch visit count. Please try again later.",
      variant: "destructive",
    });
    return 0;
  }
};

export const fetchRecentRecords = async (
  userId: string
): Promise<MedicalRecord[]> => {
  try {
    const recordsRef = collection(db, "medicalRecords");
    const q = query(
      recordsRef,
      where("patientId", "==", userId),
      orderBy("date", "desc"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        date: data.date.toDate().toLocaleString(),
        description: data.description,
      };
    });
  } catch (error) {
    console.error("Error fetching recent records:", error);
    toast({
      title: "Error",
      description:
        "Failed to fetch recent medical records. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchAppointments = async (
  userId: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const q = query(
      appointmentsRef,
      where("patientId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Appointment)
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast({
      title: "Error",
      description: "Failed to fetch appointments. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const doctorsRef = collection(db, "doctors");
    const querySnapshot = await getDocs(doctorsRef);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Doctor)
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    toast({
      title: "Error",
      description: "Failed to fetch doctors. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const scheduleAppointment = async (
  userId: string,
  patientName: string,
  date: Date,
  selectedTime: string,
  selectedDoctor: string
): Promise<boolean> => {
  try {
    const appointmentDateTime = new Date(date);
    const [hours, minutes] = selectedTime.split(":");
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const appointmentsRef = collection(db, "appointments");
    const newAppointment = {
      date: Timestamp.fromDate(appointmentDateTime),
      patientId: userId,
      patientName: patientName,
      doctorId: selectedDoctor,
      status: "scheduled",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(appointmentsRef, newAppointment);

    console.log("Appointment scheduled with ID: ", docRef.id);

    toast({
      title: "Appointment Scheduled",
      description: `Your appointment has been scheduled for ${appointmentDateTime.toLocaleString()}.`,
    });

    return true;
  } catch (e) {
    console.error("Error scheduling appointment: ", e);
    toast({
      title: "Error",
      description:
        "There was an error scheduling your appointment. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

export const requestClinic = async (
  userId: string,
  patientName: string,
  contactPhone: string,
  contactEmail: string,
  preferredDate: Date,
  reason: string,
  primaryCarePhysicianId: string | null,
  urgency: "routine" | "urgent" | "emergency",
  additionalNotes: string
): Promise<void> => {
  try {
    // Check for existing pending requests
    const existingRequests = await checkExistingRequests(userId);
    if (existingRequests > 0) {
      toast({
        title: "Existing Request",
        description:
          "You already have a pending clinic request. Please wait for a response.",
        variant: "default",
      });
      return;
    }

    // Validate inputs
    if (!validateInputs(contactPhone, contactEmail, preferredDate)) {
      return;
    }

    // Check rate limiting
    if (!checkRateLimit(userId)) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before submitting another request.",
        variant: "destructive",
      });
      return;
    }

    const clinicRequestsRef = collection(db, "clinicRequests");
    const newRequest: Omit<ClinicRequest, "id"> = {
      patientId: userId,
      patientName: patientName,
      contactPhone,
      contactEmail,
      preferredDate: Timestamp.fromDate(preferredDate),
      reason,
      primaryCarePhysicianId,
      status: "pending",
      statusLastUpdated: Timestamp.now(),
      medicalRecordLink: `/patients/${userId}/medical-record`,
      urgency,
      additionalNotes,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(clinicRequestsRef, newRequest);

    console.log("Clinic request submitted successfully");

    // Send notifications
    await sendNotifications(userId, patientName, docRef.id);

    // Log the request
    await logClinicRequest(userId, docRef.id);

    toast({
      title: "Clinic Request Submitted",
      description:
        "Your request for a clinic has been submitted. We will contact you shortly.",
    });
  } catch (error) {
    console.error("Error requesting clinic:", error);
    toast({
      title: "Error",
      description:
        "There was an error submitting your clinic request. Please try again.",
      variant: "destructive",
    });
  }
};

const checkExistingRequests = async (userId: string): Promise<number> => {
  const clinicRequestsRef = collection(db, "clinicRequests");
  const q = query(
    clinicRequestsRef,
    where("patientId", "==", userId),
    where("status", "==", "pending")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

const validateInputs = (phone: string, email: string, date: Date): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    toast({
      title: "Invalid Phone Number",
      description: "Please enter a valid phone number.",
      variant: "destructive",
    });
    return false;
  }

  if (!emailRegex.test(email)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address.",
      variant: "destructive",
    });
    return false;
  }

  if (date <= new Date()) {
    toast({
      title: "Invalid Date",
      description: "Please select a future date for your appointment.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

const checkRateLimit = async (userId: string): Promise<boolean> => {
  const clinicRequestsRef = collection(db, "clinicRequests");
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const q = query(
    clinicRequestsRef,
    where("patientId", "==", userId),
    where("createdAt", ">=", Timestamp.fromDate(oneHourAgo))
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size < 3; // Allow up to 3 requests per hour
};

const sendNotifications = async (
  userId: string,
  patientName: string,
  requestId: string
): Promise<void> => {
  // This is a placeholder function. In a real application, you would integrate
  // with an email service or push notification system here.
  console.log(
    `Sending notification for clinic request ${requestId} by patient ${patientName}`
  );

  // Notify patient
  console.log(`Sending confirmation email to patient ${userId}`);

  // Notify staff
  console.log("Notifying relevant staff about new clinic request");
};

const logClinicRequest = async (
  userId: string,
  requestId: string
): Promise<void> => {
  const logsRef = collection(db, "clinicRequestLogs");
  await addDoc(logsRef, {
    userId,
    requestId,
    action: "created",
    timestamp: serverTimestamp(),
  });
};

export const updateClinicRequest = async (
  requestId: string,
  updates: Partial<ClinicRequest>
): Promise<void> => {
  try {
    const requestRef = doc(db, "clinicRequests", requestId);
    await updateDoc(requestRef, {
      ...updates,
      statusLastUpdated: serverTimestamp(),
    });

    console.log(`Clinic request ${requestId} updated successfully`);

    toast({
      title: "Request Updated",
      description: "Your clinic request has been updated successfully.",
    });

    // Log the update
    await logClinicRequest(updates.patientId!, requestId);
  } catch (error) {
    console.error("Error updating clinic request:", error);
    toast({
      title: "Error",
      description:
        "There was an error updating your clinic request. Please try again.",
      variant: "destructive",
    });
  }
};

export const fetchClinicRequests = async (
  userId: string
): Promise<ClinicRequest[]> => {
  try {
    const clinicRequestsRef = collection(db, "clinicRequests");
    const q = query(
      clinicRequestsRef,
      where("patientId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ClinicRequest)
    );
  } catch (error) {
    console.error("Error fetching clinic requests:", error);
    toast({
      title: "Error",
      description: "Failed to fetch clinic requests. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const selectPrimaryCarePhysician = async (
  userId: string,
  doctorId: string
): Promise<void> => {
  try {
    const patientRef = doc(db, "patients", userId);
    await updateDoc(patientRef, { primaryCarePhysicianId: doctorId });
    toast({
      title: "Primary Care Physician Updated",
      description: "Your primary care physician has been updated successfully.",
    });
  } catch (error) {
    console.error("Error updating primary care physician:", error);
    toast({
      title: "Error",
      description:
        "There was an error updating your primary care physician. Please try again.",
      variant: "destructive",
    });
  }
};
