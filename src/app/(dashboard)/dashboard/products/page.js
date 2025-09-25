/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";

import Link from "next/link";

import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Package,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";

import { Table } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Pagination } from "@/components/ui/pagination";
import { PaginationContent } from "@/components/ui/pagination";
import { PaginationItem } from "@/components/ui/pagination";
import { PaginationLink } from "@/components/ui/pagination";
import { PaginationNext } from "@/components/ui/pagination";
import { PaginationPrevious } from "@/components/ui/pagination";

import { Select } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";

import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
  const categories = [
    "All",
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Beauty",
  ];
const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Mock data - replace with API call

  const statusOptions = ["All", "Active", "Inactive", "Out of Stock"];

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockProducts = Array.from({ length: 45 }, (_, i) => ({
          id: i + 1,
          name: `Product ${i + 1}`,
          category:
            categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
          price: (Math.random() * 1000 + 10).toFixed(2),
          stock: Math.floor(Math.random() * 100),
          status: ["Active", "Inactive", "Out of Stock"][
            Math.floor(Math.random() * 3)
          ],
          sales: Math.floor(Math.random() * 500),
          image: `/api/placeholder/80/80?text=P${i + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 10000000000)
            .toISOString()
            .split("T")[0],
          sku: `SKU${String(i + 1).padStart(4, "0")}`,
        }));

        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categories]);

  // Filter and search products
  useEffect(() => {
    let result = products;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, statusFilter, products]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Out of Stock":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStockVariant = (stock) => {
    if (stock === 0) return "destructive";
    if (stock < 10) return "secondary";
    return "default";
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (productId) => {
    router.push(`/dashboard/products/edit/${productId}`);
  };

  const handleView = (productId) => {
    router.push(`/dashboard/products/${productId}`);
  };

  const exportProducts = () => {
    // Simulate export functionality
    alert("Export functionality would be implemented here");
  };

  const importProducts = () => {
    // Simulate import functionality
    alert("Import functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory and listings
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportProducts}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={importProducts}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <Link href="/dashboard/add-product">
              <button className="inline-flex items-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Products
                  </p>
                  <p className="text-2xl font-bold">
                    {products.filter((p) => p.status === "Active").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold">
                    {products.filter((p) => p.status === "Out of Stock").length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold">
                    {products.reduce((sum, product) => sum + product.sales, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Product List</CardTitle>
                <CardDescription>
                  {filteredProducts.length} products found
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories
                      .filter((cat) => cat !== "All")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions
                      .filter((opt) => opt !== "All")
                      .map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Products Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.sku}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Badge variant={getStockVariant(product.stock)}>
                            {product.stock} units
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(product.status)}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.sales} sold</TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.createdAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleView(product.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(product.id)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(product)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No products found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {indexOfFirstProduct + 1}-
                  {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && paginate(currentPage - 1)
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => paginate(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages && paginate(currentPage + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {productToDelete?.name} ? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
