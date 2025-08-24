// pages/product/[slug].jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Droplet, Sun, Zap } from "lucide-react";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

// --- MOCK DATA ---
const productData = {
  name: "Advanced Dermal Serum",
  shortDescription:
    "A revolutionary formula designed to rejuvenate and protect your skin at the cellular level, leaving you with a radiant, youthful glow.",
  images: [
    "https://skincarebd.com/wp-content/uploads/2019/09/laneige-lip-sleeping-mask.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2mt29g39Vj_skulOiYqXLuBqTP0eLcEso-yOXcvV3PkDCDTOQmkU68iDIxWMlSywRhIs&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNVKkjeuB5DoeD09Qi14jqeb9esx3NTWQSLBvlKaqyx8xSVI63Edhx3d0D4gFmy5rSmcg&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLWeO2GeexLzJO_C0uejNqmiVQdCjJ--OsQhIXmedR9-PDsciZbsPE-Y-GzgEsCbJlDM8&usqp=CAU",
  ],
  features: [
    { icon: <Zap size={20} />, text: "Fast-Absorbing" },
    { icon: <Droplet size={20} />, text: "Hydrating Formula" },
    { icon: <Sun size={20} />, text: "Protects & Repairs" },
    { icon: <CheckCircle size={20} />, text: "Dermatologist Tested" },
  ],
  details: {
    description:
      "Our Advanced Dermal Serum is a potent, lightweight concentrate that targets the most common signs of aging. Formulated with a proprietary blend of antioxidants, peptides, and hyaluronic acid, it works to improve skin elasticity, reduce the appearance of fine lines and wrinkles, and restore a luminous complexion. Its fast-absorbing nature makes it a perfect addition to any morning or evening skincare routine.",
    activeIngredients:
      "Hyaluronic Acid, Vitamin C (Ascorbic Acid), Peptide Complex, Green Tea Extract.",
    howToUse:
      "Apply 2-3 drops to a clean face and neck, morning and night, before moisturizing. Gently pat into the skin until fully absorbed. For best results, use daily.",
    inactiveIngredients:
      "Aqua (Water), Glycerin, Propanediol, Aloe Barbadensis Leaf Juice, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
  },
};

const ProductDetailPage = () => {
  const [mainImage, setMainImage] = useState(productData.images[0]);

  return (
    <div className="max-w-screen-2xl mx-auto  font-sans mt-10">
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
                {productData.images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                      mainImage === img
                        ? "border-purple-500 scale-110"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setMainImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`Product thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={mainImage}
                  alt="Main product"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 pt-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
                {productData.name}
              </h1>
              <p className="text-lg text-gray-600">
                {productData.shortDescription}
              </p>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productData.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-purple-600">{feature.icon}</span>
                      <span>{feature.text}</span>
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
                Product Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      Full Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {productData.details.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      How to Use
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {productData.details.howToUse}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      Active Ingredients
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {productData.details.activeIngredients}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-2 mb-3">
                      Inactive Ingredients
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {productData.details.inactiveIngredients}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
