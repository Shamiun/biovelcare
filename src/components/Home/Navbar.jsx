"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap, Search, User, Compass } from "lucide-react";
import Link from "next/link";
import SearchCommand from "@/components/Search/SearchCommand";

import { useRouter } from "next/navigation"; // Import useRouter
// import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/" },
  { name: "University", href: "/all-university" },
  { name: "Subject", href: "/all-subject" },
  { name: "Country", href: "/all-country" },
  // { name: "Technology", href: "/categories/technology" },
  // { name: "Gaming", href: "/categories/gaming" },
  { name: "About us", href: "/contact" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); // Initialize router
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <motion.header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 backdrop-blur-sm max-w-screen-2xl mx-auto ${
          isScrolled
            ? "border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-sm"
            : "bg-transparent"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative mt-5">
                  <Image src="https://biovelcare.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-10-at-22.31.48_8254c4ab-3.jpg" height={70} width={70} alt="Biovel logo" className="rounded-full"/>
                  {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-lg">
                    <Compass className="h-5 w-5 text-white" />
                  </div> */}
                  {/* <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-400"></div> */}
                </div>
                {/* <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    BioVel
                  </span>
                  <span className="-mt-1 text-lg font-bold text-foreground">
                    Compass
                  </span>
                </div> */}
              </Link>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={`${
                      item.href === pathname && "bg-rose-200"
                    } relative rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground`}
                    // className="relative rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-rose-200"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="flex items-center lg:space-x-3 gap-1 "
              variants={itemVariants}
            >
              <motion.button
                className="rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {/* Sign In */}
              {/* <div className="">
                <SignedIn>
                  <UserButton afterSignOutUrl="/"></UserButton>
                </SignedIn>
                <SignedOut>
                  <Button variant="ghost" size="icon" className="" asChild>
                    <Link
                      href={`/sign-in?redirect_url=${pathname}`}
                      aria-label="Sign In"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                </SignedOut>
              </div> */}

              {/* Dark Mode White Mode */}
              <motion.div className="hidden lg:flex rounded-lg  text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer">
                {/* <ModeToggle /> */}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              ></motion.div>

              <motion.button
                className="rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-muted lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed right-4 top-16 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-4 py-3 font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="  pt-6 flex items-center justify-center gap-2"
                  variants={mobileItemVariants}
                >
                  {/* Dark Mode White Mode */}
                  <div>
                    <motion.div className="rounded-lg  text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground cursor-pointer">
                      {/* <ModeToggle /> */}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
