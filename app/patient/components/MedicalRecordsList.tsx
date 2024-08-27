"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalRecord } from "../actions";

interface MedicalRecordsListProps {
  recentRecords: MedicalRecord[];
}

export const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({
  recentRecords,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Medical Records</CardTitle>
      </CardHeader>
      <CardContent>
        {recentRecords.length > 0 ? (
          <ul className="space-y-2">
            {recentRecords.map((record, index) => (
              <li key={index} className="text-sm p-2 bg-gray-100 rounded">
                {record.date}: {record.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent medical records found.</p>
        )}
      </CardContent>
    </Card>
  );
};
