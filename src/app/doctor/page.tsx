import React from "react";
import { redirect } from "next/navigation";
import { checkRole } from "../../../utils/roles";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function page() {
  if (!checkRole("doctor")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-screen">
      <Navbar />
      <div></div>
      <Footer />
    </div>
  );
}
