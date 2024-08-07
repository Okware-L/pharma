"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React, { useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import Image from "next/image";

interface Application {
  fullName: string;
  email: string;
  experience: string;
  resumeLink: string;
  coverLetter: string;
}

interface FormErrors {
  fullName: string;
  email: string;
  experience: string;
  resumeLink: string;
  coverLetter: string;
}

export default function Page() {
  const [application, setApplication] = useState<Application>({
    fullName: "",
    email: "",
    experience: "",
    resumeLink: "",
    coverLetter: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    experience: "",
    resumeLink: "",
    coverLetter: "",
  });

  const isFormValid = (form: Application): boolean => {
    return (
      form.fullName.trim() !== "" &&
      form.email.trim() !== "" &&
      form.experience.trim() !== "" &&
      form.resumeLink.trim() !== "" &&
      form.coverLetter.trim() !== ""
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setApplication((prevApplication) => ({
      ...prevApplication,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (isFormValid(application)) {
      try {
        const col = collection(db, "docApplications");
        await addDoc(col, {
          fullName: application.fullName,
          email: application.email,
          experience: application.experience,
          resumeLink: application.resumeLink,
          coverLetter: application.coverLetter,
        });

        //toast ?
        toast("Application submitted successfully", {
          duration: 5000,
        });

        // reload the page upon successful submission
      } catch (error) {
        console.error("Error submitting application:", error);

        toast("Failed to submit application", {
          duration: 5000,
        });
        window.location.reload();
      }
    } else {
      // show an error message or highlight the empty fields
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        fullName:
          application.fullName.trim() === "" ? "This field is required" : "",
        email: application.email.trim() === "" ? "This field is required" : "",
        experience:
          application.experience.trim() === "" ? "This field is required" : "",
        resumeLink:
          application.resumeLink.trim() === "" ? "This field is required" : "",
        coverLetter:
          application.coverLetter.trim() === "" ? "This field is required" : "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div>
        <h1 className="text-3xl text-center pt-5">
          The best way to grow your practice and professional network.
        </h1>
        <div className="flex justify-center py-5">
          <Image src="/doc.jpg" alt="doc" width="800" height="500" />
        </div>
        <div className="">
          <p className="p-5 font-extralight my-5">
            Becoming a JMQafri doctor offers numerous benefits, combining
            traditional medical knowledge with modern practices to provide
            comprehensive healthcare solutions. With a deep understanding of
            both Eastern and Western medical approaches, JMQafri doctors can
            offer patients a holistic treatment plan tailored to their
            individual needs. This unique combination allows for a more
            integrated approach to healthcare, addressing not only physical
            ailments but also considering mental, emotional, and spiritual
            well-being. JMQafri doctors often emphasize preventive care and
            lifestyle changes, aiming to promote long-term health and wellness.
          </p>
          <div className="flex justify-center items-center p-5">
            <div className="w-full p-5 rounded-lg shadow-md">
              <h2 className="text-3xl font-light text-center mb-6 text-black">
                Job Application Form
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium"
                  >
                    Full Name
                  </label>
                  <Input
                    name="fullName"
                    value={application.fullName}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md"
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500">{formErrors.fullName}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email Address
                  </label>
                  <Input
                    name="email"
                    value={application.email}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md"
                  />
                  {formErrors.email && (
                    <p className="text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-black"
                  >
                    Experience (years)
                  </label>
                  <Input
                    name="experience"
                    value={application.experience}
                    onChange={handleChange}
                    type="number"
                    className="mt-1 p-2 w-full border-gray-300 rounded-md"
                  />
                  {formErrors.experience && (
                    <p className="text-red-500">{formErrors.experience}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="resumeLink"
                    className="block text-sm font-medium text-black"
                  >
                    Resume Link
                  </label>
                  <Input
                    name="resumeLink"
                    value={application.resumeLink}
                    onChange={handleChange}
                    type="url"
                    className="mt-1 p-2 w-full border-gray-300 rounded-md"
                  />
                  {formErrors.resumeLink && (
                    <p className="text-red-500">{formErrors.resumeLink}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="coverLetter"
                    className="block text-sm font-medium text-black"
                  >
                    Cover Letter
                  </label>
                  <Textarea
                    name="coverLetter"
                    //rows="4"
                    value={application.coverLetter}
                    //onChange={handleChange}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md"
                  ></Textarea>
                  {formErrors.coverLetter && (
                    <p className="text-red-500">{formErrors.coverLetter}</p>
                  )}

                  <button className="my-3 btn w-full bg-black hover:bg-gray-700 text-white">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
