"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicRequest, updateClinicRequest } from "../actions";

interface ClinicRequestListProps {
  clinicRequests: ClinicRequest[];
  onRequestUpdated: () => void;
}

export const ClinicRequestList: React.FC<ClinicRequestListProps> = ({
  clinicRequests,
  onRequestUpdated,
}) => {
  const handleUpdateClinicRequest = async (
    requestId: string,
    status: "cancelled"
  ) => {
    try {
      await updateClinicRequest(requestId, { status });
      onRequestUpdated();
    } catch (error) {
      console.error("Error updating clinic request:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Clinic Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {clinicRequests.length > 0 ? (
          <ul className="space-y-4">
            {clinicRequests.map((request) => (
              <li key={request.id} className="border p-4 rounded-md bg-gray-50">
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                <p>
                  <strong>Preferred Date:</strong>{" "}
                  {request.preferredDate && request.preferredDate.toDate
                    ? request.preferredDate.toDate().toLocaleString()
                    : "Not specified"}
                </p>
                <p>
                  <strong>Reason:</strong> {request.reason || "Not specified"}
                </p>
                <p>
                  <strong>Urgency:</strong> {request.urgency || "Not specified"}
                </p>
                {request.status === "pending" && (
                  <Button
                    onClick={() =>
                      handleUpdateClinicRequest(request.id, "cancelled")
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
  );
};
