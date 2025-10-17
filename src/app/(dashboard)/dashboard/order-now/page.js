"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Trash2, ShoppingCart, User, MapPin, Phone } from "lucide-react";

export default function CreateOrderPage() {
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: "",
    phone: "",
    address: "",
    delivery_location: ""
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
    cod: false,
    delivery_note: ""
  });

  // Order Summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0
  });

  // Sample products data - Replace with your API data
  const sampleProducts = [
    {
      id: 1,
      name: "Air Force 1 '07 Mid Rec",
      code: "AF1-MID",
      price: 12999,
      media: "https://cdn-s3.funnelliner.com/media/main-image/1311/MK0P7AGRxjZMUSUd2d6lmUPli7ZvYYJX0A8APAJU.png",
      variants: [
        { id: 101, variant: "EU-40", price: 12999, quantity: 10 },
        { id: 102, variant: "EU-41", price: 12999, quantity: 8 },
        { id: 103, variant: "EU-42", price: 12999, quantity: 5 }
      ]
    },
    {
      id: 2,
      name: "Nike Dunk Low Retro",
      code: "DUNK-LOW",
      price: 11999,
      media: "https://example.com/dunk-low.jpg",
      variants: [
        { id: 201, variant: "EU-39", price: 11999, quantity: 7 },
        { id: 202, variant: "EU-40", price: 11999, quantity: 12 },
        { id: 203, variant: "EU-41", price: 11999, quantity: 6 }
      ]
    },
    {
      id: 3,
      name: "Jordan 1 Retro High",
      code: "J1-HIGH",
      price: 15999,
      media: "https://example.com/jordan1.jpg",
      variants: [
        { id: 301, variant: "EU-42", price: 15999, quantity: 3 },
        { id: 302, variant: "EU-43", price: 15999, quantity: 4 },
        { id: 303, variant: "EU-44", price: 15999, quantity: 2 }
      ]
    }
  ];

  // Load products on component mount
  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  // Update order summary when items change
  useEffect(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = deliveryOptions.shipping_cost;
    const total = subtotal + shipping;

    setOrderSummary({
      subtotal,
      discount: 0,
      shipping,
      total
    });
  }, [orderItems, deliveryOptions.shipping_cost]);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    setSelectedProduct(product);
    setSelectedVariant(null);
    setQuantity(1);
  };

  // Handle variant selection
  const handleVariantSelect = (variantId) => {
    if (!selectedProduct) return;
    const variant = selectedProduct.variants.find(v => v.id === parseInt(variantId));
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
      productId: selectedProduct.id,
      product: selectedProduct.name,
      variantId: selectedVariant.id,
      variant: selectedVariant.variant,
      price: selectedVariant.price,
      quantity: quantity,
      stock: selectedVariant.quantity
    };

    setOrderItems([...orderItems, newItem]);
    
    // Reset selection
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    setSearchTerm("");
  };

  // Remove item from order
  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setOrderItems(orderItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Handle delivery location change
  const handleDeliveryLocationChange = (location) => {
    setCustomerInfo({ ...customerInfo, delivery_location: location });
    
    // Auto-set shipping cost based on location
    const shippingCost = location.includes("Rangpur") ? 60 : 120;
    setDeliveryOptions({ ...deliveryOptions, shipping_cost: shippingCost });
  };

  // Handle form submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.customer_name || !customerInfo.phone || !customerInfo.address) {
      alert("Please provide all customer information");
      return;
    }

    if (orderItems.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    const orderData = {
      customer_name: customerInfo.customer_name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      delivery_location: customerInfo.delivery_location,
      order_items: orderItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      })),
      shipping_cost: deliveryOptions.shipping_cost,
      cod: deliveryOptions.cod,
      order_note: deliveryOptions.delivery_note,
      grand_total: orderSummary.total
    };

    console.log("Order Data:", orderData);
    
    // Here you would typically send the data to your API
    // await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });

    alert("Order created successfully!");
    // Reset form or redirect
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Order</h1>
          <p className="text-muted-foreground">Enter customer information and select products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info & Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <CardDescription>
                Provide customer personal and delivery information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={customerInfo.customer_name}
                    onChange={(e) => setCustomerInfo({...customerInfo, customer_name: e.target.value})}
                    placeholder="Enter customer full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  placeholder="Enter complete delivery address"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_location">Delivery Location</Label>
                <Select onValueChange={handleDeliveryLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inside Rangpur">Rangpur City</SelectItem>
                    <SelectItem value="Outside Rangpur">Outside Rangpur</SelectItem>
                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                    <SelectItem value="Chittagong">Chittagong</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Product Selection
              </CardTitle>
              <CardDescription>
                Select products and variants for the order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Search */}
              <div className="space-y-2">
                <Label htmlFor="product-search">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="product-search"
                    placeholder="Search by product name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Select Product *</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - {product.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variant">Select Variant *</Label>
                  <Select 
                    value={selectedVariant?.id?.toString()} 
                    onValueChange={handleVariantSelect}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedProduct ? "Select variant" : "Select product first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct?.variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id.toString()}>
                          {variant.variant} - ৳{variant.price} (Stock: {variant.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Add Button */}
              <div className="flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={!selectedVariant}
                  />
                </div>
                <Button 
                  onClick={handleAddToOrder}
                  disabled={!selectedVariant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Order
                </Button>
              </div>

              {/* Selected Product Info */}
              {selectedProduct && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedProduct.media} 
                        alt={selectedProduct.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedProduct.name}</h4>
                        <p className="text-sm text-muted-foreground">Code: {selectedProduct.code}</p>
                        {selectedVariant && (
                          <p className="text-sm">
                            Selected: {selectedVariant.variant} - ৳{selectedVariant.price}
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
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  List of products added to the order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.variant}</TableCell>
                        <TableCell>৳{item.price}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>৳{item.price * item.quantity}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700"
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

        {/* Right Column - Order Summary & Delivery Options */}
        <div className="space-y-6">
          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_cost">Shipping Cost</Label>
                <Input
                  id="shipping_cost"
                  type="number"
                  value={deliveryOptions.shipping_cost}
                  onChange={(e) => setDeliveryOptions({...deliveryOptions, shipping_cost: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cod">Cash on Delivery</Label>
                <Switch
                  id="cod"
                  checked={deliveryOptions.cod}
                  onCheckedChange={(checked) => setDeliveryOptions({...deliveryOptions, cod: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_note">Delivery Note</Label>
                <Textarea
                  id="delivery_note"
                  value={deliveryOptions.delivery_note}
                  onChange={(e) => setDeliveryOptions({...deliveryOptions, delivery_note: e.target.value})}
                  placeholder="Special delivery instructions..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost:</span>
                  <span>৳{orderSummary.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="text-green-600">-৳{orderSummary.discount}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>৳{orderSummary.total}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmitOrder}
                className="w-full"
                size="lg"
              >
                Create Order
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <Badge variant="secondary">{orderItems.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity:</span>
                <Badge variant="secondary">
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)} pcs
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <Badge variant={deliveryOptions.cod ? "default" : "secondary"}>
                  {deliveryOptions.cod ? "Cash on Delivery" : "Prepaid"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}