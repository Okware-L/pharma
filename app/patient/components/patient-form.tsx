"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PatientForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: user?.email || "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    currentMedications: "",
    chronicConditions: "",
    familyMedicalHistory: "",
    smoker: false,
    alcoholConsumption: "",
    exerciseFrequency: "",
    diet: "",
    lastPhysicalExam: "",
    primaryCarePhysician: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, "patients", user.uid), formData);
        alert("Patient profile updated successfully!");
      } catch (error) {
        console.error("Error updating patient profile:", error);
        alert("Error updating patient profile. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Records</h1>
        <div>
          <span className="mr-4">Welcome, {user?.email}</span>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Complete Your Patient Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <Input
              name="dateOfBirth"
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
            <Select
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <Input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <Input
              name="state"
              placeholder="Country"
              value={formData.state}
              onChange={handleInputChange}
            />
            <Input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="emergencyContactName"
              placeholder="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
            />
            <Input
              name="emergencyContactPhone"
              placeholder="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
            />
            <Input
              name="insuranceProvider"
              placeholder="Insurance Provider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
            />
            <Input
              name="insurancePolicyNumber"
              placeholder="Insurance Policy Number"
              value={formData.insurancePolicyNumber}
              onChange={handleInputChange}
            />
          </div>
          <Textarea
            name="allergies"
            placeholder="Allergies"
            value={formData.allergies}
            onChange={handleInputChange}
          />
          <Input
            name="primaryCarePhysician"
            placeholder="Primary Care Physician"
            value={formData.primaryCarePhysician}
            onChange={handleInputChange}
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </div>
    </div>
  );
}
