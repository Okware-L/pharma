"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Facebook,
  MessageCircle,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function Footer() {
  const newsItems = [
    {
      title: "Presentation of the 2023 full-year results for JM-Qafri",
      date: "2024-02-01",
    },
    {
      title: "More news on JM-Qafri telemedicine",
      date: "2023-12-07",
    },
    {
      title: "Update on Africa pharmaceuticals",
      date: "2023-11-27",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-sky-50 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-sky-900 mb-8 text-center">
            Latest News
          </h2>
          <div className="space-y-6 mb-12">
            {newsItems.map((item, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-sky-200 pb-4"
              >
                <h3 className="text-xl font-light text-sky-800 mb-2 hover:text-sky-600 transition-colors">
                  <Link href="#">{item.title}</Link>
                </h3>
                <div className="flex items-center justify-between text-sm text-sky-600">
                  <time dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <div className="space-x-2">
                    <Link
                      href="#"
                      className="hover:text-sky-800 transition-colors"
                    >
                      EN
                    </Link>
                    <Link
                      href="#"
                      className="hover:text-sky-800 transition-colors"
                    >
                      DE
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="text-center mb-16">
            <Button
              variant="outline"
              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
            >
              View All News
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-sky-200 pt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <h4 className="font-semibold text-sky-900 mb-3">Quick Links</h4>
              <Link
                href="#"
                className="block text-sky-600 hover:text-sky-800 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="block text-sky-600 hover:text-sky-800 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="#"
                className="block text-sky-600 hover:text-sky-800 transition-colors"
              >
                Legal
              </Link>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sky-900 mb-3">Policies</h4>
              <Link
                href="#"
                className="block text-sky-600 hover:text-sky-800 transition-colors"
              >
                Data Privacy Policy
              </Link>
              <Link
                href="#"
                className="block text-sky-600 hover:text-sky-800 transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>

          <p className="text-sm text-sky-700 mb-8 max-w-3xl mx-auto text-center">
            Certain products and services of JM-Qafri are not accessible to
            residents and/or nationals of certain countries. Please consult our
            Terms of use and contact your nearest JM-Qafri entity for
            information on available products and services.
          </p>

          <div className="flex justify-center space-x-6 mb-8">
            <Link
              href="#"
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>
          </div>

          <p className="text-sm text-sky-600 text-center">
            ©2024 JM-Qafri. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
