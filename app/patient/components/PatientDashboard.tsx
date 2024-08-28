"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientInfo } from "./PatientInfo";
import { AppointmentScheduler } from "./AppointmentScheduler";
import { AppointmentList } from "./AppointmentList";
import { ClinicRequestForm } from "./ClinicRequestForm";
import { ClinicRequestList } from "./ClinicRequestList";
import { MedicalRecordsList } from "./MedicalRecordsList";
import { PrimaryCarePhysicianSelector } from "./PrimaryCarePhysicianSelector";
import { VisitStatistics } from "./VisitStatistics";
import {
  Patient,
  MedicalRecord,
  Appointment,
  Doctor,
  ClinicRequest,
  fetchPatientData,
  fetchVisitCount,
  fetchRecentRecords,
  fetchAppointments,
  fetchDoctors,
  fetchClinicRequests,
} from "../actions";

interface PatientDashboardProps {
  user: any; // Replace 'any' with the actual user type from your auth system
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [visitCount, setVisitCount] = useState(0);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinicRequests, setClinicRequests] = useState<ClinicRequest[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  useEffect(() => {
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

        setSelectedDoctor(patientData?.primaryCarePhysicianId || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Show error toast
      }
    };

    fetchData();
  }, [user]);

  const handleAppointmentScheduled = async () => {
    const updatedAppointments = await fetchAppointments(user.uid);
    setAppointments(updatedAppointments);
  };

  const handleClinicRequestSubmitted = async () => {
    const updatedRequests = await fetchClinicRequests(user.uid);
    setClinicRequests(updatedRequests);
  };

  const handleClinicRequestUpdated = async () => {
    const updatedRequests = await fetchClinicRequests(user.uid);
    setClinicRequests(updatedRequests);
  };

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Patient Dashboard
      </h1>

      <PatientInfo user={user} patientData={patientData} />

      <Tabs defaultValue="appointments" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="clinic-requests">Clinic Requests</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <AppointmentScheduler
              doctors={doctors}
              userId={user.uid}
              patientName={patientData.displayName}
              onAppointmentScheduled={handleAppointmentScheduled}
            />
            <AppointmentList appointments={appointments} />
          </div>
        </TabsContent>

        <TabsContent value="clinic-requests" className="space-y-8">
          <ClinicRequestForm
            patientName={patientData.displayName}
            patientEmail={patientData.email}
            patientPhone={patientData.phoneNumber || ""}
            onRequestSubmitted={handleClinicRequestSubmitted}
          />
          <ClinicRequestList
            clinicRequests={clinicRequests}
            onRequestUpdated={handleClinicRequestUpdated}
          />
        </TabsContent>

        <TabsContent value="medical-records">
          <MedicalRecordsList recentRecords={recentRecords} />
        </TabsContent>

        <TabsContent value="settings">
          <PrimaryCarePhysicianSelector
            doctors={doctors}
            userId={user.uid}
            selectedDoctor={selectedDoctor}
            onDoctorSelected={setSelectedDoctor}
          />
        </TabsContent>
      </Tabs>

      <VisitStatistics visitCount={visitCount} />
    </div>
  );
};
