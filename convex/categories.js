// convex/categories.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// --- Function to generate a short-lived URL for file uploads ---
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// --- Query to get all categories ---
export const getCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

// --- UPDATED: Mutation to add a new category ---
export const addCategory = mutation({
  args: {
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const existingCategory = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingCategory) {
      throw new Error("A category with this name already exists.");
    }

    let imageUrl = null;
    if (args.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    }

    return await ctx.db.insert("categories", {
      name: args.name,
      imageStorageId: args.imageStorageId,
      imageUrl: imageUrl,
    });
  },
});

// --- UPDATED: Mutation to update an existing category ---
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error("Category not found");
    }

    let imageUrl = category.imageUrl;
    // If a new image is provided, delete the old one and get the new URL
    if (args.imageStorageId && args.imageStorageId !== category.imageStorageId) {
      if (category.imageStorageId) {
        await ctx.storage.delete(category.imageStorageId);
      }
      imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      imageStorageId: args.imageStorageId,
      imageUrl: imageUrl,
    });
  },
});

// --- UPDATED: Mutation to delete a category ---
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error("Category not found");
    }

    // If an image exists, delete it from storage first
    if (category.imageStorageId) {
      await ctx.storage.delete(category.imageStorageId);
    }

    // Then, delete the category document
    await ctx.db.delete(args.id);
  },
});
