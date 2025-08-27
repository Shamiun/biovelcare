// pages/product/[slug].jsx
"use client";

"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Droplet, Sun, Zap, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

// Convex imports for fetching real data
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

// --- Reusable & Optimized ProductCard for Related Products ---
const ProductCard = ({ product }) => {
  if (!product) return null;
  return (
    <motion.div
      whileHover={{ scale: 1.03, translateY: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="group relative block overflow-hidden rounded-lg shadow-lg bg-white h-full"
      style={{ willChange: 'transform' }}
    >
      <Link href={`/details/${product.slug}`} className="flex flex-col h-full">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{product.shortDescription}</p>
          <div className="mt-auto inline-flex items-center font-semibold text-purple-600">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Related Products Section Component ---
const RelatedProducts = ({ category, currentProductId }) => {
  const relatedProducts = useQuery(api.products.getRelatedProducts, { category, currentProductId });

  if (relatedProducts === undefined || relatedProducts.length === 0) {
    return null; // Don't render the section if there are no related products
  }

  return (
    <motion.div
      className="mt-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </motion.div>
  );
};

// Helper to map feature text from the database to an icon component
const featureIconMap = {
  "Fast-Absorbing": <Zap size={20} />,
  "Hydrating Formula": <Droplet size={20} />,
  "Protects & Repairs": <Sun size={20} />,
  "Dermatologist Tested": <CheckCircle size={20} />,
};

const ProductDetailPage = ({ params: paramsPromise }) => {
  // CORRECTED: Unwrap the params Promise using React.use()
  const params = use(paramsPromise);

  // Fetch the specific product from Convex using the slug from the URL
  const product = useQuery(api.products.getProductBySlug, { slug: params.slug });
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  // Loading State
  if (product === undefined) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Not Found State
  if (product === null) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-500 mt-2">Sorry, we couldn't find the product you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto  font-sans mt-14">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery - FIX: Removed sticky positioning on smaller screens */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
              <div className="flex sm:flex-col gap-3 justify-center">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${mainImage === img ? "border-purple-500 scale-110" : "border-transparent hover:border-gray-300"}`}
                    onClick={() => setMainImage(img)}
                  >
                    <Image src={img} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: "cover" }} sizes="80px" />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 aspect-square rounded-xl overflow-hidden shadow-lg">
                {mainImage && <Image src={mainImage} alt="Main product" fill style={{ objectFit: "cover" }} priority sizes="(max-width: 640px) 100vw, 50vw" />}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 pt-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.shortDescription}</p>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((featureText, index) => (
                    // OPTIMIZATION: Using hardware-accelerated 'translateX'
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, translateX: -10 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-purple-600">{featureIconMap[featureText] || <CheckCircle size={20} />}</span>
                      <span>{featureText}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      Full Details
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.fullDescription}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      How to Use
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.details.howToUse}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      Active Ingredients
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.details.activeIngredients}
                    </p>
                  </div>
                  {/* You can add inactive ingredients to your admin form and schema later if needed */}
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- NEW: Related Products Section --- */}
          <RelatedProducts category={product.category} currentProductId={product._id} />

        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
