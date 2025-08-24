// pages/category/[slug].jsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sun, Droplet, Wind, Eye } from 'lucide-react'; // Example icons for benefits
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';

// --- MOCK DATA ---
// In a real app, you would fetch this data based on the category slug
const categoryData = {
  name: "Serums & Essences",
  description: "Discover our potent, targeted treatments designed to address specific skin concerns and deliver visible results.",
  products: [
    {
      id: 1,
      slug: "advanced-dermal-serum",
      name: "Advanced Dermal Serum",
      image: "https://biovelcare.com/wp-content/uploads/2025/07/xeroacne-bar.png",
      shortDescription: "A revolutionary formula to rejuvenate and protect skin at the cellular level.",
      bestFor: "Anti-Aging",
      bestForColor: "bg-rose-500",
      benefits: [
        { icon: <Sun size={16} />, text: "Brightening" },
        { icon: <Droplet size={16} />, text: "Hydrating" },
      ],
    },
    {
      id: 2,
      slug: "hydro-boost-essence",
      name: "Hydro-Boost Essence",
      image: "https://biovelcare.com/wp-content/uploads/2025/07/Permix-Soap-2.jpg",
      shortDescription: "Intense, lightweight hydration that leaves skin feeling supple and refreshed.",
      bestFor: "Hydration",
      bestForColor: "bg-sky-500",
      benefits: [
        { icon: <Droplet size={16} />, text: "Hydrating" },
        { icon: <Wind size={16} />, text: "Soothing" },
      ],
    },
    {
      id: 3,
      slug: "purifying-clay-serum",
      name: "Purifying Clay Serum",
      image: "https://biovelcare.com/wp-content/uploads/2025/07/kinzol-Soap.jpg",
      shortDescription: "Detoxify pores and clarify your complexion with this unique, non-drying formula.",
      bestFor: "Oily Skin",
      bestForColor: "bg-emerald-500",
      benefits: [
        { icon: <Wind size={16} />, text: "Purifying" },
        { icon: <Sun size={16} />, text: "Balancing" },
      ],
    },
    {
      id: 4,
      slug: "age-defy-eye-serum",
      name: "Age-Defy Eye Serum",
      image: "https://biovelcare.com/wp-content/uploads/2025/07/Permix-Soap-2.jpg",
      shortDescription: "Targets fine lines and dark circles for a brighter, more youthful appearance.",
      bestFor: "Eye Care",
      bestForColor: "bg-indigo-500",
      benefits: [
        { icon: <Eye size={16} />, text: "Reduces Wrinkles" },
        { icon: <Sun size={16} />, text: "Brightening" },
      ],
    },
  ],
};

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};


const CategoryPage = () => {
  // In a real app, you would get the slug from the URL to fetch the correct category data
  // const router = useRouter();
  // const { slug } = router.query;

  return (
    <div className=" min-h-screen font-sans mt-10">
        <Navbar/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            {categoryData.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {categoryData.description}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
        >
          {categoryData.products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link href={`/details/${product.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="group bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
                >
                  <div className="relative w-full aspect-square overflow-hidden">
                    <div className={`absolute top-3 left-3 z-10 text-white text-xs font-semibold px-2 py-1 rounded-full ${product.bestForColor}`}>
                      {product.bestFor}
                    </div>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* <motion.div
                      variants={{ hover: { opacity: 1 } }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    >
                      <span className="text-white font-bold border-2 border-white py-2 px-4 rounded-lg">
                        View Details
                      </span>
                    </motion.div> */}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex-grow">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.shortDescription}</p>
                    <div className="mt-auto border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-4">
                        {product.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-500" title={benefit.text}>
                            {benefit.icon}
                            <span className="text-xs font-medium inline">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
};

export default CategoryPage;
