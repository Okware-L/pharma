import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create doctors
  const drSmith = await prisma.doctor.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      name: "Dr. Jane Smith",
      email: "jane.smith@example.com",
      specialty: "Internal Medicine",
      phone: "+1 (555) 987-6543",
    },
  });

  const drDoe = await prisma.doctor.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      name: "Dr. John Doe",
      email: "john.doe@example.com",
      specialty: "Cardiology",
      phone: "+1 (555) 123-4567",
    },
  });

  // Create patients
  const alice = await prisma.patient.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@example.com",
      dateOfBirth: new Date("1985-03-15"),
      gender: "Female",
      contactNumber: "+1 (555) 111-2222",
      address: "123 Main St, Anytown, USA",
      bloodType: "A+",
      allergies: ["Penicillin", "Peanuts"],
      chronicConditions: ["Asthma"],
      appointments: {
        create: {
          dateTime: new Date("2023-08-15T10:00:00Z"),
          type: "Check-up",
          notes: "Regular check-up appointment",
          doctor: { connect: { id: drSmith.id } },
        },
      },
      vitalSigns: {
        create: {
          bloodPressure: "120/80",
          heartRate: 72,
          temperature: 98.6,
          respiratoryRate: 16,
          oxygenSaturation: 98,
        },
      },
      labResults: {
        create: {
          testName: "Complete Blood Count",
          result: "Normal",
          unit: "",
          normalRange: "N/A",
        },
      },
    },
  });

  const bob = await prisma.patient.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Williams",
      email: "bob@example.com",
      dateOfBirth: new Date("1978-09-22"),
      gender: "Male",
      contactNumber: "+1 (555) 333-4444",
      address: "456 Elm St, Somewhere, USA",
      bloodType: "O-",
      allergies: ["Shellfish"],
      chronicConditions: ["Hypertension", "Type 2 Diabetes"],
      appointments: {
        create: [
          {
            dateTime: new Date("2023-08-16T14:30:00Z"),
            type: "Follow-up",
            notes: "Follow-up on recent lab results",
            doctor: { connect: { id: drDoe.id } },
          },
          {
            dateTime: new Date("2023-09-01T11:00:00Z"),
            type: "Consultation",
            notes: "Discuss new treatment options",
            doctor: { connect: { id: drDoe.id } },
          },
        ],
      },
      vitalSigns: {
        create: {
          bloodPressure: "130/85",
          heartRate: 68,
          temperature: 98.4,
          respiratoryRate: 14,
          oxygenSaturation: 97,
        },
      },
      labResults: {
        create: [
          {
            testName: "HbA1c",
            result: "6.8",
            unit: "%",
            normalRange: "4.0 - 5.6",
          },
          {
            testName: "Lipid Panel",
            result: "Elevated LDL",
            unit: "",
            normalRange: "LDL < 100 mg/dL",
          },
        ],
      },
    },
  });

  // Create doctor notes
  await prisma.doctorNote.createMany({
    data: [
      {
        patientId: alice.id,
        doctorId: drSmith.id,
        content:
          "Patient reports improved asthma symptoms. Continuing current treatment plan.",
      },
      {
        patientId: bob.id,
        doctorId: drDoe.id,
        content: "Blood pressure has improved. Adjusting medication dosage.",
      },
    ],
  });

  console.log({ drSmith, drDoe, alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
