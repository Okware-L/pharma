import React from "react";
import { RoleGuard } from "@/components/role-guard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DoctorDashboard } from "./components/DoctorDashboard";

const DoctorsPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={["doctor", "admin"]}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <DoctorDashboard />
        <Footer />
      </div>
    </RoleGuard>
  );
};

export default DoctorsPage;
