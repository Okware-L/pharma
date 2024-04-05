import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Content() {
  return (
    <>
      <div
        className=" bg-contentbg bg-cover bg-center bg-no-repeat flex sm:m-20 my-14
         "
      >
        <div className="p-10 bg-sky-950 bg-opacity-65 backdrop-blur-sm text-gray-100  ">
          <h1 className=" text-2xl sm:text-3xl font-light text-left mb-5">
            Solutions for your pharmacy, hospital, medical practice or biopharma
            company
          </h1>

          <h2 className="flex font-light ">
            <ChevronRight />
            Online consultations and appointments
          </h2>
          <p className="font-extralight my-2 p-3 ">
            Online consultations and appointments offer a convenient and
            accessible way for patients to connect with healthcare professionals
            remotely.
          </p>
          <div className="hidden sm:block">
            <h2 className=" flex font-light">
              <ChevronRight />
              Emergency medical services (EMS)
            </h2>
            <p className="font-extralight my-2 p-3">
              These services are essential for interfacility transfers of
              critical care patients and on-scene responses in support of
              ground-based EMS.
            </p>
            <h2 className="flex font-light">
              <ChevronRight />
              Training and qualifications for emergency medical services
            </h2>
            <p className="font-extralight my-2 p-3">
              These training programs ensure that EMS personnel are
              well-equipped to handle a wide range of medical emergencies and
              provide the necessary care to patients.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/**next section */}

        <div className="grid sm:grid-cols-2">
          <div className="bg-content1 bg-cover bg-center   rounded-l-2xl"></div>

          <div className="bg-sky-300  rounded-r-2xl py-8">
            <h1 className="text-2xl font-medium text-left p-5">
              Delivering on Innovative Medical Breakthroughs
            </h1>
            <Badge className="mx-5">Our Stories</Badge>
            <p className=" font-extralight p-3 ">
              Embracing cutting-edge research and technology to bring
              groundbreaking medical advancements to the forefront of
              healthcare. Our commitment to delivering innovative solutions that
              revolutionize patient care and treatment outcomes.
            </p>
            <Button variant="link" className="my-5 mx-5">
              Read More
            </Button>
          </div>
        </div>

        {/**next section */}

        <div className="grid sm:grid-cols-2">
          <div className="bg-teal-200 rounded-l-2xl py-8">
            <h1 className="text-2xl font-medium text-left p-5">
              Providing an Oasis to Pharmacy Deserts
            </h1>
            <Badge className="mx-5">Pharma</Badge>
            <p className=" font-extralight p-3 ">
              Creating a lifeline for underserved communities by establishing
              accessible pharmacy services in areas lacking adequate healthcare
              resources. Our mission is to bridge the gap and ensure all
              individuals have convenient access to essential medications and
              healthcare support.
            </p>
            <Button variant="link" className="my-5 mx-5 ">
              Read More
            </Button>
          </div>
          <div className="bg-content2 bg-cover bg-center rounded-r-2xl "></div>
        </div>

        {/**next section */}

        <div className="grid sm:grid-cols-2">
          <div className="bg-content3 bg-cover bg-center rounded-l-2xl "></div>

          <div className="bg-sky-500 rounded-r-2xl py-8">
            <h1 className="text-2xl font-medium text-left p-5">
              Empowering Patients Through Telemedicine{" "}
            </h1>
            <Badge className="mx-5">Our Stories</Badge>
            <p className=" font-extralight p-3 ">
              Harnessing the power of telemedicine to empower patients with
              convenient access to healthcare services and expert medical advice
              from the comfort of their homes. By leveraging technology, we aim
              to enhance patient engagement, improve health outcomes, and
              promote proactive healthcare management.
            </p>
            <Button variant="link" className="my-5 mx-5 ">
              Read More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
