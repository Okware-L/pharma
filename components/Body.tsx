"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";

const Body = () => {
  const features = [
    {
      title: "Health Records",
      description: "Secure access to your complete medical history",
    },
    {
      title: "Telehealth",
      description: "On-demand video consultations with specialists",
    },
    {
      title: "Personalized Care",
      description: "AI-driven care plans and smart reminders",
    },
    {
      title: "Health Tracking",
      description: "Integrate wearables for real-time health monitoring",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-white">
      {/* Section 1: Introduction */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold text-sky-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Revolutionizing Healthcare Access
            </motion.h2>
            <motion.p
              className="text-xl text-sky-700 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience seamless health management with cutting-edge technology
              and compassionate care, all at your fingertips.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                asChild
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                className="bg-white hover:bg-sky-50 text-sky-600 px-8 py-3 rounded-full transition-colors text-lg font-semibold border-2 border-sky-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Features */}
      <section className="py-20 sm:py-32 bg-sky-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Empowering Features
          </h2>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-sky-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              >
                <div className="flex-grow">
                  <Check className="text-sky-300 mb-4" size={28} />
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sky-100">{feature.description}</p>
                </div>
                <Link
                  href={`/feature/${feature.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="mt-4 inline-flex items-center text-sky-300 hover:text-sky-100 transition-colors"
                >
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 3: Testimonial */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-sky-600 to-sky-700 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Transforming Lives
            </h2>
            <blockquote className="text-xl sm:text-2xl italic mb-6">
              "This platform has not just improved my health management; it's
              given me back control over my life. The convenience and quality of
              care are unmatched."
            </blockquote>
            <p className="font-semibold">— Sarah P., Chronic Care Patient</p>
          </motion.div>
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-[url('/pattern.svg')] bg-repeat"></div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Call-to-Action */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-sky-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ready to Transform Your Healthcare Experience?
            </motion.h2>
            <motion.p
              className="text-xl text-sky-700 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of satisfied users who've taken control of their
              health journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                asChild
                className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-4 rounded-full transition-all text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Link href="/signup">Get Started Now</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Newsletter Signup */}
      <section className="py-20 sm:py-32 bg-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 text-center mb-8">
              Stay Informed
            </h2>
            <p className="text-sky-700 text-center mb-8">
              Get the latest health insights and platform updates delivered to
              your inbox.
            </p>
            <form className="flex flex-col sm:flex-row shadow-lg rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow p-4 sm:p-5 border-none focus:outline-none focus:ring-2 focus:ring-sky-500 text-sky-900"
              />
              <Button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 sm:py-5 transition-colors text-lg font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Body;
