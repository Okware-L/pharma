"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  MedicalRecord,
  Patient,
  Appointment,
  Doctor,
  ClinicRequest,
  fetchPatientData,
  fetchVisitCount,
  fetchRecentRecords,
  fetchAppointments,
  fetchDoctors,
  scheduleAppointment,
  requestClinic,
  selectPrimaryCarePhysician,
  fetchClinicRequests,
  updateClinicRequest,
} from "./actions";

const PatientPage = () => {
  const { user, loading } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [visitCount, setVisitCount] = useState(0);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [clinicRequests, setClinicRequests] = useState<ClinicRequest[]>([]);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>(
    new Date()
  );
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "emergency">(
    "routine"
  );
  const [additionalNotes, setAdditionalNotes] = useState("");

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const patientData = await fetchPatientData(user.uid);
          setPatientData(patientData);

          const count = await fetchVisitCount(user.uid);
          setVisitCount(count);

          const records = await fetchRecentRecords(user.uid);
          setRecentRecords(records);

          const appointmentsData = await fetchAppointments(user.uid);
          setAppointments(appointmentsData);

          const doctorsData = await fetchDoctors();
          setDoctors(doctorsData);

          const requests = await fetchClinicRequests(user.uid);
          setClinicRequests(requests);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            title: "Error",
            description:
              "Failed to load some data. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      };

      fetchData();
    }
  }, [user]);

  const handleScheduleAppointment = async () => {
    if (!date || !user || !selectedTime || !selectedDoctor || !patientData) {
      toast({
        title: "Missing Information",
        description:
          "Please select a date, time, and doctor for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await scheduleAppointment(
        user.uid,
        patientData.displayName || user.email || "",
        date,
        selectedTime,
        selectedDoctor
      );

      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });

      const updatedAppointments = await fetchAppointments(user.uid);
      setAppointments(updatedAppointments);
      setDate(undefined);
      setSelectedTime("");
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestClinic = async () => {
    if (!user || !patientData || !preferredDate) return;

    try {
      await requestClinic(
        user.uid,
        patientData.displayName || user.email || "",
        patientData.phoneNumber || "",
        patientData.email,
        preferredDate,
        reason,
        selectedDoctor,
        urgency,
        additionalNotes
      );

      toast({
        title: "Clinic Request Submitted",
        description: "Your clinic request has been successfully submitted.",
      });

      const updatedRequests = await fetchClinicRequests(user.uid);
      setClinicRequests(updatedRequests);
      setPreferredDate(undefined);
      setReason("");
      setUrgency("routine");
      setAdditionalNotes("");
    } catch (error) {
      console.error("Error submitting clinic request:", error);
      toast({
        title: "Error",
        description: "Failed to submit clinic request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClinicRequest = async (
    requestId: string,
    updates: Partial<ClinicRequest>
  ) => {
    try {
      await updateClinicRequest(requestId, updates);
      const updatedRequests = await fetchClinicRequests(user!.uid);
      setClinicRequests(updatedRequests);
      toast({
        title: "Request Updated",
        description: "Your clinic request has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating clinic request:", error);
      toast({
        title: "Error",
        description: "Failed to update clinic request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectPrimaryCarePhysician = async (doctorId: string) => {
    if (!user) return;
    try {
      await selectPrimaryCarePhysician(user.uid, doctorId);
      setSelectedDoctor(doctorId);
      toast({
        title: "Primary Care Physician Updated",
        description:
          "Your primary care physician has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating primary care physician:", error);
      toast({
        title: "Error",
        description:
          "Failed to update primary care physician. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !patientData) {
    return <div>Please sign in to view this page.</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Patient Dashboard
          </h1>

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
                    <span className="font-medium">Email:</span>{" "}
                    {patientData.email}
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

          <Tabs defaultValue="appointments" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="clinic-requests">Clinic Requests</TabsTrigger>
              <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule an Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border mb-4"
                    />
                    <div className="mb-4">
                      <Label htmlFor="time">Select Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select
                        onValueChange={setSelectedDoctor}
                        value={selectedDoctor || undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleScheduleAppointment}
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Booking..." : "Book Appointment"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      <ul className="space-y-2">
                        {appointments.map((appointment) => (
                          <li
                            key={appointment.id}
                            className="text-sm p-2 bg-gray-100 rounded"
                          >
                            {appointment.date.toDate().toLocaleString()}:{" "}
                            {appointment.status}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No appointments scheduled.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clinic-requests" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Request Clinic Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="preferred-date">Preferred Date</Label>
                      <Calendar
                        mode="single"
                        selected={preferredDate}
                        onSelect={setPreferredDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason for Request</Label>
                      <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., General check-up, Specific symptoms"
                      />
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select
                        onValueChange={(value) =>
                          setUrgency(
                            value as "routine" | "urgent" | "emergency"
                          )
                        }
                        value={urgency}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="additional-notes">Additional Notes</Label>
                      <Textarea
                        id="additional-notes"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Any additional information you'd like to provide"
                      />
                    </div>
                    <Button onClick={handleRequestClinic} className="w-full">
                      Submit Clinic Request
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Clinic Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {clinicRequests.length > 0 ? (
                    <ul className="space-y-4">
                      {clinicRequests.map((request) => (
                        <li
                          key={request.id}
                          className="border p-4 rounded-md bg-gray-50"
                        >
                          <p>
                            <strong>Status:</strong> {request.status}
                          </p>
                          <p>
                            <strong>Preferred Date:</strong>{" "}
                            {request.preferredDate &&
                            request.preferredDate.toDate
                              ? request.preferredDate.toDate().toLocaleString()
                              : "Not specified"}
                          </p>
                          <p>
                            <strong>Reason:</strong>{" "}
                            {request.reason || "Not specified"}
                          </p>
                          <p>
                            <strong>Urgency:</strong>{" "}
                            {request.urgency || "Not specified"}
                          </p>
                          {request.status === "pending" && (
                            <Button
                              onClick={() =>
                                handleUpdateClinicRequest(request.id, {
                                  status: "cancelled",
                                })
                              }
                              className="mt-2"
                            >
                              Cancel Request
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No clinic requests found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical-records">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentRecords.length > 0 ? (
                    <ul className="space-y-2">
                      {recentRecords.map((record, index) => (
                        <li
                          key={index}
                          className="text-sm p-2 bg-gray-100 rounded"
                        >
                          {record.date}: {record.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No recent medical records found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
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
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 bg-blue-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Visit Statistics
            </h2>
            <p className="text-4xl font-bold text-blue-600">{visitCount}</p>
            <p className="text-sm text-blue-500">Total Visits</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PatientPage;
