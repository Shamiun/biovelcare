// components/HomepageAboutUs.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// You can replace this with your actual team data.
// Using the same members from the TeamIntroduction for consistency.
const teamHighlights = [
  {
    name: "Abu Taleb",
    role: "Chairmen",
    description: "Dr. Reed's pioneering research in cellular rejuvenation is the scientific backbone of our entire product line.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/abu-taleb.jpg",
    href: "/about#evelyn-reed",
  },
  {
    name: "Abdullah Al Masud",
    role: "Managing Director",
    description: "Marcus ensures that our passion for effective, natural skincare translates into products our customers love and trust.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/joney-edited.jpg",
    href: "/about#marcus-thorne",
  },
  {
    name: "Abdullah Al Maruf",
    role: "Head of sales and operation",
    description: "Marcus ensures that our passion for effective, natural skincare translates into products our customers love and trust.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-10-at-23.14.29_269d2ba5-2.jpg",
    href: "/about#marcus-thorne",
  },
  {
    name: "Marcus Thorne",
    role: "CEO & Product Visionary",
    description: "Marcus ensures that our passion for effective, natural skincare translates into products our customers love and trust.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/about#marcus-thorne",
  },
];

const AboutUs = () => {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Board of Directors
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The driving force behind our commitment to science and nature.
          </p>
        </div>

        <div className="space-y-20">
          {teamHighlights.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
            >
              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className={`relative aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl ${
                  index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                 {/* Decorative background shape */}
                <div className={`absolute -top-10 -left-10 w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${index % 2 !== 0 ? 'lg:-right-10 lg:left-auto' : ''}`}></div>
              </motion.div>

              {/* Text Column */}
              <div
                className={`flex flex-col items-center lg:items-start text-center lg:text-left ${
                  index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                >
                    <h3 className="text-3xl font-bold text-gray-800">{person.name}</h3>
                    <p className="text-purple-600 font-semibold mt-1 mb-4">{person.role}</p>
                    <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
                      {person.description}
                    </p>
                    {/* <Link href="/about" passHref legacyBehavior>
                      <a className="inline-flex items-center font-semibold text-gray-800 mt-6 group">
                        Learn More About Our Team
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </Link> */}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
