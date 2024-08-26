import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const services = [
    { title: "Emergency services", link: "/" },
    { title: "Symptom Checker", link: "/" },
    { title: "Pharmacy services & Technology", link: "/" },
    { title: "For Physicians", link: "/docapply" },
    { title: "Health Representatives", link: "/healthrepapply" },
    { title: "Education & Research", link: "/" },
  ];

  return (
    <section className="p-6 bg-gradient-to-b from-sky-800 to-sky-700 rounded-3xl shadow-xl m-4">
      <div className="text-white bg-sky-600/50 rounded-xl sm:flex mb-12 mt-6 p-2 gap-3 justify-between items-center hidden">
        {services.map((service, index) => (
          <Link
            key={index}
            href={service.link}
            className="group flex-1 min-w-fit"
          >
            <div className="flex items-center justify-center p-4 group-hover:bg-sky-600/75 rounded-lg transition-colors">
              <span className="text-sm font-light group-hover:scale-105 transition-transform">
                {service.title}
              </span>
              <ChevronRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-white">
        <div className="sm:w-1/2 text-center sm:text-left p-6 sm:p-10">
          <h1 className="sm:text-6xl text-4xl font-extrabold mb-8 leading-tight">
            Comprehensive Care, Anywhere, Anytime
          </h1>
          <p className="text-lg sm:text-xl font-light leading-relaxed mb-8">
            Experience holistic healthcare with top-tier medical professionals,
            all from the comfort of your home.
          </p>
          <Button className="bg-sky-950 hover:bg-sky-800 text-white px-8 py-3 rounded-full transition-colors">
            Book Appointment
          </Button>
        </div>

        <div className="sm:w-1/2 flex items-center justify-center p-6 sm:p-10 mt-8 sm:mt-0">
          <div className="bg-sky-950/50 rounded-full w-80 h-80 flex items-center justify-center shadow-2xl">
            <p className="text-2xl sm:text-3xl font-bold text-center">
              Trusted by thousands for online healthcare services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
