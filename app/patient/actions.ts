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
  QueryConstraint,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

// Interfaces
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
  primaryCarePhysicianId?: string;
}

export interface Appointment {
  id: string;
  date: Timestamp;
  status: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  createdAt: Timestamp;
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

// Helper functions
const handleError = (error: any, message: string) => {
  console.error(message, error);
  toast({
    title: "Error",
    description: `${message} Please try again later.`,
    variant: "destructive",
  });
};

const fetchDocuments = async <T>(
  collectionName: string,
  queryConstraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
  } catch (error) {
    handleError(error, `Failed to fetch ${collectionName}.`);
    return [];
  }
};
// Main functions
export const fetchPatientData = async (
  userId: string
): Promise<Patient | null> => {
  try {
    const patientRef = doc(db, "patients", userId);
    const patientSnap = await getDoc(patientRef);
    return patientSnap.exists() ? (patientSnap.data() as Patient) : null;
  } catch (error) {
    handleError(error, "Failed to fetch patient data.");
    return null;
  }
};

export const fetchVisitCount = async (userId: string): Promise<number> => {
  try {
    const visits = await fetchDocuments("visits", [
      where("patientId", "==", userId),
    ]);
    return visits.length;
  } catch (error) {
    handleError(error, "Failed to fetch visit count.");
    return 0;
  }
};

export const fetchRecentRecords = async (
  userId: string
): Promise<MedicalRecord[]> => {
  try {
    const records = await fetchDocuments<{
      id: string;
      date: Timestamp;
      description: string;
    }>("medicalRecords", [
      where("patientId", "==", userId),
      orderBy("date", "desc"),
      limit(3),
    ]);
    return records.map((record) => ({
      date: record.date.toDate().toLocaleString(),
      description: record.description,
    }));
  } catch (error) {
    handleError(error, "Failed to fetch recent medical records.");
    return [];
  }
};

export const fetchAppointments = async (
  userId: string
): Promise<Appointment[]> => {
  return fetchDocuments("appointments", [
    where("patientId", "==", userId),
    orderBy("date", "desc"),
  ]) as Promise<Appointment[]>;
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  return fetchDocuments("doctors", []) as Promise<Doctor[]>;
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

    const newAppointment: Omit<Appointment, "id"> = {
      date: Timestamp.fromDate(appointmentDateTime),
      patientId: userId,
      patientName: patientName,
      doctorId: selectedDoctor,
      status: "scheduled",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "appointments"), newAppointment);

    toast({
      title: "Appointment Scheduled",
      description: `Your appointment has been scheduled for ${appointmentDateTime.toLocaleString()}.`,
    });

    return true;
  } catch (error) {
    handleError(error, "Error scheduling appointment.");
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
    if ((await checkExistingRequests(userId)) > 0) {
      toast({
        title: "Existing Request",
        description:
          "You already have a pending clinic request. Please wait for a response.",
        variant: "default",
      });
      return;
    }

    if (
      !validateInputs(contactPhone, contactEmail, preferredDate) ||
      !checkRateLimit(userId)
    ) {
      return;
    }

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

    const docRef = await addDoc(collection(db, "clinicRequests"), newRequest);

    await sendNotifications(userId, patientName, docRef.id);
    await logClinicRequest(userId, docRef.id);

    toast({
      title: "Clinic Request Submitted",
      description:
        "Your request for a clinic has been submitted. We will contact you shortly.",
    });
  } catch (error) {
    handleError(error, "Error requesting clinic.");
  }
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

    toast({
      title: "Request Updated",
      description: "Your clinic request has been updated successfully.",
    });

    await logClinicRequest(updates.patientId!, requestId);
  } catch (error) {
    handleError(error, "Error updating clinic request.");
  }
};

export const fetchClinicRequests = async (
  userId: string
): Promise<ClinicRequest[]> => {
  return fetchDocuments("clinicRequests", [
    where("patientId", "==", userId),
    orderBy("createdAt", "desc"),
  ]) as Promise<ClinicRequest[]>;
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
    handleError(error, "Error updating primary care physician.");
  }
};

// Helper functions for requestClinic
const checkExistingRequests = async (userId: string): Promise<number> => {
  const requests = await fetchDocuments("clinicRequests", [
    where("patientId", "==", userId),
    where("status", "==", "pending"),
  ]);
  return requests.length;
};

const validateInputs = (phone: string, email: string, date: Date): boolean => {
  //const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // if (phone && !phoneRegex.test(phone)) {
  //   toast({
  //     title: "Invalid Phone Number",
  //     description: "Please enter a valid phone number or leave it blank.",
  //     variant: "destructive",
  //   });
  //   return false;
  // }

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
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentRequests = await fetchDocuments("clinicRequests", [
    where("patientId", "==", userId),
    where("createdAt", ">=", Timestamp.fromDate(oneHourAgo)),
  ]);

  if (recentRequests.length >= 3) {
    toast({
      title: "Too Many Requests",
      description: "Please wait before submitting another request.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

const sendNotifications = async (
  userId: string,
  patientName: string,
  requestId: string
): Promise<void> => {
  // Placeholder for notification logic
  console.log(
    `Sending notification for clinic request ${requestId} by patient ${patientName}`
  );
  console.log(`Sending confirmation email to patient ${userId}`);
  console.log("Notifying relevant staff about new clinic request");
};

const logClinicRequest = async (
  userId: string,
  requestId: string
): Promise<void> => {
  await addDoc(collection(db, "clinicRequestLogs"), {
    userId,
    requestId,
    action: "created",
    timestamp: serverTimestamp(),
  });
};
