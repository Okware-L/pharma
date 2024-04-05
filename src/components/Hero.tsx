"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      <main>
        <div className="text-white bg-sky-700 rounded-2xl hidden sm:flex mb-20">
          <div className="border-r p-3 flex mx-2 items-center ">
            Pharmaceutical Distribution
            <ChevronRight />
          </div>
          <div className="border-r p-3 flex mx-2 items-center">
            Wholesale Medical Supplies <ChevronRight />
          </div>
          <div className="border-r p-3 flex mx-2 items-center">
            Pharmacy services & Technology <ChevronRight />
          </div>
          <div className="border-r p-3 flex mx-2 items-center">
            Solutions for Speciality Practices <ChevronRight />
          </div>
          <div className="p-3 flex mx-2 items-center">
            Solutions for Biopharma <ChevronRight />
          </div>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="bg-gray-200 rounded-l-2xl py-10">
            <h1 className="text-4xl font-medium text-left p-5">
              Touching Virtually Every Aspect of Health
            </h1>
            <p className=" font-extralight p-5 ">
              As a diversified healthcare leader, our solutions help patients
              access life-changing therapies, create a real difference for
              patients with cancer, and equip pharmacies, health systems and
              clinics with technologies to operate more effectively. We do all
              of this and much more as we pursue our mission to improve health
              outcomes for all.
            </p>
            <Button className="my-5 mx-5">Learn How</Button>
          </div>
          <div className="bg-hero bg-cover bg-center rounded-r-2xl"></div>
        </div>
      </main>
    </>
  );
}
