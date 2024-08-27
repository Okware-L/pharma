"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PatientDashboard } from "./components/PatientDashboard";

const PatientPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view this page.</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100">
        <PatientDashboard user={user} />
      </main>
      <Footer />
    </>
  );
};

export default PatientPage;
