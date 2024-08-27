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

/**
 * Handles errors by logging them to the console and displaying a toast notification.
 * This function centralizes error handling across the application, ensuring
 * consistent error reporting and user feedback.
 *
 * @param error - The error object caught in a try-catch block
 * @param message - A custom error message to display to the user
 */
const handleError = (error: any, message: string) => {
  console.error(message, error);
  toast({
    title: "Error",
    description: `${message} Please try again later.`,
    variant: "destructive",
  });
};

/**
 * Fetches documents from a specified Firestore collection based on given query constraints.
 * This is a generic function that can be used to fetch any type of document from any collection,
 * making it highly reusable across the application.
 *
 * @param collectionName - The name of the Firestore collection to query
 * @param queryConstraints - An array of Firebase query constraints to apply to the query
 * @returns A Promise that resolves to an array of documents of type T
 */
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

/**
 * Fetches patient data for a specific user from the Firestore database.
 * This function retrieves all the information associated with a patient,
 * including personal details, medical history, and preferences.
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to a Patient object if found, or null if not found
 */
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

/**
 * Retrieves the total number of visits for a specific patient.
 * This function is useful for tracking patient engagement and visit frequency,
 * which can be important for healthcare providers and administrators.
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to the number of visits
 */
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

/**
 * Fetches the most recent medical records for a specific patient.
 * This function retrieves the latest medical information, which is crucial
 * for providing up-to-date care and making informed medical decisions.
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to an array of MedicalRecord objects
 */
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

/**
 * Retrieves all appointments for a specific patient, ordered by date.
 * This function is essential for managing patient schedules and ensuring
 * that healthcare providers have an accurate view of upcoming appointments.
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to an array of Appointment objects
 */
export const fetchAppointments = async (
  userId: string
): Promise<Appointment[]> => {
  return fetchDocuments("appointments", [
    where("patientId", "==", userId),
    orderBy("date", "desc"),
  ]) as Promise<Appointment[]>;
};

/**
 * Fetches all doctors registered in the system.
 * This function is useful for populating doctor selection dropdowns,
 * displaying doctor information, and managing doctor-patient relationships.
 *
 * @returns A Promise that resolves to an array of Doctor objects
 */
export const fetchDoctors = async (): Promise<Doctor[]> => {
  return fetchDocuments("doctors", []) as Promise<Doctor[]>;
};

/**
 * Schedules a new appointment for a patient with a selected doctor.
 * This function handles the entire appointment creation process, including
 * data validation, Firestore document creation, and user notification.
 *
 * @param userId - The unique identifier of the user/patient
 * @param patientName - The name of the patient
 * @param date - The date of the appointment
 * @param selectedTime - The time of the appointment
 * @param selectedDoctor - The unique identifier of the selected doctor
 * @returns A Promise that resolves to a boolean indicating success or failure
 */
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

/**
 * Submits a new clinic request for a patient.
 * This function manages the entire process of creating a clinic request,
 * including checking for existing requests, validating inputs, enforcing
 * rate limits, creating the Firestore document, sending notifications,
 * and logging the request.
 *
 * @param userId - The unique identifier of the user/patient
 * @param patientName - The name of the patient
 * @param contactPhone - The patient's contact phone number
 * @param contactEmail - The patient's contact email address
 * @param preferredDate - The preferred date for the clinic visit
 * @param reason - The reason for the clinic request
 * @param primaryCarePhysicianId - The ID of the patient's primary care physician (if any)
 * @param urgency - The urgency level of the request (routine, urgent, or emergency)
 * @param additionalNotes - Any additional notes or information about the request
 */
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

/**
 * Updates an existing clinic request with new information.
 * This function allows for modifications to clinic requests, such as
 * changing the status or updating other details. It also logs the update
 * for record-keeping purposes.
 *
 * @param requestId - The unique identifier of the clinic request
 * @param updates - An object containing the fields to be updated
 */
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

/**
 * Fetches all clinic requests for a specific patient.
 * This function retrieves the full history of clinic requests made by a patient,
 * which is useful for tracking request status and managing patient care.
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to an array of ClinicRequest objects
 */
export const fetchClinicRequests = async (
  userId: string
): Promise<ClinicRequest[]> => {
  return fetchDocuments("clinicRequests", [
    where("patientId", "==", userId),
    orderBy("createdAt", "desc"),
  ]) as Promise<ClinicRequest[]>;
};

/**
 * Updates the primary care physician for a specific patient.
 * This function allows patients to change their designated primary care
 * physician, which is important for managing ongoing care and referrals.
 *
 * @param userId - The unique identifier of the user/patient
 * @param doctorId - The unique identifier of the selected doctor
 */
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

/**
 * Checks for existing pending clinic requests for a specific patient.
 * This helper function is used to prevent duplicate requests and ensure
 * that patients don't overwhelm the system with multiple pending requests.
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to the number of pending requests
 */
const checkExistingRequests = async (userId: string): Promise<number> => {
  const requests = await fetchDocuments("clinicRequests", [
    where("patientId", "==", userId),
    where("status", "==", "pending"),
  ]);
  return requests.length;
};

// ... (previous code remains the same)

/**
 * Validates user inputs for clinic requests.
 * This helper function ensures that the provided contact information and
 * preferred date are valid before allowing a clinic request to be submitted.
 *
 * @param phone - The provided phone number
 * @param email - The provided email address
 * @param date - The preferred date for the clinic visit
 * @returns A boolean indicating whether the inputs are valid
 */
const validateInputs = (phone: string, email: string, date: Date): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

/**
 * Checks if a user has exceeded the rate limit for submitting clinic requests.
 * This helper function prevents abuse of the system by limiting the number
 * of requests a user can make within a specific time frame (1 hour in this case).
 *
 * @param userId - The unique identifier of the user/patient
 * @returns A Promise that resolves to a boolean indicating whether the user is within the rate limit
 */
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

/**
 * Sends notifications related to a new clinic request.
 * This helper function manages the process of notifying relevant parties
 * (e.g., staff, the patient) about a new clinic request. It's currently
 * a placeholder for more complex notification logic.
 *
 * @param userId - The unique identifier of the user/patient
 * @param patientName - The name of the patient
 * @param requestId - The unique identifier of the clinic request
 */
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

/**
 * Logs a clinic request action in the database.
 * This helper function creates a record of clinic request actions,
 * which is useful for auditing, tracking, and analyzing request patterns.
 *
 * @param userId - The unique identifier of the user/patient
 * @param requestId - The unique identifier of the clinic request
 */
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
