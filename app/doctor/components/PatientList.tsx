"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "../types";

interface PatientListProps {
  patients: Patient[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewDetails: (patientId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  searchTerm,
  onSearchChange,
  onViewDetails,
}) => {
  return (
    <>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Table>
        <TableCaption>List of your patients</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.displayName}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phoneNumber || "N/A"}</TableCell>
              <TableCell>
                <Button onClick={() => onViewDetails(patient.id)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
