"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
  todayAppointments: number;
  totalPatients: number;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  todayAppointments,
  totalPatients,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Today's Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {todayAppointments}
          </div>
          <p className="text-gray-600">Scheduled for today</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Total Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {totalPatients}
          </div>
          <p className="text-gray-600">Registered patients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Upcoming Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">3</div>
          <p className="text-gray-600">Pending actions</p>
        </CardContent>
      </Card>
    </div>
  );
};
