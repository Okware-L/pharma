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
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { Search, CheckCircle, XCircle } from "lucide-react";

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

interface HealthRepsTabProps {
  healthReps: HealthRep[];
  applications: HealthRepApplication[];
  onApplicationUpdated: () => void;
}

export function HealthRepsTab({
  healthReps,
  applications,
  onApplicationUpdated,
}: HealthRepsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateHealthRepApplication = async (
    applicationId: string,
    newStatus: "approved" | "rejected"
  ) => {
    const applicationRef = doc(db, "healthRepApplications", applicationId);
    try {
      await updateDoc(applicationRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      onApplicationUpdated();
      toast({
        title: "Health Rep Application Updated",
        description: `Application ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating health rep application:", error);
      toast({
        title: "Error",
        description: "Error updating health rep application",
        variant: "destructive",
      });
    }
  };

  const filteredHealthReps = healthReps.filter(
    (healthRep) =>
      healthRep.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const filteredApplications = applications.filter(
    (application) =>
      application.name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
      false
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Existing Health Representatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search health reps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          {filteredHealthReps.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHealthReps.map((healthRep) => (
                  <TableRow key={healthRep.id}>
                    <TableCell>{healthRep.name}</TableCell>
                    <TableCell>{healthRep.email}</TableCell>
                    <TableCell>{healthRep.experience}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>There are no existing health representatives.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Representative Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
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
                              handleUpdateHealthRepApplication(
                                application.id,
                                "approved"
                              )
                            }
                          >
                            <CheckCircle className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleUpdateHealthRepApplication(
                                application.id,
                                "rejected"
                              )
                            }
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>There are no pending health representative applications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
