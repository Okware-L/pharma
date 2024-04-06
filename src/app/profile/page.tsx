import React from "react";
import { UserProfile } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div className=" w-screen min-h-screen ">
      <Navbar />
      <div className="flex justify-center items-center my-20">
        <UserProfile />
      </div>
      <Footer />
    </div>
  );
};

export default page;
