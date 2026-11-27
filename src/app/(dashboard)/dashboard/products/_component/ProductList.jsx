/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";

const getProductId = (p) => String(p?._id || p?.id || "");
const isProductActive = (p) =>
  typeof p?.isActive === "boolean" ? p.isActive : p?.isActive !== "Inactive";

export default function ProductList({ productlist = [] }) {
  const router = useRouter();
  const [products, setProducts] = useState(() =>
    Array.isArray(productlist) ? productlist : []
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [productToDelete, setProductToDelete] = useState(null);

  const categoryOptions = useMemo(() => {
    const names = new Set();
    products.forEach((p) => {
      const catName = p?.categoryId?.name || p?.category;
      if (catName) names.add(catName);
    });
    return Array.from(names);
  }, [products]);

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredProducts = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    return products.filter((product) => {
      const name = String(product?.productName || "").toLowerCase();
      const code = String(product?.productCode || product?.sku || "").toLowerCase();
      const catName = String(
        product?.categoryId?.name || product?.category || ""
      );

      const matchesSearch =
        !term ||
        name.includes(term) ||
        code.includes(term) ||
        catName.toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "all" || catName === categoryFilter;

      const qty = Number(product?.availableQuantity ?? 0);
      const active = isProductActive(product);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active) ||
        (statusFilter === "out_of_stock" && qty <= 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, deferredSearch, categoryFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastProduct = safePage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const productId = getProductId(productToDelete);
    setLoading(true);
    try {
      const res = await fetch(
        `${API_ENDPOINTS.BASE_URL}/product/delete/${productId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => getProductId(p) !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setLoading(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (productId) => {
    router.push(`/dashboard/products/update?id=${productId}`);
  };

  const activeCount = products.filter((p) => isProductActive(p)).length;
  const outOfStockCount = products.filter(
    (p) => Number(p?.availableQuantity ?? 0) <= 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Product <span className="rgb-gradient-text">Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage catalog listings, pricing, variants, and stock levels.
          </p>
        </div>
        <Button asChild variant="gradient" className="w-full sm:w-auto">
          <Link href="/dashboard/add-product">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* KPI Cards — single compact 3-col strip on mobile */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {[
          {
            label: "Total",
            fullLabel: "Total Products",
            value: products.length,
            icon: Boxes,
            bar: "from-violet-600 to-indigo-500",
            iconBg: "from-violet-600 to-indigo-600",
          },
          {
            label: "Active",
            fullLabel: "Active Listings",
            value: activeCount,
            icon: CheckCircle2,
            bar: "from-emerald-500 to-teal-500",
            iconBg: "from-emerald-500 to-teal-600",
          },
          {
            label: "No Stock",
            fullLabel: "Out of Stock",
            value: outOfStockCount,
            icon: AlertTriangle,
            bar: "from-rose-500 to-pink-500",
            iconBg: "from-rose-500 to-pink-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.fullLabel}
              className="relative overflow-hidden py-3 sm:py-4 border-slate-200/80 bg-white/95"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.bar}`} />
              <CardContent className="px-3 sm:px-5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    <span className="sm:hidden">{s.label}</span>
                    <span className="hidden sm:inline">{s.fullLabel}</span>
                  </p>
                  <p className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 sm:mt-1">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br ${s.iconBg} text-white items-center justify-center shadow-md shrink-0`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters & Table */}
      <Card className="border-slate-200/80 bg-white/95">
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Catalog Items
              </CardTitle>
              <CardDescription>
                {filteredProducts.length} product(s) matching current filters
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name, code, category..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-white"
                />
              </div>

              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-44 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3.5 sm:px-6">
          {/* Mobile Native Product Cards (< md) */}
          <div className="md:hidden space-y-3">
            {currentProducts.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
                <Package className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No products found
                </p>
              </div>
            ) : (
              currentProducts.map((product) => {
                const pid = getProductId(product);
                const qty = Number(product?.availableQuantity ?? 0);
                const active = isProductActive(product);
                return (
                  <div
                    key={pid}
                    className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {product?.mainImage?.url ? (
                        <img
                          src={product.mainImage.url}
                          alt={product.productName}
                          className="h-14 w-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                          <Package className="h-6 w-6 text-violet-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">
                            {product.productName}
                          </p>
                          <span className="text-sm font-extrabold text-violet-700 shrink-0">
                            ৳{Number(product?.regularPrice ?? 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Code: {product.productCode || "—"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <Badge variant="outline" className="text-[10px] bg-slate-50">
                            {product?.categoryId?.name || "Uncategorized"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              qty <= 0
                                ? "bg-rose-500/10 text-rose-700 border-rose-200"
                                : qty <= 5
                                ? "bg-amber-500/10 text-amber-700 border-amber-200"
                                : "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {qty} in stock
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              active
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs flex-1"
                        onClick={() => handleEdit(pid)}
                      >
                        <Edit className="h-3.5 w-3.5 text-violet-600" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                        onClick={() => setProductToDelete(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block rounded-xl border border-slate-200/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-16 pl-4">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    const pid = getProductId(product);
                    const qty = Number(product?.availableQuantity ?? 0);
                    const active = isProductActive(product);
                    return (
                      <TableRow key={pid} className="hover:bg-slate-50/70">
                        <TableCell className="pl-4">
                          {product?.mainImage?.url ? (
                            <img
                              src={product.mainImage.url}
                              alt={product.productName}
                              className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                              <Package className="h-4 w-4 text-violet-500" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 max-w-[200px] truncate">
                          {product.productName}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-500">
                          {product.productCode || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-50">
                            {product?.categoryId?.name || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          ৳{Number(product?.regularPrice ?? 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              qty <= 0
                                ? "bg-rose-500/10 text-rose-700 border-rose-200"
                                : qty <= 5
                                ? "bg-amber-500/10 text-amber-700 border-amber-200"
                                : "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                            }
                          >
                            {qty} units
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              active
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }
                          >
                            {active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "short", year: "numeric" }
                              )
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => handleEdit(pid)}>
                                <Edit className="h-4 w-4 mr-2 text-violet-600" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setProductToDelete(product)}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-14">
                      <Package className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        No products found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Try adjusting your search or add a new product
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
              <p className="text-xs text-slate-500">
                Showing {indexOfFirstProduct + 1}–
                {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => safePage > 1 && setCurrentPage(safePage - 1)}
                      className={
                        safePage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber = i + 1;
                    if (totalPages > 5) {
                      if (safePage <= 3) pageNumber = i + 1;
                      else if (safePage >= totalPages - 2)
                        pageNumber = totalPages - 4 + i;
                      else pageNumber = safePage - 2 + i;
                    }
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={safePage === pageNumber}
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
                        safePage < totalPages && setCurrentPage(safePage + 1)
                      }
                      className={
                        safePage === totalPages
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {productToDelete?.productName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductToDelete(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
