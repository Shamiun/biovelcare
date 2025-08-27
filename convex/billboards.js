// convex/billboards.ts
// This file MUST be TypeScript as required by Convex

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// --- Function to generate a short-lived URL for file uploads ---
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// --- Query to get all billboards ---
// --- UPDATED: Query to get all billboards ---
export const getBillboards = query({
  handler: async (ctx) => {
    const billboards = await ctx.db.query("billboards").order("desc").collect();
    
    // For each billboard, fetch the linked product's name AND slug
    return Promise.all(
      billboards.map(async (billboard) => {
        const product = await ctx.db.get(billboard.productId);
        return {
          ...billboard,
          productName: product ? product.name : "Product Not Found",
          // Add the product slug to the returned object
          productSlug: product ? product.slug : "", 
        };
      })
    );
  },
});

// --- Mutation to add a new billboard ---
export const addBillboard = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    productId: v.id("products"),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("Could not get image URL.");
    }

    return await ctx.db.insert("billboards", {
      title: args.title,
      description: args.description,
      productId: args.productId,
      imageStorageId: args.imageStorageId,
      imageUrl: imageUrl,
    });
  },
});

// --- Mutation to delete a billboard ---
export const deleteBillboard = mutation({
  args: { id: v.id("billboards") },
  handler: async (ctx, args) => {
    const billboard = await ctx.db.get(args.id);
    if (!billboard) {
      throw new Error("Billboard not found");
    }

    // Delete the associated image from storage first
    await ctx.storage.delete(billboard.imageStorageId);
    // Then, delete the billboard document
    await ctx.db.delete(args.id);
  },
});
