"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Autoplay from "embla-carousel-autoplay";

const products = [
  {
    id: 1,
    title: "Advanced Dermal Serum",
    description: "A revolutionary formula designed to rejuvenate and protect your skin at the cellular level. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt tempora eos possimus amet obcaecati optio velit aliquam harum veniam iste, in magni assumenda quia ratione modi non nihil. Dolorem pariatur repudiandae sint veniam a?",
    image: "https://www.lorealparis.co.in/-/media/project/loreal/brand-sites/oap/apac/in/products/revitalift-filler/ha-serum/20221115_digital_revitalift-filler_ha-serum_main-image_atf01_dmi_image_na_no-cta.png",
    href: "/details/advanced-dermal-serum",
  },
  {
    id: 2,
    title: "Hydro-Boost Moisturizer",
    description: "Intense hydration that lasts all day, leaving your skin feeling soft, supple, and refreshed.",
    image: "https://static.vecteezy.com/system/resources/thumbnails/033/020/763/small_2x/blank-unbranded-cosmetic-serum-bottle-on-transparent-background-skin-care-product-cut-out-pink-glass-dropper-mockup-skincare-beauty-front-view-ready-for-your-label-design-generative-ai-png.png",
    href: "/details/hydro-boost-moisturizer",
  },
  {
    id: 3,
    title: "Purifying Clay Mask",
    description: "Detoxify your pores and draw out impurities for a clearer, more radiant complexion.",
    image: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Osufi_Collagen_Serum_King_Serum_300_mg-Osufi-e0e3f-442181.png",
    href: "/details/purifying-clay-mask",
  },
  {
    id: 4,
    title: "Age-Defy Eye Cream",
    description: "Targets fine lines, wrinkles, and dark circles for a brighter, more youthful appearance.",
    image: "https://isclinicalskincare.co.za/wp-content/uploads/2022/02/as_30ml_center_shadow_seal.png",
    href: "/details/age-defy-eye-cream",
  },
];

// OPTIMIZATION: Switched from 'x' to 'translateX' for hardware acceleration.
const variants = {
  enter: (direction) => ({
    translateX: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    translateX: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    translateX: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const HeroSection = () => {

// Fetch real-time billboard data from Convex
  const billboards = useQuery(api.billboards.getBillboards);
  
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    // Ensure billboards is not empty before paginating
    if (billboards && billboards.length > 0) {
      setPage([(page + newDirection + billboards.length) % billboards.length, newDirection]);
    }
  };

  useEffect(() => {
    // Only set the timer if there are billboards to cycle through
    if (billboards && billboards.length > 0) {
      const timer = setTimeout(() => paginate(1), 4000);
      return () => clearTimeout(timer);
    }
  }, [page, billboards]);

  // Loading State: Show a spinner while data is being fetched
  if (billboards === undefined) {
    return (
      <div className="relative w-full h-[90vh] lg:h-[80vh] flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Empty State: Show a message if no billboards are in the database
  if (!billboards || billboards.length === 0) {
    return (
      <div className="relative w-full h-[90vh] lg:h-[80vh] flex items-center justify-center text-center bg-gray-50 p-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">Hero Section Not Configured</h2>
          <p className="text-gray-500 mt-2">Add a billboard in the admin dashboard to display it here.</p>
        </div>
      </div>
    );
  }

  const billboardIndex = page % billboards.length;
  const billboard = billboards[billboardIndex];

  return (
    <div className="relative w-full h-[100vh] md:h-[90vh] lg:h-[80vh] 2xl:h-[60vh] overflow-hidden flex items-center justify-center font-sans mt-5">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
            // OPTIMIZATION: Added will-change to hint to the browser about upcoming transform changes.
            className="absolute w-full h-full grid grid-cols-1 md:grid-cols-2 items-center gap-2"
            style={{ willChange: 'transform' }}
          >
            {/* Image section */}
            <motion.div 
              className="flex items-center justify-center md:p-8 order-1 md:order-2 relative"
              key={`image-${billboard._id}`}
              // OPTIMIZATION: Using hardware-accelerated 'scale' and 'opacity'.
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Image
                src={billboard.imageUrl}
                alt={billboard.title}
                width={500} // Provide the largest potential width of the source image
                height={500} // Provide the largest potential height
                // priority={product.id === 1} // Prioritize the first image
                priority={billboardIndex === 0} // Prioritize the first image
                // OPTIMIZATION: The 'sizes' prop tells the browser to load smaller images on smaller screens.
                sizes="(max-width: 768px) 320px, (max-width: 1024px) 320px, 384px"
                className="h-80 w-80 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain rounded-full bg-rose-100 shadow-2xl"
              />
            </motion.div>

            {/* Text content section */}
            <div className="text-center md:text-left 2xl:mx-10 p-4 md:p-8 order-2 md:order-1">
              <motion.h1
                key={`title-${billboard.id}`}
                // OPTIMIZATION: Switched from 'y' to 'translateY' for hardware acceleration.
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ willChange: 'transform, opacity' }}
                className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight mb-4 lg:mx-8"
              >
                {billboard.title}
              </motion.h1>
              <motion.p
                key={`desc-${billboard._id}`}
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ willChange: 'transform, opacity' }}
                className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 lg:mx-8"
              >
                {billboard.description}
              </motion.p>
              <motion.div
                key={`button-${billboard._id}`}
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ willChange: 'transform, opacity' }}
              >
                <Link href={`/details/${billboard.productSlug}`} passHref>
                  <Button className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 mx-8 cursor-pointer">
                    View Details
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-4 md:left-8 2xl:left-2 transform -translate-y-1/2 z-20 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition-colors hidden lg:flex cursor-pointer"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        className="absolute top-1/2 right-4 md:right-8 2xl:right-2 transform -translate-y-1/2 z-20 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition-colors hidden lg:flex cursor-pointer"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {billboards.map((_, i) => (
          <div
            key={i}
            onClick={() => setPage([i, i > billboardIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              i === billboardIndex ? 'bg-gray-800' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
