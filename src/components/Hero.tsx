"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      <main>
        <div className="text-white bg-sky-700 rounded-2xl hidden sm:flex mb-10 mt-3">
          <div className="md:border-r p-3 flex mx-2 items-center ">
            Emergency services
            <ChevronRight />
          </div>
          <div className="md:border-r p-3 flex mx-2 items-center">
            Symptom Checker
            <ChevronRight />
          </div>
          <div className="md:border-r p-3 flex mx-2 items-center">
            Pharmacy services & Technology
            <ChevronRight />
          </div>
          <Link href="/docapply">
            <div className="md:border-r p-3 flex mx-2 items-center">
              For Physicians
              <ChevronRight />
            </div>
          </Link>
          <div className="p-3 md:border-r flex mx-2 items-center">
            Our Locations
            <ChevronRight />
          </div>
          <div className="p-3 flex mx-2 items-center">
            Education & Research
            <ChevronRight />
          </div>
        </div>

        <h1 className="text-4xl font-light text-left p-5">
          JM-Qafri, right here, with you.
        </h1>
        <div className="grid sm:grid-cols-2 mt-5">
          <div className="bg-gray-200 rounded-l-2xl py-10">
            <Image
              src="/doc.jpg"
              alt="hm"
              width="400"
              height="300"
              className="sm:hidden rounded-md p-3"
            />
            <p className=" font-extralight p-5 ">
              As a diversified healthcare leader, our solutions help patients
              access life-changing healthcare solutions, create a real
              difference for patients, and equip pharmacies, health systems and
              clinics with technologies to operate more effectively. We do all
              of this and much more as we pursue our mission to improve health
              outcomes for all.
            </p>
            <Button className="my-5 mx-5 bg-sky-950 hover:bg-sky-800">
              Learn How
            </Button>
          </div>
          <div className="bg-hero bg-cover bg-center rounded-r-2xl"></div>
        </div>
      </main>
    </>
  );
}
