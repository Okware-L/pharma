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
  deleteDoc,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Search,
  UserPlus,
  UserCog,
  ClipboardList,
  BarChart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClinicRequest {
  id: string;
  patientId: string;
  patientName: string;
  preferredDate: Timestamp;
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchClinicRequests(), fetchPatients(), fetchDoctors()]);
    setLoading(false);
  };

  const fetchClinicRequests = async () => {
    const clinicRequestsRef = collection(db, "clinicRequests");
    const q = query(clinicRequestsRef, where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    const fetchedRequests: ClinicRequest[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as ClinicRequest)
    );
    setClinicRequests(fetchedRequests);
  };

  const fetchPatients = async () => {
    const patientsRef = collection(db, "patients");
    const querySnapshot = await getDocs(patientsRef);
    const fetchedPatients: Patient[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Patient)
    );
    setPatients(fetchedPatients);
  };

  const fetchDoctors = async () => {
    const doctorsRef = collection(db, "doctors");
    const querySnapshot = await getDocs(doctorsRef);
    const fetchedDoctors: Doctor[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Doctor)
    );
    setDoctors(fetchedDoctors);
  };

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
      fetchPatients();
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
      fetchDoctors();
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error",
        description: "Error adding doctor",
        variant: "destructive",
      });
    }
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

  const handleDeletePatient = async (patientId: string) => {
    try {
      await deleteDoc(doc(db, "patients", patientId));
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Error deleting patient",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      await deleteDoc(doc(db, "doctors", doctorId));
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Error",
        description: "Error deleting doctor",
        variant: "destructive",
      });
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="clinic-requests">Clinic Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{patients.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{doctors.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {clinicRequests.length}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add a list or timeline of recent activities here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" /> Add Patient
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Patient</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPatient} className="space-y-4">
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
                          setNewPatient({
                            ...newPatient,
                            condition: e.target.value,
                          })
                        }
                      />
                      <Button type="submit">Add Patient</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Doctor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserCog className="mr-2 h-4 w-4" /> Add Doctor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Doctor</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddDoctor} className="space-y-4">
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
                          setNewDoctor({
                            ...newDoctor,
                            specialty: e.target.value,
                          })
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
                          setNewDoctor({
                            ...newDoctor,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Qualifications"
                        value={newDoctor.qualifications}
                        onChange={(e) =>
                          setNewDoctor({
                            ...newDoctor,
                            qualifications: e.target.value,
                          })
                        }
                      />
                      <Button type="submit">Add Doctor</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.phoneNumber}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic-requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Clinic Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
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
                            ? request.preferredDate
                                .toDate()
                                .toLocaleDateString()
                            : "Not specified"}
                        </TableCell>
                        <TableCell>
                          {request.reason || "Not specified"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.urgency === "high"
                                ? "bg-red-100 text-red-800"
                                : request.urgency === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {request.urgency || "Not specified"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              handleUpdateClinicRequest(request.id, "approved")
                            }
                            className="mr-2"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              handleUpdateClinicRequest(request.id, "rejected")
                            }
                            variant="destructive"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
