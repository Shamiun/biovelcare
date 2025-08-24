// components/BrowseByCategory.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// You can replace this with your actual category data
const categories = [
  {
    name: "Serums & Essences",
    href: "/category/serums",
    image:
      "https://i0.wp.com/post.healthline.com/wp-content/uploads/2020/09/599490-What-Are-the-Benefits-of-Using-a-Skin-Serum-1296x728-header-1296x729.jpg?w=1155&h=2268",
    bgColor: "from-pink-100 to-rose-100",
  },
  {
    name: "Moisturizers",
    href: "/category/moisturizers",
    image: "https://www.simpleskincare.in/cdn/shop/files/03_phone_homepage_banners-1.jpg?v=1742531901",
    bgColor: "from-teal-100 to-cyan-100",
  },
  {
    name: "Cleansers & Masks",
    href: "/category/masks",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPUQWYTujCCRvH_5zZOZCi8JrACm5BHhVOlw&s",
    bgColor: "from-yellow-100 to-amber-100",
  },
  {
    name: "Eye & Lip Care",
    href: "/category/eye-lip-care",
    image: "https://images.squarespace-cdn.com/content/v1/63d79882b8a43861cab41796/a40365b6-02a0-42b4-a4c4-31f660ebcc5f/Lip+Care.png",
    bgColor: "from-indigo-100 to-purple-100",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const BrowseByCategory = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <Link href={category.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`group block p-6 rounded-xl overflow-hidden bg-gradient-to-br ${category.bgColor} shadow-lg hover:shadow-2xl transition-shadow duration-300`}
                >
                  <div className="relative w-full h-48 mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                    //   style={{ objectFit: "contain" }}
                      className="drop-shadow-lg object-cover"
                    />
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
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory;
