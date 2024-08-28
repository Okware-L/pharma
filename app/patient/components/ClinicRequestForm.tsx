import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust this import path as needed

interface ClinicRequestFormProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  onRequestSubmitted: () => void;
}

export const ClinicRequestForm: React.FC<ClinicRequestFormProps> = ({
  patientName,
  patientEmail,
  patientPhone,
  onRequestSubmitted,
}) => {
  const [preferredDate, setPreferredDate] = useState<Date | undefined>(
    new Date()
  );
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "emergency">(
    "routine"
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestClinic = async (): Promise<boolean> => {
    console.log("Starting requestClinic function");

    try {
      // Check user authentication
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User not authenticated");
        toast({
          title: "Authentication Error",
          description: "Please sign in to request a clinic appointment.",
          variant: "destructive",
        });
        return false;
      }

      console.log("Authenticated user ID:", user.uid);

      // Verify user role
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        console.error("User document not found");
        toast({
          title: "User Error",
          description: "User profile not found. Please contact support.",
          variant: "destructive",
        });
        return false;
      }

      const userData = userDoc.data();
      console.log("User data:", userData);

      if (userData?.role !== "patient") {
        console.error("User is not a patient");
        toast({
          title: "Permission Error",
          description: "Only patients can request clinic appointments.",
          variant: "destructive",
        });
        return false;
      }

      // Create new request object
      const newRequest = {
        patientId: user.uid,
        patientName,
        contactPhone: patientPhone,
        contactEmail: patientEmail,
        preferredDate: Timestamp.fromDate(preferredDate!),
        reason,
        primaryCarePhysicianId: null,
        status: "pending",
        statusLastUpdated: serverTimestamp(),
        medicalRecordLink: `/patients/${user.uid}/medical-record`,
        urgency,
        additionalNotes,
        createdAt: serverTimestamp(),
      };

      console.log("New request object:", newRequest);

      // Attempt to add the document
      console.log("Attempting to add document to clinicRequests collection");
      const docRef = await addDoc(collection(db, "clinicRequests"), newRequest);

      console.log("Document added successfully. Document ID:", docRef.id);

      toast({
        title: "Clinic Request Submitted",
        description:
          "Your request for a clinic appointment has been submitted. We will contact you shortly.",
      });

      return true;
    } catch (error) {
      console.error("Error in requestClinic:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while submitting your request. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRequestClinic = async () => {
    if (!preferredDate) return;

    setIsSubmitting(true);

    try {
      const success = await requestClinic();

      if (success) {
        onRequestSubmitted();
        setPreferredDate(undefined);
        setReason("");
        setUrgency("routine");
        setAdditionalNotes("");
      }
    } catch (error) {
      console.error("Error submitting clinic request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Clinic Service</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="preferred-date">Preferred Date</Label>
            <Calendar
              mode="single"
              selected={preferredDate}
              onSelect={setPreferredDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <Label htmlFor="reason">Reason for Request</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., General check-up, Specific symptoms"
            />
          </div>
          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              onValueChange={(value) =>
                setUrgency(value as "routine" | "urgent" | "emergency")
              }
              value={urgency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="additional-notes">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional information you'd like to provide"
            />
          </div>
          <Button
            onClick={handleRequestClinic}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Clinic Request"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
