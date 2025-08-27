// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    
    // Storing images as an array of strings (URLs)
    images: v.array(v.string()), 
    imageStorageIds: v.array(v.id("_storage")), // The IDs for deleting files
    
    features: v.array(v.string()),

    // Storing details as a nested object
    details: v.object({
      activeIngredients: v.string(),
      howToUse: v.string(),
      inactiveIngredients: v.string(),
    }),

    // For the category page
    category: v.string(), 
    bestFor: v.string(),
    bestForColor: v.string(),
  }).index("by_category", ["category"]) // Adds an index for faster querying by category
   .index("by_slug", ["slug"]) // Index for fetching a single product by its slug
   .searchIndex("by_name", {
    searchField: "name",
  }),

   // --- ADD THIS NEW TABLE ---
  categories: defineTable({
    name: v.string(),
    // Add these two optional fields
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  }).index("by_name", ["name"]), // Index for faster lookups by name

  // --- ADD THIS NEW TABLE ---
  billboards: defineTable({
    title: v.string(),
    description: v.string(),
    // We store the ID of the product it links to
    productId: v.id("products"),
    imageStorageId: v.id("_storage"),
    imageUrl: v.string(),
  }),
});


