"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doctor, scheduleAppointment } from "../actions";

interface AppointmentSchedulerProps {
  doctors: Doctor[];
  userId: string;
  patientName: string;
  onAppointmentScheduled: () => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  doctors,
  userId,
  patientName,
  onAppointmentScheduled,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScheduleAppointment = async () => {
    if (!date || !selectedTime || !selectedDoctor) {
      // Show error toast
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await scheduleAppointment(
        userId,
        patientName,
        date,
        selectedTime,
        selectedDoctor
      );

      if (success) {
        onAppointmentScheduled();
        setDate(undefined);
        setSelectedTime("");
        setSelectedDoctor(null);
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border mb-4"
        />
        <div className="mb-4">
          <Label htmlFor="time">Select Time</Label>
          <Input
            id="time"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="doctor">Select Doctor</Label>
          <Select
            onValueChange={setSelectedDoctor}
            value={selectedDoctor || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleScheduleAppointment}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </Button>
      </CardContent>
    </Card>
  );
};
