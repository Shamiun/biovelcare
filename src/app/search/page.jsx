// app/search/page.jsx
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, SearchX } from 'lucide-react';
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';

// --- Reusable ProductCard Component (from FeaturedProducts) ---
const ProductCard = ({ product }) => {
  if (!product) return null;
  return (
    <motion.div
      whileHover={{ scale: 1.03, translateY: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="group relative block overflow-hidden rounded-lg shadow-lg bg-white h-full"
    >
      <Link href={`/details/${product.slug}`} className="flex flex-col h-full">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{product.shortDescription}</p>
          <div className="mt-auto inline-flex items-center font-semibold text-purple-600">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Main Search Component ---
const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || "";
  
  // Fetch search results from Convex
  const results = useQuery(api.products.searchProducts, { query });

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 mt-12 md:mt-10">
        <Navbar/>
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Search Results
        </h1>
        {query && (
          <p className="mt-2 text-lg text-gray-600">
            Showing results for: <span className="font-semibold text-purple-600">"{query}"</span>
          </p>
        )}
      </div>

      {/* Loading State */}
      {results === undefined && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
        </div>
      )}

      {/* No Results State */}
      {results && results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <SearchX size={64} className="mb-4" />
          <h2 className="text-2xl font-bold">Opps No Products Found</h2>
          <p className="mt-2">Try a different search term or browse our categories.</p>
        </div>
      )}

      {/* Results Grid */}
      {results && results.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {results.map((product) => (
            <motion.div 
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <Footer/>
    </div>
  );
};

// --- Page Component with Suspense Boundary ---
export default function SearchPage() {
  return (
    // Suspense is recommended by Next.js for pages that use `useSearchParams`
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin"/></div>}>
      <SearchResults />
    </Suspense>
  );
}
