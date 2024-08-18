"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import PatientList from "./patient-list";
//import DoctorList from "./doctor-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    condition: "",
  });
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
  });

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "patients"), {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        condition: newPatient.condition,
      });
      setNewPatient({ name: "", age: "", condition: "" });
      alert("Patient added successfully");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Error adding patient");
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "doctors"), newDoctor);
      setNewDoctor({ name: "", specialty: "", email: "" });
      alert("Doctor added successfully");
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Error adding doctor");
    }
  };

  return (
    <Tabs defaultValue="patients">
      <TabsList>
        <TabsTrigger value="patients">Patients</TabsTrigger>
        <TabsTrigger value="doctors">Doctors</TabsTrigger>
      </TabsList>
      <TabsContent value="patients">
        <h2 className="text-2xl font-bold mb-4">Patient Management</h2>
        <form onSubmit={handleAddPatient} className="mb-4 space-y-4">
          <Input
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) =>
              setNewPatient({ ...newPatient, name: e.target.value })
            }
          />
          <Input
            placeholder="Age"
            type="number"
            value={newPatient.age}
            onChange={(e) =>
              setNewPatient({ ...newPatient, age: e.target.value })
            }
          />
          <Input
            placeholder="Condition"
            value={newPatient.condition}
            onChange={(e) =>
              setNewPatient({ ...newPatient, condition: e.target.value })
            }
          />
          <Button type="submit">Add Patient</Button>
        </form>
        {/** <PatientList />*/}
      </TabsContent>
      <TabsContent value="doctors">
        <h2 className="text-2xl font-bold mb-4">Doctor Management</h2>
        <form onSubmit={handleAddDoctor} className="mb-4 space-y-4">
          <Input
            placeholder="Name"
            value={newDoctor.name}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, name: e.target.value })
            }
          />
          <Input
            placeholder="Specialty"
            value={newDoctor.specialty}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, specialty: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            type="email"
            value={newDoctor.email}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, email: e.target.value })
            }
          />
          <Button type="submit">Add Doctor</Button>
        </form>
        {/** <DoctorList />*/}
      </TabsContent>
    </Tabs>
  );
}
