import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Define types for User and Patient
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "patient";
  createdAt: admin.firestore.Timestamp;
}

interface Patient {
  uid: string;
  email: string;
  displayName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: admin.firestore.Timestamp;
}

// Helper function to generate server timestamp
const getServerTimestamp = (): admin.firestore.FieldValue => {
  return admin.firestore.FieldValue.serverTimestamp();
};

export const createUserAndPatientDocuments = functions.auth
  .user()
  .onCreate(async (user) => {
    console.log(`Attempting to create documents for user ${user.uid}`);
    const db = admin.firestore();

    try {
      // Start a new batch
      const batch = db.batch();

      // Prepare user data
      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        role: "patient",
        createdAt: getServerTimestamp() as any,
      };

      console.log("Prepared user data:", userData);

      // Prepare patient data
      const patientData: Patient = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        createdAt: getServerTimestamp() as any,
      };

      console.log("Prepared patient data:", patientData);

      // Reference to the user document
      const userRef = db.collection("users").doc(user.uid);

      // Reference to the patient document
      const patientRef = db.collection("patients").doc(user.uid);

      // Set the user document
      batch.set(userRef, userData);
      console.log(`Added user document to batch for ${user.uid}`);

      // Set the patient document
      batch.set(patientRef, patientData);
      console.log(`Added patient document to batch for ${user.uid}`);

      // Commit the batch
      await batch.commit();
      console.log(`User and patient documents created for ${user.uid}`);
      return null;
    } catch (error) {
      console.error("Error in createUserAndPatientDocuments:", error);
      return null;
    }
  });
