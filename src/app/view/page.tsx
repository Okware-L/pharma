"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const View = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen w-screen ">
        <Navbar />
        <div>
          <h1 className="text-3xl font-light text-center my-5">
            Your profile,{" "}
            <span className="text-sky-800 font-bold">{user.fullName}</span>
          </h1>
          <div></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isSignedIn) return null;
};

export default View;
