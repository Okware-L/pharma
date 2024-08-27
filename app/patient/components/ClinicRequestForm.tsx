"use client";

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
import { requestClinic } from "../actions";

interface ClinicRequestFormProps {
  userId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  onRequestSubmitted: () => void;
}

export const ClinicRequestForm: React.FC<ClinicRequestFormProps> = ({
  userId,
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

  const handleRequestClinic = async () => {
    if (!preferredDate) return;

    setIsSubmitting(true);

    try {
      await requestClinic(
        userId,
        patientName,
        patientPhone,
        patientEmail,
        preferredDate,
        reason,
        null, // primaryCarePhysicianId
        urgency,
        additionalNotes
      );

      onRequestSubmitted();
      setPreferredDate(undefined);
      setReason("");
      setUrgency("routine");
      setAdditionalNotes("");
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
