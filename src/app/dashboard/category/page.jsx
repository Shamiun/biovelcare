// app/dashboard/categories/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Image from 'next/image';

// Boilerplate & ShadCN Components
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Edit, Trash2, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

// --- Single Image Uploader Component ---
const CategoryImageUploader = ({ onFileChange, existingImageUrl, onRemoveImage }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setPreview(existingImageUrl);
  }, [existingImageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemoveImage();
  };

  return (
    <div className="relative w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-purple-400 transition-colors">
      {preview ? (
        <>
          <Image src={preview} alt="Category preview" fill style={{ objectFit: 'cover' }} className="rounded-lg" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 leading-none z-10"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <div className="text-center">
          <UploadCloud size={32} />
          <p className="text-xs mt-1">Upload Image</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};


// --- Main Page Component ---
export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const categories = useQuery(api.categories.getCategories);
  const generateUploadUrl = useMutation(api.categories.generateUploadUrl);
  const addCategory = useMutation(api.categories.addCategory);
  const updateCategory = useMutation(api.categories.updateCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setImageFile(null); // Reset file input when starting an edit
    } else {
      setCategoryName('');
      setImageFile(null);
    }
  }, [editingCategory]);

  const handleEditClick = (category) => setEditingCategory(category);
  const handleCancelEdit = () => setEditingCategory(null);
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setIsSubmitting(true);

    try {
      let storageId = editingCategory ? editingCategory.imageStorageId : undefined;

      // If a new file is selected, upload it
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const json = await result.json();
        storageId = json.storageId;
      }

      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, name: categoryName, imageStorageId: storageId });
        setEditingCategory(null);
      } else {
        await addCategory({ name: categoryName, imageStorageId: storageId });
      }
      setCategoryName('');
      setImageFile(null);
    } catch (error) {
      console.error("Failed to save category:", error);
      toast("Failed to save category!")
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory({ id: categoryToDelete._id });
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setCategoryToDelete(null);
      setDialogOpen(false);
    }
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" }}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 md:p-6">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Add/Edit Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader><CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
                      </div>
                      <div>
                        <Label>Category Image</Label>
                        <CategoryImageUploader
                          onFileChange={setImageFile}
                          existingImageUrl={editingCategory?.imageUrl}
                          onRemoveImage={() => {
                            // On remove, we need to tell the update mutation to remove the image
                            if (editingCategory) {
                              setEditingCategory({...editingCategory, imageStorageId: undefined, imageUrl: null });
                            }
                            setImageFile(null);
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {editingCategory ? 'Update' : 'Add'}
                        </Button>
                        {editingCategory && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Existing Categories List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader><CardTitle>Existing Categories</CardTitle></CardHeader>
                  <CardContent>
                    {categories === undefined && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}
                    {categories && categories.length > 0 && (
                      <ul className="space-y-2">
                        {categories.map((cat) => (
                          <li key={cat._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-4">
                              <div className="relative w-16 h-12 rounded-md bg-gray-200 overflow-hidden">
                                {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name} fill style={{objectFit: 'cover'}} /> : <span className="text-xs text-gray-400 flex items-center justify-center h-full">No Image</span>}
                              </div>
                              <span className="font-medium text-gray-700">{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(cat)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(cat)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the <strong>{categoryToDelete?.name}</strong> category.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
