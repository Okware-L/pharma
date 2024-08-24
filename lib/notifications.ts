import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (you need to do this once in your app, typically in a separate file)
if (!admin.apps.length) {
  admin.initializeApp();
}

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    await addDoc(collection(db, "mail"), {
      to: [to],
      message: {
        subject: subject,
        html: body,
      },
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string
) {
  try {
    // Fetch the user's FCM token from Firestore
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      console.warn(`No FCM token found for user ${userId}`);
      return;
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent push notification:", response);
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw new Error("Failed to send push notification");
  }
}
