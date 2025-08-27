// convex/products.ts
// This file MUST be TypeScript as required by Convex

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Function to generate a short-lived URL for file uploads (no changes)
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// CORRECTED: addProduct mutation to accept a simple array of strings for features
export const addProduct = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    imageStorageIds: v.array(v.id("_storage")),
    category: v.string(),
    bestFor: v.string(),
    bestForColor: v.string(),
    // CORRECTED: This now expects an array of strings
    features: v.array(v.string()),
    howToUse: v.string(),
    activeIngredients: v.string(),
  },
  handler: async (ctx, args) => {
    const imageUrls = await Promise.all(
      args.imageStorageIds.map((storageId) => ctx.storage.getUrl(storageId))
    );
    
    const validImageUrls = imageUrls.filter((url) => url !== null);

    const newProductId = await ctx.db.insert("products", {
      name: args.name,
      slug: args.slug,
      shortDescription: args.shortDescription,
      fullDescription: args.fullDescription,
      images: validImageUrls,
      category: args.category,
      bestFor: args.bestFor,
      bestForColor: args.bestForColor,
      // CORRECTED: Storing the simple array of feature strings directly
      features: args.features,
      details: {
        activeIngredients: args.activeIngredients,
        howToUse: args.howToUse,
        inactiveIngredients: "",
      },
      // images: validImageUrls,
      // --- ADD THIS LINE ---
      imageStorageIds: args.imageStorageIds, // Save the storage IDs
    });
    return newProductId;
  },
});


// --- NEW: Query to get all products ---
export const getProducts = query({
  handler: async (ctx) => {
    // Fetch products in descending order of creation time
    return await ctx.db.query("products").order("desc").collect();
  },
});

// --- NEW: Mutation to delete a product ---
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    // 1. Get the product document to access its storage IDs
    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error("Product not found");
    }

    // 2. Delete all associated images from file storage
    if (product.imageStorageIds) {
      await Promise.all(
        product.imageStorageIds.map((storageId) => ctx.storage.delete(storageId))
      );
    }

    // 3. Delete the product document from the database
    await ctx.db.delete(args.id);
  },
});

// --- NEW: Query to get the latest products for the homepage ---
export const getFeaturedProducts = query({
  handler: async (ctx) => {
    // Fetch products, sorted by creation time descending, and take the first 12.
    const products = await ctx.db
      .query("products")
      .order("desc") // This ensures the newest products are first
      .take(12);     // This limits the result to a maximum of 12
    return products;
  },
});

// --- NEW: Query to get a single product by its slug ---
export const getProductBySlug = query({
  args: {
    slug: v.string(), // The URL slug of the product to fetch
  },
  handler: async (ctx, args) => {
    // Use the 'by_slug' index to find the product efficiently
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique(); // .unique() expects only one result, which is perfect here

    return product;
  },
});

// --- NEW: Query to get related products by category ---
export const getRelatedProducts = query({
  args: {
    category: v.string(),
    currentProductId: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Fetch all products in the same category
    const related = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    // Filter out the current product from the results and take the first 6
    return related
      .filter((product) => product._id !== args.currentProductId)
      .slice(0, 6);
  },
});

// --- ADD THIS NEW QUERY ---
export const searchProducts = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    // If the search query is empty, return no results.
    if (args.query === "") {
      return [];
    }
    
    // Perform a full-text search on the "by_name" index.
    const products = await ctx.db
      .query("products")
      .withSearchIndex("by_name", (q) => q.search("name", args.query))
      .collect();
      
    return products;
  },
});