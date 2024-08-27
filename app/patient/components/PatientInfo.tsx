"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Patient } from "../actions";

interface PatientInfoProps {
  user: any;
  patientData: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({
  user,
  patientData,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:flex-shrink-0 p-6">
          <Avatar className="h-32 w-32 mx-auto md:mx-0">
            <AvatarImage
              src={user.photoURL || "/placeholder-avatar.png"}
              alt="Patient"
            />
            <AvatarFallback>
              {patientData.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Welcome back
          </div>
          <h2 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
            {patientData.displayName}
          </h2>
          <div className="mt-2 text-gray-600">
            <p>
              <span className="font-medium">Email:</span> {patientData.email}
            </p>
            <p>
              <span className="font-medium">Date of Birth:</span>{" "}
              {patientData.dateOfBirth || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Gender:</span>{" "}
              {patientData.gender || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {patientData.phoneNumber || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {patientData.address || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
