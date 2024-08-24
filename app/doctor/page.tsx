"use client";

import React, { useState, useEffect } from "react";
import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

interface Appointment {
  id: string;
  date: Timestamp;
  patientName: string;
  status: string;
  patientId: string;
}

interface Patient {
  id: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
}

export default function DoctorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchPatients();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const fetchAppointments = async () => {
    if (!user) return;
    const appointmentsRef = collection(db, "appointments");
    const q = query(
      appointmentsRef,
      where("doctorId", "==", user.uid),
      where("status", "in", ["pending", "confirmed"])
    );
    const querySnapshot = await getDocs(q);
    const fetchedAppointments: Appointment[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
    );
    setAppointments(fetchedAppointments);
  };

  const fetchPatients = async () => {
    if (!user) return;
    const patientsRef = collection(db, "patients");
    const q = query(patientsRef);
    const querySnapshot = await getDocs(q);
    const fetchedPatients: Patient[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Patient)
    );
    setPatients(fetchedPatients);
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: string
  ) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, { status: newStatus });
    await fetchAppointments();
    toast({
      title: "Appointment Updated",
      description: `Appointment status changed to ${newStatus}`,
    });
  };

  const rescheduleAppointment = async (
    appointmentId: string,
    newDate: Date
  ) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      date: Timestamp.fromDate(newDate),
      status: "rescheduled",
    });
    await fetchAppointments();
    toast({
      title: "Appointment Rescheduled",
      description: `Appointment has been rescheduled to ${newDate.toLocaleString()}`,
    });
  };

  const cancelAppointment = async (appointmentId: string) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await deleteDoc(appointmentRef);
    await fetchAppointments();
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled",
    });
  };

  const filterAppointmentsByDate = (date: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = appointment.date.toDate();
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <RoleGuard allowedRoles={["doctor", "admin"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <div>
            <span className="mr-4">
              Welcome, Dr. {user?.displayName || user?.email}
            </span>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="w-1/3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="w-2/3">
                    <Table>
                      <TableCaption>
                        List of appointments for {selectedDate?.toDateString()}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterAppointmentsByDate(
                          selectedDate || new Date()
                        ).map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              {appointment.date.toDate().toLocaleTimeString()}
                            </TableCell>
                            <TableCell>{appointment.patientName}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell>
                              {appointment.status === "pending" && (
                                <>
                                  <Button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        appointment.id,
                                        "confirmed"
                                      )
                                    }
                                    className="mr-2"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      rescheduleAppointment(
                                        appointment.id,
                                        new Date()
                                      )
                                    }
                                    className="mr-2"
                                  >
                                    Reschedule
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      cancelAppointment(appointment.id)
                                    }
                                    variant="destructive"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {appointment.status === "confirmed" && (
                                <Button
                                  onClick={() =>
                                    updateAppointmentStatus(
                                      appointment.id,
                                      "completed"
                                    )
                                  }
                                >
                                  Mark Completed
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Your Patients</CardTitle>
              </CardHeader>
              <CardContent>
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
                          <Button
                            onClick={() =>
                              router.push(`/patients/${patient.id}`)
                            }
                          >
                            View Details
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
      </div>
    </RoleGuard>
  );
}
