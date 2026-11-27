/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Edit,
  EyeOff,
  FolderKanban,
  ImageIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CategoryContainer({ categoryList = [] }) {
  const [categories, setCategories] = useState(() =>
    Array.isArray(categoryList) ? categoryList : []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredCategories = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesSearch =
        !term || String(category?.name || "").toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, deferredSearch, statusFilter]);

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    const categoryId = categoryToDelete._id;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_ENDPOINTS.BASE_URL}/category/create-delete/${categoryId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c._id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error?.message || "Failed to delete category");
    } finally {
      setIsLoading(false);
      setCategoryToDelete(null);
    }
  };

  const toggleStatus = async (category) => {
    setUpdatingId(category._id);
    const newStatus = category.status === "active" ? "inactive" : "active";

    try {
      const res = await fetch(
        `${API_ENDPOINTS.BASE_URL}/category/update/${category._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            name: category.name,
            userId: category.userId,
            shopId: category.shopId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === category._id ? { ...cat, status: newStatus } : cat
        )
      );
      toast.success(
        `Category ${newStatus === "active" ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update category status");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeCount = categories.filter((c) => c.status === "active").length;
  const inactiveCount = categories.filter((c) => c.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Product <span className="rgb-gradient-text">Categories</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize your storefront catalog into clean collections.
          </p>
        </div>
        <Button asChild variant="gradient" className="w-full sm:w-auto">
          <Link href="/dashboard/category/add">
            <Plus className="w-4 h-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* KPI Cards — compact 3-col strip on mobile */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {[
          {
            shortLabel: "Total",
            label: "Total Categories",
            value: categories.length,
            icon: FolderKanban,
            bar: "from-violet-600 to-indigo-500",
            iconBg: "from-violet-600 to-indigo-600",
          },
          {
            shortLabel: "Active",
            label: "Active Categories",
            value: activeCount,
            icon: CheckCircle2,
            bar: "from-emerald-500 to-teal-500",
            iconBg: "from-emerald-500 to-teal-600",
          },
          {
            shortLabel: "Hidden",
            label: "Inactive Categories",
            value: inactiveCount,
            icon: EyeOff,
            bar: "from-rose-500 to-pink-500",
            iconBg: "from-rose-500 to-pink-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className="relative overflow-hidden py-3 sm:py-4 border-slate-200/80 bg-white/95"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.bar}`} />
              <CardContent className="px-3 sm:px-5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    <span className="sm:hidden">{s.shortLabel}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </p>
                  <p className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 sm:mt-1">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br ${s.iconBg} text-white items-center justify-center shadow-md shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter & Table Card */}
      <Card className="border-slate-200/80 bg-white/95">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                All Categories
              </CardTitle>
              <CardDescription>
                {filteredCategories.length} category(s) displayed
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3.5 sm:px-6">
          {/* Mobile Native Category Cards (< md) */}
          <div className="md:hidden space-y-2.5">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
                <FolderKanban className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No categories found
                </p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {category.image ? (
                      <img
                        className="h-11 w-11 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                        src={category.image}
                        alt={category.name}
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-violet-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {category.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => !updatingId && toggleStatus(category)}
                          disabled={updatingId === category._id}
                        >
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              category.status === "active"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                                : "bg-rose-500/10 text-rose-700 border-rose-200"
                            }`}
                          >
                            {updatingId === category._id
                              ? "Updating..."
                              : category.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                      <Link
                        href={`/dashboard/category/update?id=${category._id}`}
                        aria-label="Edit category"
                      >
                        <Edit className="w-4 h-4 text-violet-600" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-rose-600 hover:bg-rose-50"
                      onClick={() => setCategoryToDelete(category)}
                      aria-label="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block rounded-xl border border-slate-200/80 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="pl-5">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-14">
                      <FolderKanban className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        No categories found
                      </p>
                      <Button asChild variant="link" size="sm" className="mt-1">
                        <Link href="/dashboard/category/add">
                          Add your first category
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id} className="hover:bg-slate-50/70">
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover border border-slate-200 bg-slate-50"
                              src={category.image}
                              alt={category.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-violet-500" />
                            </div>
                          )}
                          <span className="font-semibold text-slate-900">
                            {category.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => !updatingId && toggleStatus(category)}
                          disabled={updatingId === category._id}
                          className="cursor-pointer disabled:cursor-wait"
                        >
                          <Badge
                            variant="outline"
                            className={
                              category.status === "active"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 text-rose-700 border-rose-200 hover:bg-rose-500/20"
                            }
                          >
                            {updatingId === category._id
                              ? "Updating..."
                              : category.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString(
                              "en-GB",
                              { day: "2-digit", month: "short", year: "numeric" }
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right pr-5">
                        <div className="inline-flex items-center gap-1">
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                            <Link
                              href={`/dashboard/category/update?id=${category._id}`}
                              aria-label="Edit category"
                            >
                              <Edit className="w-4 h-4 text-violet-600" />
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => setCategoryToDelete(category)}
                            aria-label="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {categoryToDelete?.name}
              </span>
              ? Products assigned to it will remain in your catalog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
