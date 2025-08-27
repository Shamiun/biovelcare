// app/dashboard/hero-section/page.jsx
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

// --- Single Image Uploader Component ---
const ImageUploader = ({ onFileChange, onRemoveImage }) => {
  const [preview, setPreview] = useState(null);

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
          <Image src={preview} alt="Billboard preview" fill style={{ objectFit: 'cover' }} className="rounded-lg" />
          <button type="button" onClick={handleRemove} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 leading-none z-10"><X size={14} /></button>
        </>
      ) : (
        <div className="text-center"><UploadCloud size={32} /><p className="text-xs mt-1">Upload Image</p></div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  );
};

// --- Main Page Component ---
export default function HeroSectionPage() {
  const [formData, setFormData] = useState({ title: '', description: '', productId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [billboardToDelete, setBillboardToDelete] = useState(null);

  // Fetch data from Convex
  const products = useQuery(api.products.getProducts);
  const billboards = useQuery(api.billboards.getBillboards);
  
  // Initialize Convex mutations
  const generateUploadUrl = useMutation(api.billboards.generateUploadUrl);
  const addBillboard = useMutation(api.billboards.addBillboard);
  const deleteBillboard = useMutation(api.billboards.deleteBillboard);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.productId || !imageFile) {
      toast("Please fill all fields and upload an image.")
      return;
    }
    setIsSubmitting(true);

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });
      const { storageId } = await result.json();

      await addBillboard({ ...formData, imageStorageId: storageId });
      
      // Reset form
      setFormData({ title: '', description: '', productId: '' });
      setImageFile(null);
      // A trick to reset the file input visually, though the uploader handles its own preview state
      e.target.reset();

    } catch (error) {
      console.error("Failed to add billboard:", error);
      toast("Failed to add billboard!")
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (billboard) => {
    setBillboardToDelete(billboard);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!billboardToDelete) return;
    try {
      await deleteBillboard({ id: billboardToDelete._id });
    } catch (error) {
      console.error("Failed to delete billboard:", error);
    } finally {
      setBillboardToDelete(null);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Hero Section</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Add Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Billboard</CardTitle>
                    <CardDescription>This will appear in the main hero slider on the homepage.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Product Name / Title</Label>
                        <Input id="title" value={formData.title} onChange={handleInputChange} required />
                      </div>
                       <div>
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea id="description" value={formData.description} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label>Link to Product</Label>
                        <Select onValueChange={(value) => setFormData(p => ({...p, productId: value}))} value={formData.productId} required>
                          <SelectTrigger><SelectValue placeholder="Select a product to link" /></SelectTrigger>
                          <SelectContent>
                            {products?.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Billboard Image</Label>
                        <ImageUploader onFileChange={setImageFile} onRemoveImage={() => setImageFile(null)} />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Billboard
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Existing Billboards */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader><CardTitle>Existing Billboards</CardTitle></CardHeader>
                  <CardContent>
                    {billboards === undefined && <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}
                    {billboards && billboards.length === 0 && <p className="text-gray-500 text-center p-4">No billboards found.</p>}
                    {billboards && billboards.length > 0 && (
                      <ul className="space-y-3">
                        {billboards.map((b) => (
                          <li key={b._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-4">
                              <div className="relative w-20 h-16 rounded-md bg-gray-200 overflow-hidden">
                                <Image src={b.imageUrl} alt={b.title} fill style={{objectFit: 'cover'}} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{b.title}</p>
                                <p className="text-xs text-gray-500">Links to: {b.productName}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(b)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
            <AlertDialogDescription>This will permanently delete the <strong>{billboardToDelete?.title}</strong> billboard.</AlertDialogDescription>
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
