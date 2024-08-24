"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsCollection = collection(db, "patients");
      const patientsSnapshot = await getDocs(patientsCollection);
      const patientsList = patientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];
      setPatients(patientsList);
      setLoading(false);
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading patients...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Condition</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.condition}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
