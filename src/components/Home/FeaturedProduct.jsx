// components/FeaturedProducts.jsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import Image from 'next/image';

// Convex imports for fetching real data
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

// --- Reusable & Optimized ProductCard Component ---
const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03, translateY: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="group relative block overflow-hidden rounded-lg shadow-lg bg-white h-full"
      style={{ willChange: 'transform' }}
    >
      {/* The link now uses the product's slug to create the correct URL */}
      <Link href={`/details/${product.slug}`} className="flex flex-col h-full">
        <div className="relative w-full h-64 overflow-hidden">
          {/* Use the first image from the 'images' array */}
          <Image
            src={product.images?.[0] || '/placeholder.png'} // Use first image or a fallback
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          {/* Use the 'name' field from the database */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
          {/* Use the 'shortDescription' field from the database */}
          <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{product.shortDescription}</p>
          <div className="mt-auto inline-flex items-center font-semibold text-purple-600 group-hover:text-purple-800 transition-colors">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Animation variants for staggered effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// --- Optimized & Database-Connected FeaturedProducts Section ---
const FeaturedProducts = () => {
  // Fetch the latest 12 products from Convex
  const featuredProducts = useQuery(api.products.getFeaturedProducts);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Our Products
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium skincare solutions, crafted with care.
          </p>
        </div>

        {/* Loading State */}
        {featuredProducts === undefined && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Content Display */}
        {featuredProducts && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {featuredProducts.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-16 text-center">
          <Link href={"/all-products"}>
            <Button>View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
