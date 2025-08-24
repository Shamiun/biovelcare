"use client"; // This component uses hooks, so it must be a client component

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

// --- Installation ---
// You'll need to install Embla Carousel and its Autoplay plugin:
// npm install embla-carousel-react embla-carousel-autoplay
// ---

// Data for the carousel.
const countries = [
  {
    name: "United States",
    imageUrl:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2149&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/country/usa",
  },
  {
    name: "United Kingdom",
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/country/uk",
  },
  {
    name: "Canada",
    imageUrl:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/country/canada",
  },
  {
    name: "Australia",
    imageUrl:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2149&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/country/australia",
  },
  {
    name: "Germany",
    imageUrl:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/country/germany",
  },
  {
    name: "Japan",
    imageUrl:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/country/japan",
  },
];

const CountryCard = ({ name, imageUrl, href }) => (
  <Link href={href} passHref>
    <motion.div
      className="group relative flex-shrink-0 w-full h-96 rounded-3xl overflow-hidden shadow-lg cursor-pointer"
      whileHover={{ scale: 1.05, y: -10, transition: { duration: 0.3 } }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative flex flex-col justify-end h-full p-6 text-white z-10">
        <h3 className="text-3xl font-black tracking-tight">{name}</h3>
        <div
          className="flex items-center gap-2 mt-2 text-blue-300 font-semibold transition-all duration-300 
                       opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
        >
          <span>View Universities</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function CountryCarousel() {
  // Embla Carousel setup with the Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    // --- FIX: 'stopOnInteraction' is set to 'false' ---
    // This ensures that the autoplay resumes after a manual swipe.
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className=" py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Browse by Country
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore top study destinations and find the perfect environment for
            your growth.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* --- FEATURE: Left Arrow --- */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white/80 dark:bg-black/80 p-2 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
        >
          <ChevronLeft className="text-gray-800 dark:text-white" />
        </button>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {/* We duplicate the array to create a seamless looping effect */}
            {[...countries, ...countries].map((country, index) => (
              <div
                className="embla__slide flex-[0_0_80%] md:flex-[0_0_20rem] pl-4"
                key={`${country.name}-${index}`}
              >
                <CountryCard {...country} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/all-country">
              <Button className="cursor-pointer">
                See All Countries <ArrowRight className="" />
              </Button>
            </Link>
          </div>
        </div>

        {/* --- FEATURE: Right Arrow --- */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white/80 dark:bg-black/80 p-2 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
        >
          <ChevronRight className="text-gray-800 dark:text-white" />
        </button>
      </div>
    </section>
  );
}
