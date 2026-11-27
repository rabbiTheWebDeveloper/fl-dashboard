"use client";

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  updateMultipleOrderStatusAction,
  updateOrderStatusAction,
} from "@/app/actions/order";

const statusTabs = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const statusColors = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  processing: "bg-sky-500/10 text-sky-700 border-sky-200",
  shipped: "bg-violet-500/10 text-violet-700 border-violet-200",
  completed: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  delivered: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  cancelled: "bg-rose-500/10 text-rose-700 border-rose-200",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
  delivered: "Delivered",
  confirmed: "Confirmed",
};

const getOrderId = (order) => String(order?.id || order?._id || "");

export default function Orders({ orderlist = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState(() =>
    Array.isArray(orderlist) ? orderlist : []
  );
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setOrders(Array.isArray(orderlist) ? orderlist : []);
  }, [orderlist]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    return statusTabs.map((tab) => ({
      ...tab,
      count: counts[tab.id] || 0,
    }));
  }, [orders]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) =>
    `৳${Number(amount ?? 0).toLocaleString("en-IN")}`;

  const getProductDetails = (order) => {
    if (!Array.isArray(order?.products) || order.products.length === 0) {
      return "—";
    }
    return order.products
      .map((product, index) => {
        const quantity = order?.quantity?.[index] || 1;
        const variantIndex = order?.variationId?.[index] || 0;
        const variantObj = product?.variants?.[variantIndex];
        const variantLabel =
          variantObj?.variant || variantObj?.combination || "";
        return variantLabel
          ? `${product?.productName || "Product"} (${variantLabel}) × ${quantity}`
          : `${product?.productName || "Product"} × ${quantity}`;
      })
      .join(", ");
  };

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredOrders = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    return orders.filter((order) => {
      const oid = getOrderId(order).toLowerCase();
      const name = String(order?.customer?.customerName || "").toLowerCase();
      const phone = String(order?.customer?.customerPhone || "").toLowerCase();

      const matchesSearch =
        !term || oid.includes(term) || name.includes(term) || phone.includes(term);
      const matchesStatus = activeTab === "all" || order.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [orders, deferredSearch, activeTab]);

  const isAllSelected =
    filteredOrders.length > 0 &&
    selectedOrders.length === filteredOrders.length;

  const isIndeterminate =
    selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length;

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => getOrderId(order)));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return;
    setIsUpdating(true);
    try {
      const response = await updateMultipleOrderStatusAction({
        orderId: selectedOrders,
        status: bulkStatus,
      });
      if (response?.data) {
        setOrders((prev) =>
          prev.map((order) =>
            selectedOrders.includes(getOrderId(order))
              ? { ...order, status: bulkStatus }
              : order
          )
        );
        toast.success(`Updated ${selectedOrders.length} order(s) to ${bulkStatus}`);
        setSelectedOrders([]);
        setBulkStatus("");
      } else {
        toast.error("Failed to update selected orders.");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update orders.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await updateOrderStatusAction({ orderId, status });
      if (response?.data) {
        setOrders((prev) =>
          prev.map((order) =>
            getOrderId(order) === orderId ? { ...order, status } : order
          )
        );
        toast.success(`Order marked as ${status}`);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error(error?.message || "Failed to update order status.");
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inTransit: orders.filter(
      (o) => o.status === "confirmed" || o.status === "processing" || o.status === "shipped"
    ).length,
    totalRevenue: orders.reduce((sum, o) => sum + Number(o?.grand_total || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Order <span className="rgb-gradient-text">Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track, filter, and fulfill all customer orders in one place.
          </p>
        </div>
        <Button asChild variant="gradient" className="w-full sm:w-auto">
          <Link href="/dashboard/orders/create-order">
            <Plus className="h-4 w-4" />
            Create Manual Order
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.total,
            sub: "All recorded orders",
            icon: ShoppingCart,
            bar: "from-violet-600 to-indigo-500",
            iconBg: "from-violet-600 to-indigo-600",
          },
          {
            label: "Pending Review",
            value: stats.pending,
            sub: "Awaiting confirmation",
            icon: Clock,
            bar: "from-amber-500 to-orange-500",
            iconBg: "from-amber-500 to-orange-500",
          },
          {
            label: "Active / Shipped",
            value: stats.inTransit,
            sub: "Confirmed & in transit",
            icon: Truck,
            bar: "from-cyan-500 to-blue-600",
            iconBg: "from-cyan-500 to-blue-600",
          },
          {
            label: "Gross Order Value",
            value: formatCurrency(stats.totalRevenue),
            sub: "Total order volume",
            icon: DollarSign,
            bar: "from-emerald-500 to-teal-500",
            iconBg: "from-emerald-500 to-teal-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className="relative overflow-hidden py-3.5 sm:py-4 border-slate-200/80 bg-white/95"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.bar}`} />
              <CardContent className="px-3.5 sm:px-5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    {s.label}
                  </p>
                  <p className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 sm:mt-1 truncate">
                    {s.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">{s.sub}</p>
                </div>
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${s.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bulk Actions Banner */}
      {selectedOrders.length > 0 && (
        <Card className="border-violet-200 bg-gradient-to-r from-violet-50/90 via-indigo-50/90 to-cyan-50/90 py-4">
          <CardContent className="px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-violet-900">
                {selectedOrders.length} order(s) selected
              </p>
              <p className="text-xs text-violet-700">
                Apply a status update to all selected orders at once
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-full sm:w-44 bg-white">
                  <SelectValue placeholder="Choose status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="gradient"
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus || isUpdating}
              >
                {isUpdating ? "Updating..." : "Apply Bulk Update"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedOrders([])}
                disabled={isUpdating}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Bar + Orders Table */}
      <Card className="border-slate-200/80 bg-white/95">
        <CardHeader className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {statusLabels[activeTab] || "All"} Orders
              </CardTitle>
              <CardDescription>
                Showing {filteredOrders.length} of {orders.length} order(s)
              </CardDescription>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by ID, customer name, or phone..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Pill Tabs — swipeable strip on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden sm:flex-wrap -mx-1 px-1 pt-1">
            {statusCounts.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  type="button"
                  size="sm"
                  variant={isActive ? "gradient" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="h-8 text-xs rounded-full sm:rounded-lg gap-1.5 shrink-0"
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="px-3.5 sm:px-6">
          {/* Mobile Native Card List (< md) */}
          <div className="md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No matching orders found
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const oid = getOrderId(order);
                return (
                  <div
                    key={oid}
                    className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          checked={selectedOrders.includes(oid)}
                          onChange={() => handleOrderSelect(oid)}
                        />
                        <div>
                          <span className="font-mono text-xs font-extrabold text-violet-700">
                            #{oid.slice(-6).toUpperCase()}
                          </span>
                          <p className="text-[11px] text-slate-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={
                            statusColors[order.status] ||
                            "bg-slate-100 text-slate-700"
                          }
                        >
                          {statusLabels[order.status] || order.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(oid, "confirmed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                              Mark Confirmed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(oid, "processing")}
                            >
                              <Clock className="h-4 w-4 mr-2 text-sky-600" />
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(oid, "shipped")}
                            >
                              <Truck className="h-4 w-4 mr-2 text-violet-600" />
                              Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(oid, "delivered")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-cyan-600" />
                              Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(oid, "cancelled")}
                              className="text-rose-600 focus:text-rose-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50/80 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {order?.customer?.customerName || "Unknown"}
                        </p>
                        {order?.customer?.customerPhone && (
                          <a
                            href={`tel:${order.customer.customerPhone}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full shrink-0"
                          >
                            <Phone className="h-3 w-3" />
                            {order.customer.customerPhone}
                          </a>
                        )}
                      </div>
                      {order?.customer?.customerAddress && (
                        <p className="text-xs text-slate-500 flex items-start gap-1">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                          <span className="line-clamp-1">
                            {order.customer.customerAddress}
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-slate-700 pt-1 border-t border-slate-200/60 line-clamp-2">
                        {getProductDetails(order)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="outline" className="text-[11px]">
                        {order.deliveryLocation === "insideDhaka"
                          ? "Inside Dhaka"
                          : order.deliveryLocation === "outsideDhaka"
                          ? "Outside Dhaka"
                          : "Cash on Delivery"}
                      </Badge>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">
                          {formatCurrency(order.grand_total)}
                        </span>
                        {Number(order.due) > 0 && (
                          <span className="ml-2 text-xs font-semibold text-rose-600">
                            Due {formatCurrency(order.due)}
                          </span>
                        )}
                      </div>
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
                  <TableHead className="w-10 px-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-14">
                      <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        No matching orders found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Try switching status tabs or clearing your search query
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const oid = getOrderId(order);
                    return (
                      <TableRow key={oid} className="hover:bg-slate-50/70">
                        <TableCell className="px-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                            checked={selectedOrders.includes(oid)}
                            onChange={() => handleOrderSelect(oid)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-xs font-bold text-violet-700">
                            #{oid.slice(-6).toUpperCase()}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900">
                            {order?.customer?.customerName || "Unknown"}
                          </div>
                          <div className="text-xs flex items-center text-slate-500 mt-0.5">
                            <Phone className="h-3 w-3 mr-1 shrink-0" />
                            {order?.customer?.customerPhone || "—"}
                          </div>
                          {order?.customer?.customerAddress && (
                            <div className="text-xs flex items-center text-slate-400 max-w-[180px] truncate">
                              <MapPin className="h-3 w-3 mr-1 shrink-0" />
                              <span className="truncate">
                                {order.customer.customerAddress}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[220px]">
                          <p className="text-xs text-slate-700 whitespace-normal line-clamp-2">
                            {getProductDetails(order)}
                          </p>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">
                          {formatCurrency(order.grand_total)}
                        </TableCell>
                        <TableCell className="font-semibold text-rose-600">
                          {formatCurrency(order.due)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              statusColors[order.status] ||
                              "bg-slate-100 text-slate-700"
                            }
                          >
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs capitalize">
                            {order.deliveryLocation === "insideDhaka"
                              ? "Inside Dhaka"
                              : order.deliveryLocation === "outsideDhaka"
                              ? "Outside Dhaka"
                              : "Cash on Delivery"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(oid, "confirmed")}
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                                Mark Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(oid, "processing")}
                              >
                                <Clock className="h-4 w-4 mr-2 text-sky-600" />
                                Mark Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(oid, "shipped")}
                              >
                                <Truck className="h-4 w-4 mr-2 text-violet-600" />
                                Mark Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(oid, "delivered")}
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-cyan-600" />
                                Mark Delivered
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(oid, "cancelled")}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
