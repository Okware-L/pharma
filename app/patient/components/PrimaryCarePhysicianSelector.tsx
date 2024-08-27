"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doctor, selectPrimaryCarePhysician } from "../actions";

interface PrimaryCarePhysicianSelectorProps {
  doctors: Doctor[];
  userId: string;
  selectedDoctor: string | null;
  onDoctorSelected: (doctorId: string) => void;
}

export const PrimaryCarePhysicianSelector: React.FC<
  PrimaryCarePhysicianSelectorProps
> = ({ doctors, userId, selectedDoctor, onDoctorSelected }) => {
  const handleSelectPrimaryCarePhysician = async (doctorId: string) => {
    try {
      await selectPrimaryCarePhysician(userId, doctorId);
      onDoctorSelected(doctorId);
    } catch (error) {
      console.error("Error updating primary care physician:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary Care Physician</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={handleSelectPrimaryCarePhysician}
          value={selectedDoctor || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a primary care physician" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
