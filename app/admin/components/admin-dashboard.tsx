"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

interface ClinicRequest {
  id: string;
  patientId: string;
  patientName: string;
  preferredDate: Timestamp;
  reason: string;
  status: string;
  urgency: string;
}

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
    phoneNumber: "",
    qualifications: "",
  });
  const [clinicRequests, setClinicRequests] = useState<ClinicRequest[]>([]);

  useEffect(() => {
    fetchClinicRequests();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "patients"), {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        condition: newPatient.condition,
        createdAt: new Date(),
      });
      setNewPatient({ name: "", age: "", condition: "" });
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: "Error adding patient",
        variant: "destructive",
      });
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "doctors"), {
        ...newDoctor,
        createdAt: new Date(),
      });
      setNewDoctor({
        name: "",
        specialty: "",
        email: "",
        phoneNumber: "",
        qualifications: "",
      });
      toast({
        title: "Success",
        description: "Doctor added successfully",
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error",
        description: "Error adding doctor",
        variant: "destructive",
      });
    }
  };

  const fetchClinicRequests = async () => {
    const clinicRequestsRef = collection(db, "clinicRequests");
    const q = query(clinicRequestsRef, where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    const fetchedRequests: ClinicRequest[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId || "",
        patientName: data.patientName || "Unknown",
        preferredDate: data.preferredDate || null,
        reason: data.reason || "",
        status: data.status || "pending",
        urgency: data.urgency || "routine",
      } as ClinicRequest;
    });
    setClinicRequests(fetchedRequests);
  };

  const handleUpdateClinicRequest = async (
    requestId: string,
    newStatus: string
  ) => {
    const requestRef = doc(db, "clinicRequests", requestId);
    await updateDoc(requestRef, {
      status: newStatus,
      updatedAt: Timestamp.now(),
    });
    await fetchClinicRequests();
    toast({
      title: "Clinic Request Updated",
      description: `Request status changed to ${newStatus}`,
    });
  };

  return (
    <Tabs defaultValue="patients">
      <TabsList>
        <TabsTrigger value="patients">Patients</TabsTrigger>
        <TabsTrigger value="doctors">Doctors</TabsTrigger>
        <TabsTrigger value="clinic-requests">Clinic Requests</TabsTrigger>
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
          <Input
            placeholder="Phone Number"
            value={newDoctor.phoneNumber}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })
            }
          />
          <Input
            placeholder="Qualifications"
            value={newDoctor.qualifications}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, qualifications: e.target.value })
            }
          />
          <Button type="submit">Add Doctor</Button>
        </form>
      </TabsContent>
      <TabsContent value="clinic-requests">
        <Card>
          <CardHeader>
            <CardTitle>Pending Clinic Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of pending clinic requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinicRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.patientName}</TableCell>
                    <TableCell>
                      {request.preferredDate && request.preferredDate.toDate
                        ? request.preferredDate.toDate().toLocaleDateString()
                        : "Not specified"}
                    </TableCell>
                    <TableCell>{request.reason || "Not specified"}</TableCell>
                    <TableCell>{request.urgency || "Not specified"}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleUpdateClinicRequest(request.id, "approved")
                        }
                        className="mr-2"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() =>
                          handleUpdateClinicRequest(request.id, "rejected")
                        }
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
