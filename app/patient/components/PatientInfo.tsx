import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Patient } from "../actions";
import { Heart, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PatientInfoProps {
  user: any;
  patientData: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({
  user,
  patientData,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = patientData.dateOfBirth
    ? calculateAge(patientData.dateOfBirth)
    : null;

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center space-x-2 mb-2">
      {icon}
      <span className="font-medium">{label}:</span>
      {isEditMode ? (
        <input className="border rounded px-2 py-1" defaultValue={value} />
      ) : (
        <span>{value || "Not provided"}</span>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome back, {patientData.displayName}
          </CardTitle>
          <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "Save" : "Edit"}
          </Button>
        </div>
        <CardDescription>Your health journey at a glance</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6 pt-6">
        <div className="md:col-span-1 flex flex-col items-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage
              src={user.photoURL || "/placeholder-avatar.png"}
              alt="Patient"
            />
            <AvatarFallback className="text-2xl font-bold">
              {patientData.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="md:col-span-2 space-y-4">
          <InfoItem
            icon={<Mail className="h-5 w-5 text-primary" />}
            label="Email"
            value={patientData.email}
          />
          <InfoItem
            icon={<Calendar className="h-5 w-5 text-primary" />}
            label="Date of Birth"
            value={patientData.dateOfBirth || "Not provided"}
          />
          <InfoItem
            icon={<User className="h-5 w-5 text-primary" />}
            label="Gender"
            value={patientData.gender || "Not provided"}
          />
          <InfoItem
            icon={<Phone className="h-5 w-5 text-primary" />}
            label="Phone"
            value={patientData.phoneNumber || "Not provided"}
          />
          <InfoItem
            icon={<MapPin className="h-5 w-5 text-primary" />}
            label="Address"
            value={patientData.address || "Not provided"}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          {age && <span>Age: {age} years</span>}
          <span className="flex items-center">
            <Heart className="h-4 w-4 mr-1 text-red-500" /> Stay healthy!
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
