import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, ClipboardList, UserPlus } from "lucide-react";

interface OverviewTabProps {
  patientCount: number;
  doctorCount: number;
  clinicRequestCount: number;
  healthRepApplicationCount: number;
}

export function OverviewTab({
  patientCount,
  doctorCount,
  clinicRequestCount,
  healthRepApplicationCount,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{patientCount}</div>
          <p className="text-xs text-muted-foreground">
            Total registered patients
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doctors</CardTitle>
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{doctorCount}</div>
          <p className="text-xs text-muted-foreground">Active doctors</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clinic Requests</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clinicRequestCount}</div>
          <p className="text-xs text-muted-foreground">Pending requests</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Health Rep Applications
          </CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{healthRepApplicationCount}</div>
          <p className="text-xs text-muted-foreground">New applications</p>
        </CardContent>
      </Card>
    </div>
  );
}
