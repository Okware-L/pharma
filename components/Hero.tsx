import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import React from "react";

import { Button } from "@/components/ui/button";

export default function Hero() {
  const services = [
    { title: "Emergency services", link: "/" },
    { title: "Symptom Checker", link: "/" },
    { title: "Pharmacy services & Technology", link: "/" },
    { title: "For Physicians", link: "/docapply" },
    { title: "Our Locations", link: "/" },
    { title: "Education & Research", link: "/" },
  ];

  return (
    <section className="p-3 bg-gradient-to-b from-sky-800 to-sky-700 rounded-3xl shadow-2xl m-2">
      <div className="text-white bg-sky-500/50 rounded-xl hidden sm:flex mb-10 mt-3 p-2 justify-between flex-wrap">
        {services.map((service, index) => (
          <Link key={index} href={service.link} className="flex-1 min-w-fit">
            <div className="flex items-center justify-center p-2 hover:bg-sky-500/50 rounded-lg transition-colors">
              {service.title}
              <ChevronRight className="ml-1" size={16} />
            </div>
          </Link>
        ))}
      </div>

      <h1 className="sm:text-5xl text-3xl text-white font-light text-center p-5 mb-8">
        JM-Qafri, right here, with you.
      </h1>

      <div className="grid text-slate-900 sm:grid-cols-2 gap-8 bg-gray-100 md:rounded-2xl overflow-hidden shadow-xl">
        <div className="sm:p-8 flex flex-col justify-center">
          <Image
            src="/assets/images/amb2.jpeg"
            alt="Healthcare"
            width="400"
            height="300"
            className="sm:hidden md:rounded-md mb-6"
          />
          <p className="font-extralight mb-6 sm:text-lg p-3">
            As a diversified healthcare leader, our solutions help patients
            access life-changing healthcare solutions, create a real difference
            for patients, and equip pharmacies, health systems and clinics with
            technologies to operate more effectively. We do all of this and much
            more as we pursue our mission to improve health outcomes for all.
          </p>
          <Button className="self-start bg-sky-950 hover:bg-sky-800 text-white px-8 py-3 rounded-full transition-colors m-3">
            Learn How
          </Button>
        </div>
        <div className="hidden md:block bg-hero bg-cover bg-center min-h-[400px]"></div>
      </div>
    </section>
  );
}
