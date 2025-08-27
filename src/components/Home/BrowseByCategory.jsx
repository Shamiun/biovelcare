// components/BrowseByCategory.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

// A predefined palette of background gradients to be applied dynamically.
const colorClasses = [
  "from-pink-100 to-rose-100",
  "from-teal-100 to-cyan-100",
  "from-yellow-100 to-amber-100",
  "from-indigo-100 to-purple-100",
];

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const BrowseByCategory = () => {
  // Fetch real category data from Convex
  const categories = useQuery(api.categories.getCategories);

  // Helper function to create a URL-friendly slug from a category name
  const createSlug = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Browse by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect solution for your skin's unique needs.
          </p>
        </div>

        {/* Show a loading state while data is being fetched */}
        {categories === undefined && (
          <div className="text-center text-gray-500">Loading categories...</div>
        )}

        {categories && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
                className="h-full"
              >
                <Link href={`/category/${createSlug(category.name)}`} className="h-full">
                  <motion.div
                    // OPTIMIZATION: Using hardware-accelerated 'translateY'
                    whileHover={{ scale: 1.05, translateY: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ willChange: 'transform' }}
                    className={`group block p-6 rounded-xl overflow-hidden bg-gradient-to-br ${
                      colorClasses[index % colorClasses.length]
                    } shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full`}
                  >
                    <div className="relative w-full h-48 mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          style={{ objectFit: "cover" }}
                          // OPTIMIZATION: 'sizes' prop for responsive image loading
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="drop-shadow-lg rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200/50 rounded-md flex items-center justify-center">
                           <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center">
                        {category.name}
                        <ArrowUpRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-1 group-hover:translate-y-0" />
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BrowseByCategory;
