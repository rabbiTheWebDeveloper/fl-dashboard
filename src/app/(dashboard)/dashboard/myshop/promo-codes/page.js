"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Edit, Trash2, Copy, Calendar, Users, Tag, Percent, DollarSign, Eye } from "lucide-react";

export default function PromoCodesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [promoCodes, setPromoCodes] = useState([
    {
      id: 1,
      code: "WELCOME20",
      description: "Welcome discount for new customers",
      type: "percentage",
      value: 20,
      minOrder: 500,
      maxDiscount: 1000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 1000,
      usedCount: 245,
      status: "active",
      customerEligibility: "all",
      products: ["all"]
    },
    {
      id: 2,
      code: "FREESHIP",
      description: "Free shipping on orders above 1000",
      type: "free_shipping",
      value: 0,
      minOrder: 1000,
      maxDiscount: 0,
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      usageLimit: 500,
      usedCount: 189,
      status: "active",
      customerEligibility: "all",
      products: ["all"]
    },
    {
      id: 3,
      code: "SUMMER50",
      description: "Summer sale flat discount",
      type: "fixed",
      value: 50,
      minOrder: 200,
      maxDiscount: 50,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      usageLimit: 200,
      usedCount: 200,
      status: "expired",
      customerEligibility: "all",
      products: ["all"]
    },
    {
      id: 4,
      code: "FIRSTORDER",
      description: "First order special discount",
      type: "percentage",
      value: 15,
      minOrder: 300,
      maxDiscount: 500,
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      usageLimit: 100,
      usedCount: 100,
      status: "expired",
      customerEligibility: "new",
      products: ["all"]
    }
  ]);

  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    usageLimit: 100,
    customerEligibility: "all",
    products: ["all"],
    status: "active"
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter promoCodes based on search and filters
  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = 
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || promo.status === statusFilter;
    const matchesType = typeFilter === "all" || promo.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats calculation
  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter(p => p.status === "active").length,
    expired: promoCodes.filter(p => p.status === "expired").length,
    totalUsage: promoCodes.reduce((sum, promo) => sum + promo.usedCount, 0),
    totalRevenue: 125000 // This would typically come from your analytics
  };

  const handleCreatePromoCode = () => {
    if (!newPromoCode.code || !newPromoCode.description) {
      alert("Please fill in all required fields");
      return;
    }

    const promoCode = {
      ...newPromoCode,
      id: promoCodes.length + 1,
      usedCount: 0
    };

    setPromoCodes([...promoCodes, promoCode]);
    setNewPromoCode({
      code: "",
      description: "",
      type: "percentage",
      value: 0,
      minOrder: 0,
      maxDiscount: 0,
      startDate: "",
      endDate: "",
      usageLimit: 100,
      customerEligibility: "all",
      products: ["all"],
      status: "active"
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeletePromoCode = (id) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      setPromoCodes(promoCodes.filter(promo => promo.id !== id));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      expired: "bg-red-100 text-red-800 hover:bg-red-100",
      scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      paused: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4 w-4" />;
      case "fixed":
        return <DollarSign className="h-4 w-4" />;
      case "free_shipping":
        return <Truck className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "percentage":
        return "Percentage";
      case "fixed":
        return "Fixed Amount";
      case "free_shipping":
        return "Free Shipping";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Promo Codes</h1>
          <p className="text-muted-foreground">
            Create and manage discount codes for your customers
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Promo Code</DialogTitle>
              <DialogDescription>
                Set up a new discount code for your customers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Promo Code *</Label>
                <Input
                  id="code"
                  value={newPromoCode.code}
                  onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., SUMMER25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Discount Type *</Label>
                <Select value={newPromoCode.type} onValueChange={(value) => setNewPromoCode({...newPromoCode, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newPromoCode.description}
                  onChange={(e) => setNewPromoCode({...newPromoCode, description: e.target.value})}
                  placeholder="e.g., Summer sale discount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {newPromoCode.type === "percentage" ? "Discount Percentage" : 
                   newPromoCode.type === "fixed" ? "Discount Amount" : "Value"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={newPromoCode.value}
                  onChange={(e) => setNewPromoCode({...newPromoCode, value: parseInt(e.target.value) || 0})}
                  placeholder={newPromoCode.type === "percentage" ? "20" : "50"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order Amount</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={newPromoCode.minOrder}
                  onChange={(e) => setNewPromoCode({...newPromoCode, minOrder: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              {newPromoCode.type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Maximum Discount</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={newPromoCode.maxDiscount}
                    onChange={(e) => setNewPromoCode({...newPromoCode, maxDiscount: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPromoCode.startDate}
                  onChange={(e) => setNewPromoCode({...newPromoCode, startDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newPromoCode.endDate}
                  onChange={(e) => setNewPromoCode({...newPromoCode, endDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newPromoCode.usageLimit}
                  onChange={(e) => setNewPromoCode({...newPromoCode, usageLimit: parseInt(e.target.value) || 0})}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEligibility">Customer Eligibility</Label>
                <Select value={newPromoCode.customerEligibility} onValueChange={(value) => setNewPromoCode({...newPromoCode, customerEligibility: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers Only</SelectItem>
                    <SelectItem value="existing">Existing Customers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePromoCode}>
                Create Promo Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All promo codes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">Times used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Promo Codes</CardTitle>
          <CardDescription>
            Search and filter through your discount codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code or description..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="free_shipping">Free Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Promo Codes Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromoCodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-mono font-bold">
                    <div className="flex items-center gap-2">
                      {promo.code}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(promo.code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={promo.description}>
                      {promo.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(promo.type)}
                      {getTypeLabel(promo.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {promo.type === "percentage" && (
                      <span>{promo.value}% off</span>
                    )}
                    {promo.type === "fixed" && (
                      <span>৳{promo.value} off</span>
                    )}
                    {promo.type === "free_shipping" && (
                      <span>Free Shipping</span>
                    )}
                    {promo.minOrder > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Min order: ৳{promo.minOrder}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{promo.usedCount} / {promo.usageLimit}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(promo.usedCount / promo.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((promo.usedCount / promo.usageLimit) * 100).toFixed(1)}% used
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {promo.startDate} to {promo.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadge(promo.status)}>
                      {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePromoCode(promo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPromoCodes.length === 0 && (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No promo codes found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try changing your search or filters" 
                  : "Get started by creating your first promo code"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Copy className="h-4 w-4 mr-2" />
              Export Codes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Usage Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Code
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest usage of your promo codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">WELCOME20</div>
                  <div className="text-sm text-muted-foreground">Used by customer #12345</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">৳1,250</div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">FREESHIP</div>
                  <div className="text-sm text-muted-foreground">Used by customer #12346</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">৳2,800</div>
                  <div className="text-sm text-muted-foreground">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">WELCOME20</div>
                  <div className="text-sm text-muted-foreground">Used by customer #12347</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">৳890</div>
                  <div className="text-sm text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add missing icon
const Truck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);