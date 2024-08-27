"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "../actions";

interface AppointmentListProps {
  appointments: Appointment[];
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <ul className="space-y-2">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="text-sm p-2 bg-gray-100 rounded"
              >
                {appointment.date.toDate().toLocaleString()}:{" "}
                {appointment.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments scheduled.</p>
        )}
      </CardContent>
    </Card>
  );
};
