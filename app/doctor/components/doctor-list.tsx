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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsCollection = collection(db, "doctors");
      const doctorsSnapshot = await getDocs(doctorsCollection);
      const doctorsList = doctorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Doctor[];
      setDoctors(doctorsList);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Specialty</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell>{doctor.name}</TableCell>
            <TableCell>{doctor.specialty}</TableCell>
            <TableCell>{doctor.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
