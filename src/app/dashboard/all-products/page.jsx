// app/dashboard/all-products/page.jsx
"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Boilerplate & ShadCN Components
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Edit, Trash2, PlusCircle } from 'lucide-react';

// --- Main Page Component ---
export default function AllProductsPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch data and initialize mutations from Convex
  const products = useQuery(api.products.getProducts);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const handleEditClick = (productId) => {
    // We will create this page next
    router.push(`/dashboard/edit-product/${productId}`);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct({ id: productToDelete._id });
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Error deleting product.");
    } finally {
      setProductToDelete(null);
      setDialogOpen(false);
    }
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" }}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 md:p-6">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
              <Button onClick={() => router.push('/dashboard/add-new')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products === undefined && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto my-8" />
                        </TableCell>
                      </TableRow>
                    )}
                    {products && products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                    {products && products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">{product.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(product._id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(product)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the <strong>{productToDelete?.name}</strong> product and all its associated images.
            </AlertDialogDescription>
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
