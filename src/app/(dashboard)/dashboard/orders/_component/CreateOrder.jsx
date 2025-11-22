"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  Package,
  CreditCard,
  MessageCircle,
} from "lucide-react";

export default function CreateOrder({productlist}) {
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    productId: [],
    variationId: [],
    orderType: "website",
    deliveryLocation: "cash",
    visitorId: "",
    customerNote: "",
    due: 0,
    grand_total: 0,
  });

  // Product Selection
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Order Items
  const [orderItems, setOrderItems] = useState([]);

  // Delivery Options
  const [deliveryOptions, setDeliveryOptions] = useState({
    shipping_cost: 0,
    cod: true,
    delivery_note: "",
  });

  // Load products on component mount
  useEffect(() => {
    setProducts(productlist);
  }, []);

  // Update order summary when items change
  useEffect(() => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = deliveryOptions.shipping_cost;
    const total = subtotal + shipping;

    setCustomerInfo(prev => ({
      ...prev,
      grand_total: total,
      due: deliveryOptions.cod ? total : 0
    }));
  }, [orderItems, deliveryOptions.shipping_cost, deliveryOptions.cod]);

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
    setSelectedVariant(null);
    setQuantity(1);
  };

  // Handle variant selection
  const handleVariantSelect = (variantIndex) => {
    if (!selectedProduct) return;
    const variant = selectedProduct.variants[parseInt(variantIndex)];
    setSelectedVariant(variant);
  };

  // Add item to order
  const handleAddToOrder = () => {
    if (!selectedProduct || !selectedVariant) {
      alert("Please select a product and variant");
      return;
    }

    if (quantity < 1) {
      alert("Please enter a valid quantity");
      return;
    }

    if (quantity > selectedVariant.quantity) {
      alert(`Only ${selectedVariant.quantity} pieces available in stock`);
      return;
    }

    const newItem = {
      id: Date.now(),
      productId: selectedProduct._id,
      productName: selectedProduct.productName,
      variantIndex: selectedProduct.variants.indexOf(selectedVariant),
      variant: selectedVariant.variant,
      price: selectedVariant.price,
      quantity: quantity,
      stock: selectedVariant.quantity,
      image: selectedProduct.mainImage.url
    };
    setOrderItems([...orderItems, newItem]);
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    setSearchTerm("");
  };

  // Remove item from order
  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle delivery location change
  const handleDeliveryLocationChange = (location) => {
    setCustomerInfo({ ...customerInfo, deliveryLocation: location });

    // Auto-set shipping cost based on location
    const shippingCost = location === "Inside Rangpur" ? 60 : 120;
    setDeliveryOptions({ ...deliveryOptions, shipping_cost: shippingCost });
  };

  // Handle order type change
  const handleOrderTypeChange = (type) => {
    setCustomerInfo({ ...customerInfo, orderType: type });
  };

  // Handle form submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Validation
    if (!customerInfo.customerName || !customerInfo.customerPhone || !customerInfo.customerAddress) {
      alert("Please provide all customer information");
      return;
    }

    if (orderItems.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    // Prepare order data according to your structure
    const orderData = {
      customer: {
        customerName: customerInfo.customerName,
        customerPhone: customerInfo.customerPhone,
        customerAddress: customerInfo.customerAddress
      },
      productId: orderItems.map(item => item.productId),
      variationId: orderItems.map(item => item.variantIndex),
      quantity: orderItems.map(item => item.quantity),
      orderType: customerInfo.orderType,
      deliveryLocation: customerInfo.deliveryLocation,
      visitorId: customerInfo.visitorId || `visitor_${Date.now()}`,
      customerNote: customerInfo.customerNote,
      grand_total: customerInfo.grand_total,
      due: customerInfo.due,
      status: "pending"
    };

    try {
      // Here you would typically send the data to your API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        alert("Order created successfully!");
        
        // Reset form
        setCustomerInfo({
          customerName: "",
          customerPhone: "",
          customerAddress: "",
          productId: [],
          variationId: [],
          orderType: "website",
          deliveryLocation: "cash",
          visitorId: "",
          customerNote: "",
          due: 0,
          grand_total: 0,
        });
        setOrderItems([]);
        setDeliveryOptions({
          shipping_cost: 0,
          cod: true,
          delivery_note: "",
        });
        
        // Redirect or show success message
        // router.push('/dashboard/orders');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert("Failed to create order. Please try again.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Order
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter customer information and select products for the order
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info & Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-indigo-600" />
                Customer Information
              </CardTitle>
              <CardDescription>
                Provide customer personal and delivery information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    Customer Name *
                  </Label>
                  <Input
                    id="customerName"
                    value={customerInfo.customerName}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="Enter customer full name"
                    className="focus:border-indigo-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customerPhone"
                      value={customerInfo.customerPhone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          customerPhone: e.target.value,
                        })
                      }
                      placeholder="01XXXXXXXXX"
                      className="pl-9 focus:border-indigo-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerAddress" className="text-sm font-medium">
                  Delivery Address *
                </Label>
                <Textarea
                  id="customerAddress"
                  value={customerInfo.customerAddress}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      customerAddress: e.target.value,
                    })
                  }
                  placeholder="Enter complete delivery address"
                  className="min-h-[80px] focus:border-indigo-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Order Type</Label>
                  <Select value={customerInfo.orderType} onValueChange={handleOrderTypeChange}>
                    <SelectTrigger className="focus:border-indigo-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website Order</SelectItem>
                      <SelectItem value="walkin">Walk-in Order</SelectItem>
                      <SelectItem value="phone">Phone Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerNote" className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Customer Note (Optional)
                </Label>
                <Textarea
                  id="customerNote"
                  value={customerInfo.customerNote}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      customerNote: e.target.value,
                    })
                  }
                  placeholder="Any special instructions from customer..."
                  className="min-h-[60px] focus:border-indigo-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Product Selection
              </CardTitle>
              <CardDescription>
                Search and select products for the order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Search */}
              <div className="space-y-2">
                <Label htmlFor="product-search" className="text-sm font-medium">
                  Search Products
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="product-search"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 focus:border-green-300"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Product *</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger className="focus:border-green-300">
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProducts.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={product.mainImage.url}
                              alt={product.productName}
                              className="w-6 h-6 object-cover rounded"
                            />
                            <span>{product.productName}</span>
                            <Badge variant="outline" className="ml-auto">
                              ৳{product.regularPrice}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Variant *</Label>
                  <Select
                    onValueChange={handleVariantSelect}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger className="focus:border-green-300">
                      <SelectValue
                        placeholder={
                          selectedProduct
                            ? "Choose variant"
                            : "Select product first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct?.variants.map((variant, index) => (
                        <SelectItem key={variant._id} value={variant._id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{variant.variant}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>৳{variant.price}</span>
                              <span>•</span>
                              <span>Stock: {variant.quantity}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Add Button */}
              <div className="flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="focus:border-green-300"
                  />
                </div>
              </div>

              {/* Selected Product Preview */}
              {selectedProduct && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedProduct.mainImage.url}
                        alt={selectedProduct.productName}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900">
                          {selectedProduct.productName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-green-700 line-through">
                            ৳{selectedProduct.regularPrice}
                          </span>
                          <span className="text-lg font-bold text-green-900">
                            ৳{selectedProduct.salePrice}
                          </span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Save ৳{selectedProduct.discountValue}
                          </Badge>
                        </div>
                        {selectedVariant && (
                          <p className="text-sm text-green-800 mt-1">
                            Selected: <strong>{selectedVariant.variant}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Order Items Table */}
          {orderItems.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  Order Items ({orderItems.length})
                </CardTitle>
                <CardDescription>
                  Products added to this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded border"
                            />
                            <span className="font-medium">{item.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.variant}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 focus:border-blue-300"
                          />
                        </TableCell>
                        <TableCell className="font-bold text-blue-600">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary & Actions */}
        <div className="space-y-6">
          {/* Delivery & Payment Options */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
                Delivery & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_cost" className="text-sm font-medium">
                  Shipping Cost
                </Label>
                <Input
                  id="shipping_cost"
                  type="number"
                  value={deliveryOptions.shipping_cost}
                  onChange={(e) =>
                    setDeliveryOptions({
                      ...deliveryOptions,
                      shipping_cost: parseInt(e.target.value) || 0,
                    })
                  }
                  className="focus:border-purple-300"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                <Label htmlFor="cod" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Cash on Delivery
                </Label>
                <Switch
                  id="cod"
                  checked={deliveryOptions.cod}
                  onCheckedChange={(checked) =>
                    setDeliveryOptions({ ...deliveryOptions, cod: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_note" className="text-sm font-medium">
                  Delivery Note
                </Label>
                <Textarea
                  id="delivery_note"
                  value={deliveryOptions.delivery_note}
                  onChange={(e) =>
                    setDeliveryOptions({
                      ...deliveryOptions,
                      delivery_note: e.target.value,
                    })
                  }
                  placeholder="Special delivery instructions..."
                  className="min-h-[80px] focus:border-purple-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-l-4 border-l-orange-500 sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium">{formatCurrency(deliveryOptions.shipping_cost)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-base">
                    <span>Grand Total:</span>
                    <span className="text-orange-600">{formatCurrency(customerInfo.grand_total)}</span>
                  </div>
                </div>
                {deliveryOptions.cod && (
                  <div className="flex justify-between text-sm bg-orange-50 p-2 rounded">
                    <span className="text-orange-800">Due Amount:</span>
                    <span className="font-bold text-orange-800">{formatCurrency(customerInfo.due)}</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleSubmitOrder} 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                size="lg"
                disabled={orderItems.length === 0}
              >
                Create Order
              </Button>
              
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Order Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Items:</span>
                <Badge variant="secondary">{orderItems.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Quantity:</span>
                <Badge variant="secondary">
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)} pcs
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method:</span>
                <Badge variant={deliveryOptions.cod ? "default" : "secondary"}>
                  {deliveryOptions.cod ? "Cash on Delivery" : "Prepaid"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order Type:</span>
                <Badge variant="outline" className="capitalize">
                  {customerInfo.orderType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}