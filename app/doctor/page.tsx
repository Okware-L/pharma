import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  VideoIcon,
  Clock,
  Search,
  PlusCircle,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("doctor")) {
    redirect("/");
  }

  // Mock data for doctor
  const doctorData = {
    name: "Dr. Jane Smith",
    specialty: "Internal Medicine",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
  };

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    { id: 1, patientName: "John Doe", time: "10:00 AM", type: "Follow-up" },
    {
      id: 2,
      patientName: "Alice Johnson",
      time: "11:30 AM",
      type: "New Patient",
    },
    {
      id: 3,
      patientName: "Bob Williams",
      time: "2:00 PM",
      type: "Consultation",
    },
  ];

  // Mock data for recent patients
  const recentPatients = [
    {
      id: 1,
      name: "John Doe",
      lastVisit: "2023-07-15",
      condition: "Hypertension",
    },
    {
      id: 2,
      name: "Alice Johnson",
      lastVisit: "2023-07-18",
      condition: "Type 2 Diabetes",
    },
    {
      id: 3,
      name: "Bob Williams",
      lastVisit: "2023-07-20",
      condition: "Asthma",
    },
    {
      id: 4,
      name: "Emily Brown",
      lastVisit: "2023-07-22",
      condition: "Arthritis",
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <Button>
          <VideoIcon className="mr-2 h-4 w-4" /> Start Telemedicine Call
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="/doctor-avatar-placeholder.png"
                  alt={doctorData.name}
                />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{doctorData.name}</h2>
                <p className="text-sm text-gray-500">{doctorData.specialty}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {doctorData.email}
              </p>
              <p>
                <strong>Phone:</strong> {doctorData.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <Search className="mr-2 h-4 w-4" /> Search Patient Records
            </Button>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
            </Button>
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" /> View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <TabsList>
          <TabsTrigger value="patients">Recent Patients</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="mb-4" />
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Appointment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Search messages..." />
                <p>Implement message list and chat functionality here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
