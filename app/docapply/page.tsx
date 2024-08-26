"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

interface IFormInput {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  motivation: string;
  availability: "full-time" | "part-time";
  certifications: string;
  references: string;
}

const steps = [
  "Personal Information",
  "Professional Details",
  "Motivation",
  "Additional Information",
];

export default function DoctorApplicationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (currentStep !== steps.length - 1) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "docApply"), {
        ...data,
        appliedAt: new Date(),
        status: "pending",
      });
      toast({
        title: "Application Submitted Successfully",
        description:
          "Your application is being reviewed. We will get back to you soon.",
      });
      // Redirect to homepage after a short delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              Join the JM-Qafri Medical Team
            </h2>
            <div className="mb-8">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
                        index <= currentStep
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-300"
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="text-xs mt-2">{step}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        {...register("fullName", {
                          required: "Full name is required",
                        })}
                        className="mt-1"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                        className="mt-1"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        {...register("specialization", {
                          required: "Specialization is required",
                        })}
                        className="mt-1"
                      />
                      {errors.specialization && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.specialization.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        {...register("experience", {
                          required: "Experience is required",
                        })}
                        className="mt-1"
                      />
                      {errors.experience && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.experience.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <RadioGroup defaultValue="full-time" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="full-time"
                            id="full-time"
                            {...register("availability")}
                          />
                          <Label htmlFor="full-time">Full-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="part-time"
                            id="part-time"
                            {...register("availability")}
                          />
                          <Label htmlFor="part-time">Part-time</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="motivation">
                        Why do you want to join JM-Qafri?
                      </Label>
                      <Textarea
                        id="motivation"
                        {...register("motivation", {
                          required: "Motivation is required",
                        })}
                        className="mt-1"
                        rows={5}
                      />
                      {errors.motivation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.motivation.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="certifications">
                        Certifications (comma-separated)
                      </Label>
                      <Input
                        id="certifications"
                        {...register("certifications")}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="references">References (optional)</Label>
                      <Textarea
                        id="references"
                        {...register("references")}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
              <div className="mt-8 flex justify-between">
                {currentStep > 0 && (
                  <Button type="button" onClick={prevStep} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    "Submit Application"
                  ) : (
                    <>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
