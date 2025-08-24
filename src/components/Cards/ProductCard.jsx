// components/ProductCard.jsx
"use client";

// Note: Replaced Next.js specific 'Link' and 'Image' with standard 'a' and 'img' tags
// to ensure compatibility with the preview environment.
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="group relative block overflow-hidden rounded-lg shadow-lg bg-white"
    >
      <div className="relative w-full h-64">
        {/* Replaced Next.js Image with standard <img> tag */}
        <img
          src={product.image}
          alt={product.title}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        {/* Replaced Next.js Link with standard <a> tag */}
        <Link href={product.href} className="inline-flex items-center font-semibold text-purple-600 group-hover:text-purple-800 transition-colors">
          Read More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
