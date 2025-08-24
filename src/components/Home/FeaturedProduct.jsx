// components/FeaturedProducts.jsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import Image from 'next/image';

// --- Reusable ProductCard Component ---
// I've moved the ProductCard component into this file to resolve the import error.
const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="group relative block overflow-hidden rounded-lg shadow-lg bg-white"
    >
        <Link href={product.href} >
      <div className="relative w-full h-64 overflow-hidden">
        {/* Replaced Next.js Image with standard <img> tag for compatibility */}
        <Image
          src={product.image}
          alt={product.title}
        //   width={600}
        //   height={400}
          fill
        //   style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        {/* Replaced Next.js Link with standard <a> tag */}
        
        <div className="inline-flex items-center font-semibold text-purple-600 group-hover:text-purple-800 transition-colors">

        Read More
          
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
        </Link>
    </motion.div>
  );
};


// --- FeaturedProducts Section ---
const featuredProductsData = [
  {
    id: 1,
    title: "Advanced Dermal Serum",
    description: "A revolutionary formula designed to rejuvenate and protect your skin at the cellular level.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/xeroacne-bar.png",
    href: "/details/advanced-dermal-serum",
  },
  {
    id: 2,
    title: "Hydro-Boost Moisturizer",
    description: "Intense hydration that lasts all day, leaving your skin feeling soft, supple, and refreshed.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/Permix-Soap-2.jpg",
    href: "/details/hydro-boost-moisturizer",
  },
  {
    id: 3,
    title: "Purifying Clay Mask",
    description: "Detoxify your pores and draw out impurities for a clearer, more radiant complexion.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/kinzol-Soap.jpg",
    href: "/details/purifying-clay-mask",
  },
  {
    id: 4,
    title: "Purifying Clay Mask",
    description: "Detoxify your pores and draw out impurities for a clearer, more radiant complexion.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/kinzol-Soap.jpg",
    href: "/product/purifying-clay-mask",
  },
  {
    id: 5,
    title: "Purifying Clay Mask",
    description: "Detoxify your pores and draw out impurities for a clearer, more radiant complexion.",
    image: "https://biovelcare.com/wp-content/uploads/2025/07/kinzol-Soap.jpg",
    href: "/details/purifying-clay-mask",
  },
];

const FeaturedProducts = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          {/* Replaced Next.js Link with standard <a> tag */}
          <Link href={"/all-products"} >
          <Button >View All Products</Button>
            
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
