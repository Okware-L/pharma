import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      <main>
        <div className="flex">
          <div>Pharmaceutical Distribution</div>
          <div>Wholesale Medical Supplies</div>
          <div>Pharmacy services & Technology</div>
          <div>Solutions for Speciality Practices</div>
          <div>Solutions for Biopharma</div>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="bg-gray-100 rounded-l-2xl py-10">
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
