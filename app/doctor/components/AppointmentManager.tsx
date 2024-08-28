"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Appointment } from "../types";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
  orderBy,
  limit,
} from "firebase/firestore";

// Define the props for the AppointmentManager component
interface AppointmentManagerProps {
  doctorId: string; // This is now directly the doctor's ID
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({
  doctorId,
}) => {
  // State variables
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Effect to fetch appointments when component mounts or doctorId changes
  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  // Function to fetch appointments from Firestore
  const fetchAppointments = async () => {
    console.log("Fetching appointments for doctorId:", doctorId);
    setLoading(true);
    setError(null);
    const appointmentsRef = collection(db, "appointments");
    let q = query(
      appointmentsRef,
      where("doctorId", "==", doctorId),
      orderBy("date", "asc"),
      limit(100)
    );

    try {
      console.log("Executing Firestore query...");
      const querySnapshot = await getDocs(q);
      console.log("Query snapshot size:", querySnapshot.size);

      if (querySnapshot.empty) {
        console.log("No appointments found for this doctor");
        setAppointments([]);
      } else {
        const fetchedAppointments: Appointment[] = querySnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            console.log("Appointment data:", data);
            return {
              id: doc.id,
              date: data.date,
              patientName: data.patientName,
              status: data.status,
              patientId: data.patientId,
              doctorId: data.doctorId,
              createdAt: data.createdAt,
            } as Appointment;
          }
        );
        console.log("Fetched appointments:", fetchedAppointments);
        setAppointments(fetchedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update an appointment's status
  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: string
  ) => {
    console.log(
      `Updating appointment ${appointmentId} to status: ${newStatus}`
    );
    const appointmentRef = doc(db, "appointments", appointmentId);
    try {
      await updateDoc(appointmentRef, { status: newStatus });
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
      console.log("Appointment updated successfully");
      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to cancel an appointment
  const cancelAppointment = async (appointmentId: string) => {
    console.log(`Cancelling appointment ${appointmentId}`);
    const appointmentRef = doc(db, "appointments", appointmentId);
    try {
      await deleteDoc(appointmentRef);
      setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
      console.log("Appointment cancelled successfully");
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter appointments based on date, status, and search term
  const filteredAppointments = appointments.filter((apt) => {
    const dateMatch = filterDate
      ? apt.date.toDate().toDateString() === new Date(filterDate).toDateString()
      : true;
    const statusMatch = filterStatus === "all" || apt.status === filterStatus;
    const searchMatch = apt.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return dateMatch && statusMatch && searchMatch;
  });

  console.log("Filtered appointments:", filteredAppointments);

  // Render the component
  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <Label htmlFor="date-filter">Filter by Date</Label>
          <Input
            id="date-filter"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="search">Search Patient</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Display loading state, error, or appointment data */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Debug information */}
          <p>Doctor ID: {doctorId}</p>
          <p>Total appointments: {appointments.length}</p>

          {/* Appointments table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {appointment.date instanceof Timestamp
                        ? appointment.date.toDate().toLocaleString()
                        : "Invalid Date"}
                    </TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        {appointment.status === "scheduled" && (
                          <Button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "confirmed"
                              )
                            }
                          >
                            Confirm
                          </Button>
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
                            Complete
                          </Button>
                        )}
                        {["scheduled", "confirmed"].includes(
                          appointment.status
                        ) && (
                          <Button
                            variant="destructive"
                            onClick={() => cancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};
