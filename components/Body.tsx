"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

// Main Body Component
const Body = () => {
  return (
    <div className="bg-gradient-to-b from-sky-100 to-white">
      {/* Introduction for Patients & Doctors */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-indigo-100 p-8 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">
              Your Health, Your Way
            </h2>
            <p className="text-slate-900 mb-6">
              Welcome to a new era of healthcare. Manage your health records,
              consult with top specialists, and stay informed—all from the
              comfort of your home. Your well-being is just a click away.
            </p>
            <ul className="text-slate-900 list-disc pl-5 mb-6">
              <li>Easy access to your medical records</li>
              <li>Online consultations with certified doctors</li>
              <li>24/7 support and emergency care</li>
            </ul>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-indigo-100 p-8 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">
              Join Our Network of Top Physicians
            </h2>
            <p className="text-slate-900 mb-6">
              Be a part of a revolutionary healthcare platform. Expand your
              practice, reach more patients, and make a difference—anytime,
              anywhere.
            </p>
            <ul className="text-slate-900 list-disc pl-5 mb-6">
              <li>Expand your reach with telemedicine</li>
              <li>Flexible working hours</li>
              <li>Access to cutting-edge technology</li>
            </ul>
            <Button asChild>
              <Link href="/apply">Apply Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section className="py-16 bg-indigo-50">
        <div className="grid md:grid-cols-3 gap-10 px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">
              Comprehensive Health Records
            </h3>
            <p className="text-slate-900">
              All your health data in one secure place. Easily track, share, and
              manage your medical history.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">
              Seamless Telehealth Experience
            </h3>
            <p className="text-slate-900">
              Consult with doctors through video, audio, or chat. Get
              prescriptions and follow-ups, hassle-free.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">
              Patient-Centered Care
            </h3>
            <p className="text-slate-900">
              Our platform is designed with you in mind. Personalized care plans
              and reminders to keep you on track.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials & Success Stories */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-sky-50">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
          What Our Users Are Saying
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-white rounded-lg shadow-lg"
          >
            <p className="italic text-slate-900 mb-4">
              "This app has made managing my chronic condition so much easier. I
              can consult with my doctor anytime without leaving home."
            </p>
            <p className="text-right font-bold text-indigo-900">
              — Sarah P., Patient
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-white rounded-lg shadow-lg"
          >
            <p className="italic text-slate-900 mb-4">
              "Being part of this platform has allowed me to connect with more
              patients and offer flexible care options."
            </p>
            <p className="text-right font-bold text-indigo-900">
              — Dr. James L., Physician
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action & Signup Forms */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="grid md:grid-cols-2 gap-10 px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-sky-950/75 p-8 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <Button asChild className="w-full mt-6">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-sky-950/75 p-8 rounded-lg shadow-md"
          >
            <h2 className="text-3xl font-bold mb-4">
              Join Our Medical Network
            </h2>
            <Button asChild className="w-full mt-6">
              <Link href="/apply">Apply Today</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Closing Statement & Newsletter Signup */}
      <section className="py-12 bg-indigo-100 text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6">
          Stay Connected with Us
        </h2>
        <p className="text-slate-900 mb-6">
          Sign up for our newsletter to get the latest updates, health tips, and
          more.
        </p>
        <form className="max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button className="w-full mt-4 bg-sky-950 hover:bg-sky-800 text-white px-8 py-3 rounded-full transition-colors">
            Subscribe
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Body;
