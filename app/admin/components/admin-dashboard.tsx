"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  LayoutDashboard,
  Users,
  UserPlus,
  UserCog,
  ClipboardList,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./OverviewTab";
import { PatientsTab } from "./PatientsTab";
import { HealthRepsTab } from "./HealthRepsTab";
import { DoctorsTab } from "./DoctorsTab";
import { ClinicRequestsTab } from "./ClinicRequestsTab";
import { toast } from "@/components/ui/use-toast";

interface ClinicRequest {
  id: string;
  patientId: string;
  patientName: string;
  preferredDate: any;
  reason: string;
  status: string;
  urgency: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

interface HealthRep {
  id: string;
  name: string;
  email: string;
  experience: string;
}

interface HealthRepApplication {
  id: string;
  name: string;
  email: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
}

const tabItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "health-reps", label: "Health Reps", icon: UserPlus },
  { id: "doctors", label: "Doctors", icon: UserCog },
  { id: "clinic-requests", label: "Clinic Requests", icon: ClipboardList },
];

export default function AdminDashboard() {
  const [clinicRequests, setClinicRequests] = useState<ClinicRequest[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [healthReps, setHealthReps] = useState<HealthRep[]>([]);
  const [healthRepApplications, setHealthRepApplications] = useState<
    HealthRepApplication[]
  >([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchClinicRequests(),
        fetchPatients(),
        fetchHealthRepApplications(),
        fetchDoctors(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicRequests = async () => {
    const clinicRequestsRef = collection(db, "clinicRequests");
    const q = query(clinicRequestsRef, where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    const fetchedRequests: ClinicRequest[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ClinicRequest)
    );
    setClinicRequests(fetchedRequests);
  };

  const fetchPatients = async () => {
    const patientsRef = collection(db, "patients");
    const querySnapshot = await getDocs(patientsRef);
    const fetchedPatients: Patient[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Patient)
    );
    setPatients(fetchedPatients);
  };

  const fetchHealthReps = async () => {
    try {
      const healthRepsRef = collection(db, "healthReps");
      const querySnapshot = await getDocs(healthRepsRef);
      const fetchedHealthReps: HealthRep[] = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as HealthRep)
      );
      setHealthReps(fetchedHealthReps);
    } catch (error) {
      console.error("Error fetching health reps:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch health representatives. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchHealthRepApplications = async () => {
    try {
      const applicationsRef = collection(db, "healthRepApplications");
      const querySnapshot = await getDocs(applicationsRef);
      const fetchedApplications: HealthRepApplication[] =
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as HealthRepApplication)
        );
      setHealthRepApplications(fetchedApplications);
    } catch (error) {
      console.error("Error fetching health rep applications:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch health rep applications. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchHealthReps();
    fetchHealthRepApplications();
    // ... (other fetch functions)
  }, []);

  const fetchDoctors = async () => {
    const doctorsRef = collection(db, "doctors");
    const querySnapshot = await getDocs(doctorsRef);
    const fetchedDoctors: Doctor[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Doctor)
    );
    setDoctors(fetchedDoctors);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
        {tabItems.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className="flex items-center"
          >
            <item.icon className="w-4 h-4 mr-2" />
            <span>{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab
          patientCount={patients.length}
          doctorCount={doctors.length}
          clinicRequestCount={clinicRequests.length}
          healthRepApplicationCount={healthRepApplications.length}
        />
      </TabsContent>

      <TabsContent value="patients">
        <PatientsTab patients={patients} onPatientAdded={fetchPatients} />
      </TabsContent>

      <TabsContent value="health-reps">
        <HealthRepsTab
          healthReps={healthReps}
          applications={healthRepApplications}
          onApplicationUpdated={fetchHealthRepApplications}
        />
      </TabsContent>

      <TabsContent value="doctors">
        <DoctorsTab
          doctors={doctors}
          onDoctorAdded={fetchDoctors}
          onDoctorDeleted={fetchDoctors}
        />
      </TabsContent>

      <TabsContent value="clinic-requests">
        <ClinicRequestsTab
          clinicRequests={clinicRequests}
          onRequestUpdated={fetchClinicRequests}
        />
      </TabsContent>
    </Tabs>
  );
}
