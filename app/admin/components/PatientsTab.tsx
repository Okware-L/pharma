import { useState } from "react";
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
import { collection, addDoc } from "firebase/firestore";
import { Search, UserPlus } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

interface PatientsTabProps {
  patients: Patient[];
  onPatientAdded: () => void;
}

export function PatientsTab({ patients, onPatientAdded }: PatientsTabProps) {
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    condition: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

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
      onPatientAdded();
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: "Error adding patient",
        variant: "destructive",
      });
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  return (
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
                    setNewPatient({ ...newPatient, condition: e.target.value })
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.condition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
