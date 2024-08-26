import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

interface ClinicRequest {
  id: string;
  patientId: string;
  patientName: string;
  preferredDate: any;
  reason: string;
  status: string;
  urgency: string;
}

interface ClinicRequestsTabProps {
  clinicRequests: ClinicRequest[];
  onRequestUpdated: () => void;
}

export function ClinicRequestsTab({
  clinicRequests,
  onRequestUpdated,
}: ClinicRequestsTabProps) {
  const handleUpdateClinicRequest = async (
    requestId: string,
    newStatus: string
  ) => {
    const requestRef = doc(db, "clinicRequests", requestId);
    try {
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      onRequestUpdated();
      toast({
        title: "Clinic Request Updated",
        description: `Request status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating clinic request:", error);
      toast({
        title: "Error",
        description: "Failed to update clinic request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Clinic Requests</CardTitle>
      </CardHeader>
      <CardContent>
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
                    ? request.preferredDate.toDate().toLocaleDateString()
                    : "Not specified"}
                </TableCell>
                <TableCell>{request.reason || "Not specified"}</TableCell>
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
      </CardContent>
    </Card>
  );
}
