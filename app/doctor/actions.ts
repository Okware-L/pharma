// File: app/doctor/actions.ts
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { Patient } from "./types";

export const fetchPatients = async (doctorId: string): Promise<Patient[]> => {
  try {
    // First, fetch the appointments for this doctor
    const appointmentsRef = collection(db, "appointments");
    const appointmentsQuery = query(
      appointmentsRef,
      where("doctorId", "==", doctorId)
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    // Extract unique patient IDs from the appointments
    const patientIds = Array.from(
      new Set(appointmentsSnapshot.docs.map((doc) => doc.data().patientId))
    );

    // Now, fetch the patient details for these patient IDs
    const patientsRef = collection(db, "patients");
    const patients: Patient[] = [];

    for (const patientId of patientIds) {
      const patientQuery = query(patientsRef, where("id", "==", patientId));
      const patientSnapshot = await getDocs(patientQuery);

      if (!patientSnapshot.empty) {
        const patientData = patientSnapshot.docs[0].data() as DocumentData;
        patients.push({
          id: patientId,
          displayName: patientData.displayName || "Unknown",
          email: patientData.email || "",
          phoneNumber: patientData.phoneNumber || "",
        });
      }
    }

    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("Failed to fetch patients");
  }
};
