"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Eye, Share2, Calendar } from "lucide-react";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample analytics data
  const analyticsData = {
    overview: {
      revenue: 1250000,
      orders: 1245,
      customers: 892,
      conversionRate: 3.2,
      averageOrderValue: 1004,
      productsSold: 2890
    },
    trends: {
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      customerGrowth: 15.2,
      conversionGrowth: 2.1
    },
    charts: {
      revenue: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
      orders: [45, 52, 48, 65, 58, 72, 68],
      customers: [23, 35, 28, 42, 38, 50, 45]
    }
  };

  const topProducts = [
    { id: 1, name: "Air Force 1 '07 Mid Rec", sales: 245, revenue: 3185500 },
    { id: 2, name: "Nike Dunk Low Retro", sales: 189, revenue: 2266110 },
    { id: 3, name: "Jordan 1 Retro High", sales: 156, revenue: 2494440 },
    { id: 4, name: "Adidas Ultraboost", sales: 134, revenue: 2144000 },
    { id: 5, name: "Puma RS-X", sales: 98, revenue: 1176000 }
  ];

  const trafficSources = [
    { source: "Direct", visitors: 1245, percentage: 35, trend: "up" },
    { source: "Facebook", visitors: 890, percentage: 25, trend: "up" },
    { source: "Google", visitors: 712, percentage: 20, trend: "down" },
    { source: "Instagram", visitors: 534, percentage: 15, trend: "up" },
    { source: "Others", visitors: 178, percentage: 5, trend: "stable" }
  ];

  const recentActivities = [
    { time: "2 mins ago", action: "New order placed", orderId: "#ORD-7891", amount: "৳2,500" },
    { time: "5 mins ago", action: "Product out of stock", product: "Air Force 1 EU-40" },
    { time: "10 mins ago", action: "New customer registered", customer: "Rahim Ahmed" },
    { time: "15 mins ago", action: "Payment received", orderId: "#ORD-7890", amount: "৳1,800" },
    { time: "20 mins ago", action: "Order shipped", orderId: "#ORD-7889" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-BD').format(num);
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = (trend) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your shop performance and customer insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.revenue)}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.trends.revenueGrowth}% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.orders)}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.trends.orderGrowth}% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.customers)}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.trends.customerGrowth}% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.trends.conversionGrowth}% from last period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Revenue trends over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/50">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Revenue chart visualization</p>
                    <p className="text-sm text-muted-foreground">Chart would be integrated here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>
                  Additional performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Order Value</span>
                  <span className="font-semibold">{formatCurrency(analyticsData.overview.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Products Sold</span>
                  <span className="font-semibold">{formatNumber(analyticsData.overview.productsSold)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Returning Customers</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cart Abandonment</span>
                  <span className="font-semibold text-red-600">12.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products and Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Best selling products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sales} sold</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                        <Badge variant="secondary" className="mt-1">
                          Top Seller
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{source.source}</span>
                          <div className={`flex items-center ${getTrendColor(source.trend)}`}>
                            {getTrendIcon(source.trend)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatNumber(source.visitors)}</div>
                          <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>
                  Detailed sales metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+12.5%</div>
                      <div className="text-sm text-muted-foreground">Revenue Growth</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">৳1,004</div>
                      <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    </div>
                  </div>
                  <div className="h-[200px] flex items-center justify-center border rounded-lg bg-muted/50">
                    <div className="text-center">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Sales chart visualization</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>
                  Order distribution and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Completed Orders</span>
                    <span className="font-semibold">1,124</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Orders</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled Orders</span>
                    <span className="font-semibold">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refunded Orders</span>
                    <span className="font-semibold">18</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>
                  Customer behavior and demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">68%</div>
                      <div className="text-sm text-muted-foreground">Returning Customers</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">32%</div>
                      <div className="text-sm text-muted-foreground">New Customers</div>
                    </div>
                  </div>
                  <div className="h-[200px] flex items-center justify-center border rounded-lg bg-muted/50">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Customer growth chart</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Locations</CardTitle>
                <CardDescription>
                  Top customer locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Dhaka</span>
                    <Badge>45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chittagong</span>
                    <Badge>22%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rangpur</span>
                    <Badge>15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Khulna</span>
                    <Badge>10%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Others</span>
                    <Badge>8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                Detailed analysis of product sales and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2890</div>
                    <div className="text-sm text-muted-foreground">Total Products Sold</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-muted-foreground">Active Products</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">23</div>
                    <div className="text-sm text-muted-foreground">Low Stock Items</div>
                  </div>
                </div>
                
                <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/50">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Product performance chart</p>
                    <p className="text-sm text-muted-foreground">Sales distribution by product category</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest events and activities in your shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    {activity.orderId && (
                      <div className="text-sm text-muted-foreground">{activity.orderId} • {activity.amount}</div>
                    )}
                    {activity.product && (
                      <div className="text-sm text-muted-foreground">{activity.product}</div>
                    )}
                    {activity.customer && (
                      <div className="text-sm text-muted-foreground">{activity.customer}</div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}