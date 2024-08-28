"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { DashboardCards } from "./DashboardCards";
import { AppointmentManager } from "./AppointmentManager";
import { PatientList } from "./PatientList";
import { Patient } from "../types";
import { fetchPatients } from "../actions"; // Assume this function exists to fetch patients

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchPatientData();
    } else {
      // Handle the case when there's no user
      router.push("/login"); // Redirect to login page or show an error message
    }
  }, [user, router]);

  const fetchPatientData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fetchedPatients = await fetchPatients(user.uid);
      setPatients(fetchedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patient data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div>Please sign in to access the doctor dashboard.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        <Button variant="outline" onClick={() => signOut(auth)}>
          Sign Out
        </Button>
      </div>

      <DashboardCards
        todayAppointments={0} // You might want to fetch this data separately
        totalPatients={patients.length}
      />

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Your Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentManager doctorId={user.uid} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Your Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading patients...</p>
              ) : (
                <PatientList
                  patients={filteredPatients}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onViewDetails={(patientId) =>
                    router.push(`/patients/${patientId}`)
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};
