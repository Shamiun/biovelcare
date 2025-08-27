// app/dashboard/add-new/page.jsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

import { toast } from "sonner"

// Boilerplate & ShadCN Components
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Image as ImageIcon, PlusCircle, Zap } from 'lucide-react';

// --- Advanced Multi-Image Uploader ---
const MultiImageUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  // CORRECTED: The onFilesChange prop is now a dependency of useEffect
  // to prevent the "setstate-in-render" error.
  useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prevFiles => {
      const combined = [...prevFiles, ...newFiles];
      return combined.slice(0, 4); // Enforce the maximum of 4 images
    });
  }, []);

  const removeFile = (e, fileToRemove) => {
    e.stopPropagation();
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 4,
  });

  return (
    <div {...getRootProps()} className={`relative p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <img src={file.preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
              <button type="button" onClick={(e) => removeFile(e, file)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 leading-none">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <ImageIcon size={48} className="mb-2" />
          <p className="font-semibold">Drag & drop images here</p>
          <p className="text-sm">or click to select files (up to 4)</p>
        </div>
      )}
    </div>
  );
};

// --- Dynamic Key Features Component ---
const KeyFeaturesInput = ({ features, setFeatures }) => {
  const addFeature = () => {
    if (features.length < 4) {
      setFeatures([...features, ""]);
    }
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-gray-400" />
          <Input 
            value={feature}
            onChange={(e) => updateFeature(index, e.target.value)}
            placeholder={`Key Feature ${index + 1}`}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {features.length < 4 && (
        <Button type="button" variant="outline" size="sm" onClick={addFeature} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Feature
        </Button>
      )}
    </div>
  );
};


// --- Main Page Component ---
export default function AddNewProductPage() {
  const [formData, setFormData] = useState({
    name: '', shortDescription: '', fullDescription: '', category: '', bestFor: '', bestForColor: '', howToUse: '', activeIngredients: ''
  });
  const [features, setFeatures] = useState([""]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const addProduct = useMutation(api.products.addProduct);

  // --- FETCH REAL CATEGORIES ---
  const categories = useQuery(api.categories.getCategories);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || imageFiles.length === 0) {
      toast("Please provide a product name and at least one image.")
      
      return;
    }
    setIsSubmitting(true);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        return storageId;
      });
      const imageStorageIds = await Promise.all(uploadPromises);

      const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      // CORRECTED: Only send the feature text strings, not objects with icons
      const featuresPayload = features.filter(f => f.trim() !== '');

      await addProduct({
        ...formData,
        slug,
        imageStorageIds,
        features: featuresPayload,
      });

      toast("Product added successfully!")
      router.push('/dashboard/all-products');
    } catch (error) {
      console.error("Failed to add product:", error);
      toast("Error adding product..")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" }}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 md:p-6">
          <div className="max-w-5xl mx-auto w-full">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Product Description</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="shortDescription">Short Description (for cards)</Label>
                        <Textarea id="shortDescription" value={formData.shortDescription} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="fullDescription">Full Description</Label>
                        <Textarea id="fullDescription" value={formData.fullDescription} onChange={handleInputChange} rows={4} />
                      </div>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader><CardTitle>Usage & Ingredients</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div>
                        <Label htmlFor="howToUse">How to Use</Label>
                        <Textarea id="howToUse" value={formData.howToUse} onChange={handleInputChange} rows={3} />
                      </div>
                      <div>
                        <Label htmlFor="activeIngredients">Active Ingredients</Label>
                        <Textarea id="activeIngredients" value={formData.activeIngredients} onChange={handleInputChange} rows={3} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Category</Label>
                        <Select onValueChange={(value) => setFormData(p => ({...p, category: value}))} required>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                          <SelectContent>
                            {/* --- USE REAL DATA HERE --- */}
                            {categories === undefined && <div className="p-2 text-sm text-gray-500">Loading...</div>}
                            {categories && categories.map(cat => <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bestFor">"Best For" Tag</Label>
                        <Input id="bestFor" value={formData.bestFor} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="bestForColor">Tag Color</Label>
                        <Input id="bestForColor" value={formData.bestForColor} onChange={handleInputChange} placeholder="e.g., bg-rose-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
                    <CardContent>
                      <KeyFeaturesInput features={features} setFeatures={setFeatures} />
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
                    <CardContent>
                      <MultiImageUploader onFilesChange={setImageFiles} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
