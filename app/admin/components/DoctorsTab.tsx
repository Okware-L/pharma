import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Search, UserCog, Check, X } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
}

interface DoctorApplication {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
}

interface DoctorsTabProps {
  doctors: Doctor[];
  onDoctorAdded: () => void;
  onDoctorDeleted: () => void;
}

export function DoctorsTab({
  doctors,
  onDoctorAdded,
  onDoctorDeleted,
}: DoctorsTabProps) {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phoneNumber: "",
    qualifications: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorApplications, setDoctorApplications] = useState<
    DoctorApplication[]
  >([]);

  useEffect(() => {
    fetchDoctorApplications();
  }, []);

  const fetchDoctorApplications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "docApply"));
      const applications = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as DoctorApplication)
      );
      setDoctorApplications(applications);
    } catch (error) {
      console.error("Error fetching doctor applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch doctor applications",
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
      onDoctorAdded();
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error",
        description: "Error adding doctor",
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
      onDoctorDeleted();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Error",
        description: "Error deleting doctor",
        variant: "destructive",
      });
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const applicationRef = doc(db, "docApply", applicationId);
      await updateDoc(applicationRef, {
        status: action === "approve" ? "approved" : "rejected",
      });
      toast({
        title: "Success",
        description: `Application ${action}d successfully`,
      });
      fetchDoctorApplications();
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast({
        title: "Error",
        description: `Error ${action}ing application`,
        variant: "destructive",
      });
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  return (
    <div className="space-y-6">
      <Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Doctor Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.fullName}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.specialization}</TableCell>
                  <TableCell>{application.experience}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>
                    {application.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() =>
                            handleApplicationAction(application.id, "approve")
                          }
                        >
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleApplicationAction(application.id, "reject")
                          }
                        >
                          <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
