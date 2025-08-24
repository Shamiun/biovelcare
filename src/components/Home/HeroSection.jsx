"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

// NOTE: Added 'href' for the Link component
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

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const HeroSection = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([(page + newDirection + products.length) % products.length, newDirection]);
  };

  useEffect(() => {
    const timer = setTimeout(() => paginate(1), 4000);
    return () => clearTimeout(timer);
  }, [page]);

  const productIndex = page % products.length;
  const product = products[productIndex];

  return (
    <div className="relative w-full h-[90vh] lg:h-[80vh] overflow-hidden flex items-center justify-center font-sans mt-5">
      {/* Background is now handled by layout.js, so this component doesn't need its own background styles */}
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
            className="absolute w-full h-full grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            {/* Image section - now larger on mobile */}
            <motion.div 
              className="flex items-center justify-center md:p-8 order-1 md:order-2 relative"
              key={`image-${product.id}`} // Add key to force re-animation
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
            >
              <Image
                src={product.image}
                alt={product.title}
                width={400} // The actual width of the source image
                height={400} // The actual height of the source image
                priority // Helps with Largest Contentful Paint (LCP)
                className="h-80 w-80 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-full bg-rose-100 shadow-2xl"
              />
            </motion.div>

            {/* Text content section */}
            <div className="text-center md:text-left p-4 md:p-8 order-2 md:order-1">
              <motion.h1
                key={`title-${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight mb-4 lg:mx-8"
              >
                {product.title}
              </motion.h1>
              <motion.p
                key={`desc-${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 lg:mx-8"
              >
                {product.description}
              </motion.p>
              <motion.div
                key={`button-${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href={product.href} passHref>
                  <Button className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 mx-8 cursor-pointer">
                    View Details
                  </Button>
                  
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        className="absolute top-1/2 left-4 md:left-8 2xl:left-2 transform -translate-y-1/2 z-20 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition-colors hidden lg:flex"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        className="absolute top-1/2 right-4 md:right-8 2xl:right-2 transform -translate-y-1/2 z-20 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition-colors hidden lg:flex"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {products.map((_, i) => (
          <div
            key={i}
            onClick={() => setPage([i, i > productIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              i === productIndex ? 'bg-gray-800' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
