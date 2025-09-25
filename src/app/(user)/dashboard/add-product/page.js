/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Upload,
  DollarSign,
  Package,
  Tag,
  Truck,
  Edit3,
  Save,
  X,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";

const AddProduct = () => {
  // Main form state
  const [formData, setFormData] = useState({
    productName: "",
    regularPrice: "",
    discountType: "percentage",
    discountValue: "",
    productCode: "",
    availableQuantity: "",
    categoryName: "",
    deliveryCharge: "free",
    deliveryCharges: {
      dhaka: "",
      outsideDhaka: "",
      subarea: "",
    },
    mainImage: null,
    galleryImages: [],
    shortDescription: "",
    longDescription: "",
    isActive: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });

  // Product variants state
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    image: null,
    variant: "",
    price: "",
    productCode: "",
    quantity: "",
    description: "",
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Mock categories
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Home & Kitchen" },
    { id: 4, name: "Books" },
    { id: 5, name: "Beauty & Health" },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    if (type === "main") {
      setFormData((prev) => ({ ...prev, mainImage: { file, url: imageUrl } }));
    } else if (type === "gallery") {
      const files = Array.from(e.target.files);
      if (formData.galleryImages.length + files.length > 5) {
        alert("Maximum 5 gallery images allowed");
        return;
      }

      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newImages],
      }));
    } else if (type === "variant") {
      setCurrentVariant((prev) => ({
        ...prev,
        image: { file, url: imageUrl },
      }));
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Variant management
  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateVariant = () => {
    if (!currentVariant.variant || !currentVariant.price) {
      alert("Variant name and price are required");
      return;
    }

    if (editingVariantIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingVariantIndex] = currentVariant;
      setVariants(updatedVariants);
    } else {
      setVariants((prev) => [...prev, currentVariant]);
    }

    resetVariantForm();
  };

  const editVariant = (index) => {
    setCurrentVariant(variants[index]);
    setEditingVariantIndex(index);
    setShowVariantDialog(true);
  };

  const deleteVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const resetVariantForm = () => {
    setCurrentVariant({
      image: null,
      variant: "",
      price: "",
      productCode: "",
      quantity: "",
      description: "",
    });
    setEditingVariantIndex(null);
    setShowVariantDialog(false);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    const regularPrice = parseFloat(formData.regularPrice) || 0;
    const discountValue = parseFloat(formData.discountValue) || 0;

    if (formData.discountType === "percentage") {
      return regularPrice - (regularPrice * discountValue) / 100;
    }
    return regularPrice - discountValue;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.productName ||
      !formData.productCode ||
      !formData.categoryName
    ) {
      alert("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Product data:", { ...formData, variants });
      alert("Product added successfully!");
      // Reset form would go here
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Add New Product
            </h1>
            <p className="text-muted-foreground">
              Create a new product for your store
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential product details and categorization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">
                      Product Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productCode">
                      Product Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="productCode"
                      name="productCode"
                      value={formData.productCode}
                      onChange={handleInputChange}
                      placeholder="Enter product code"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryName">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.categoryName}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryName: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableQuantity">
                      Available Quantity
                    </Label>
                    <Input
                      id="availableQuantity"
                      name="availableQuantity"
                      type="number"
                      value={formData.availableQuantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description of the product..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the product..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
                <CardDescription>
                  Set product pricing and discount options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="regularPrice">Regular Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regularPrice"
                        name="regularPrice"
                        type="number"
                        value={formData.regularPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Discount Type</Label>
                      <Select
                        value={formData.discountType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            discountType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountValue">Discount Value</Label>
                      <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={handleInputChange}
                        placeholder={
                          formData.discountType === "percentage" ? "0%" : "0.00"
                        }
                        min="0"
                        step={
                          formData.discountType === "percentage" ? "1" : "0.01"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Preview */}
                {formData.regularPrice && formData.discountValue && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">
                        Discounted Price:
                      </span>
                      <Badge variant="secondary" className="text-green-800">
                        ${calculateDiscountedPrice().toFixed(2)}
                        {formData.discountType === "percentage" && (
                          <span> ({formData.discountValue}% off)</span>
                        )}
                      </Badge>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5" />
                    Delivery Settings
                  </CardTitle>

                  <div className="space-y-2">
                    <Label>Delivery Charge Type</Label>
                    <Select
                      value={formData.deliveryCharge}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveryCharge: value,
                          deliveryCharges:
                            value === "free"
                              ? { dhaka: "", outsideDhaka: "", subarea: "" }
                              : prev.deliveryCharges,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free Delivery</SelectItem>
                        <SelectItem value="paid">Paid Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.deliveryCharge === "paid" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                      {["dhaka", "outsideDhaka", "subarea"].map((area) => (
                        <div key={area} className="space-y-2">
                          <Label htmlFor={area} className="capitalize">
                            {area.replace(/([A-Z])/g, " $1")} Charge
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id={area}
                              name={area}
                              type="number"
                              value={formData.deliveryCharges[area]}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  deliveryCharges: {
                                    ...prev.deliveryCharges,
                                    [area]: e.target.value,
                                  },
                                }))
                              }
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Main Image
                  </CardTitle>
                  <CardDescription>
                    Recommended Size 600px * 600px
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {formData.mainImage ? (
                      <div className="space-y-4">
                        <img
                          src={formData.mainImage.url}
                          alt="Main product"
                          className="h-48 w-48 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              mainImage: null,
                            }))
                          }
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Click below to upload main image
                        </p>
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() =>
                            document.getElementById("mainImageInput").click()
                          }
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </Button>
                        {/* hidden input */}
                        <input
                          id="mainImageInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "main")}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gallery Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Gallery Images
                  </CardTitle>
                  <CardDescription>
                    Maximum 5 images, Recommended Size 600px * 600px
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {formData.galleryImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Gallery ${index + 1}`}
                            className="h-20 w-full object-cover rounded-lg"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {formData.galleryImages.length < 5 && (
                      <div className="text-center space-y-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Add more images ({5 - formData.galleryImages.length}{" "}
                          remaining)
                        </p>
                        <Button
                          variant="outline"
                          className="gap-2 w-full"
                          onClick={() =>
                            document.getElementById("galleryImageInput").click()
                          }
                        >
                          <Upload className="h-4 w-4" />
                          Upload Images
                        </Button>
                        {/* hidden input */}
                        <input
                          id="galleryImageInput"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "gallery")}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Product Variants
                    </CardTitle>
                    <CardDescription>
                      Manage different variations of your product
                    </CardDescription>
                  </div>
                  <Dialog
                    open={showVariantDialog}
                    onOpenChange={setShowVariantDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Variant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingVariantIndex !== null
                            ? "Edit Variant"
                            : "Add New Variant"}
                        </DialogTitle>
                        <DialogDescription>
                          Add variant details like color, size, etc.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* Variant Image */}
                        <div className="space-y-2">
                          <Label>Variant Image</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            {currentVariant.image ? (
                              <div className="space-y-3">
                                <img
                                  src={currentVariant.image.url}
                                  alt="Variant"
                                  className="h-20 w-20 object-cover rounded-lg mx-auto"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setCurrentVariant((prev) => ({
                                      ...prev,
                                      image: null,
                                    }))
                                  }
                                  className="gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove Image
                                </Button>
                              </div>
                            ) : (
                              <div>
                                <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Upload variant image
                                </p>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileUpload(e, "variant")
                                  }
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button
                                  variant="outline"
                                  className="gap-2 mt-2"
                                >
                                  <Upload className="h-4 w-4" />
                                  Upload Image
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="variant">Variant Name *</Label>
                            <Input
                              id="variant"
                              name="variant"
                              value={currentVariant.variant}
                              onChange={handleVariantInputChange}
                              placeholder="e.g., Red, Large"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                value={currentVariant.price}
                                onChange={handleVariantInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="productCode">Product Code</Label>
                            <Input
                              id="productCode"
                              name="productCode"
                              value={currentVariant.productCode}
                              onChange={handleVariantInputChange}
                              placeholder="Variant code"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              name="quantity"
                              type="number"
                              value={currentVariant.quantity}
                              onChange={handleVariantInputChange}
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={currentVariant.description}
                            onChange={handleVariantInputChange}
                            placeholder="Variant description..."
                            rows={3}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={resetVariantForm}>
                          Cancel
                        </Button>
                        <Button onClick={addOrUpdateVariant} className="gap-2">
                          <Save className="h-4 w-4" />
                          {editingVariantIndex !== null
                            ? "Update Variant"
                            : "Add Variant"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {variants.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Product Code</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.map((variant, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {variant.image && (
                              <img
                                src={variant.image.url}
                                alt="Variant"
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {variant.variant}
                          </TableCell>
                          <TableCell>${variant.price}</TableCell>
                          <TableCell>{variant.productCode}</TableCell>
                          <TableCell>{variant.quantity}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {variant.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => editVariant(index)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => deleteVariant(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No variants added yet.</p>
                    <p className="text-sm">
                      Click "Add Variant" to create your first variant.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your product for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="SEO description for search engines"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive">Product Status</Label>
                      <div className="text-sm text-muted-foreground">
                        {formData.isActive
                          ? "Product is visible to customers"
                          : "Product is hidden"}
                      </div>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isFeatured">Featured Product</Label>
                      <div className="text-sm text-muted-foreground">
                        {formData.isFeatured
                          ? "Product will be featured"
                          : "Product will not be featured"}
                      </div>
                    </div>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddProduct;
