"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

import { API_ENDPOINTS } from "@/config/ApiEndpoints";
import { toast } from "react-toastify";

// Predefined variant types
const variantTypes = [
  {
    id: "size",
    name: "Size",
    options: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "color",
    name: "Color",
    options: ["Red", "Blue", "Green", "Black", "White"],
  },
  {
    id: "material",
    name: "Material",
    options: ["Cotton", "Polyester", "Silk", "Wool"],
  },
];

const UpdateProduct = ({ categories, product, user, productId }) => {
  // Main form state
  const [formData, setFormData] = useState(() => ({
    productName: product?.productName || "",
    regularPrice: product?.regularPrice || "",
    discountType: product?.discountType || "percentage",
    discountValue: product?.discountValue || "",
    productCode: product?.productCode || "",
    availableQuantity: product?.availableQuantity || "",
    categoryId: product?.categoryId || "",
    deliveryCharge: product?.deliveryCharge || "free",
    deliveryCharges: {
      dhaka: product?.deliveryCharges?.dhaka || "",
      outsideDhaka: product?.deliveryCharges?.outsideDhaka || "",
      subarea: product?.deliveryCharges?.subarea || "",
    },
    mainImage: product?.mainImage || null,
    galleryImages: product?.galleryImages || [],
    shortDescription: product?.shortDescription || "",
    longDescription: product?.longDescription || "",
    isActive: product?.isActive ?? true, // use ?? for boolean
    isFeatured: product?.isFeatured ?? false,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
  }));

  // Variant system state
  const [selectedVariantType1, setSelectedVariantType1] = useState("");
  const [selectedVariantType2, setSelectedVariantType2] = useState("none");
  const [variantOptions1, setVariantOptions1] = useState([]);
  const [variantOptions2, setVariantOptions2] = useState([]);
  const [selectedOptions1, setSelectedOptions1] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);

  const [variantCombinations, setVariantCombinations] = useState([]);
  const [variants, setVariants] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [currentVariant, setCurrentVariant] = useState({
    combination: "",
    image: null,
    price: "",
    productCode: "",
    quantity: "",
    description: "",
  });

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

  // Update options when variant types are selected
  useEffect(() => {
    if (selectedVariantType1) {
      const type1 = variantTypes.find((vt) => vt.id === selectedVariantType1);
      setVariantOptions1(type1 ? type1.options : []);
      setSelectedOptions1([]);
    } else {
      setVariantOptions1([]);
      setSelectedOptions1([]);
    }

    if (selectedVariantType2 && selectedVariantType2 !== "none") {
      const type2 = variantTypes.find((vt) => vt.id === selectedVariantType2);
      setVariantOptions2(type2 ? type2.options : []);
      setSelectedOptions2([]);
    } else {
      setVariantOptions2([]);
      setSelectedOptions2([]);
    }
  }, [selectedVariantType1, selectedVariantType2]);

  // Generate combinations when options change
  useEffect(() => {
    generateCombinations();
  }, [selectedOptions1, selectedOptions2]);

  // Generate all possible combinations
  const generateCombinations = () => {
    let combinations = [];

    if (
      selectedOptions1.length > 0 &&
      selectedOptions2.length > 0 &&
      selectedVariantType2 !== "none"
    ) {
      // Both variant types selected - create matrix
      const type1 = variantTypes.find((vt) => vt.id === selectedVariantType1);
      const type2 = variantTypes.find((vt) => vt.id === selectedVariantType2);

      selectedOptions1.forEach((opt1) => {
        selectedOptions2.forEach((opt2) => {
          combinations.push({
            id: `${opt1}-${opt2}`,
            name: `${type1?.name}: ${opt1}, ${type2?.name}: ${opt2}`,
            values: {
              [type1?.name]: opt1,
              [type2?.name]: opt2,
            },
          });
        });
      });
    } else if (selectedOptions1.length > 0) {
      // Only first variant type selected
      const type1 = variantTypes.find((vt) => vt.id === selectedVariantType1);
      selectedOptions1.forEach((opt1) => {
        combinations.push({
          id: opt1,
          name: `${type1?.name}: ${opt1}`,
          values: {
            [type1?.name]: opt1,
          },
        });
      });
    }

    setVariantCombinations(combinations);

    // Initialize variants with combinations
    const newVariants = combinations.map((comb) => {
      const existingVariant = variants.find((v) => v.combination === comb.name);
      return (
        existingVariant || {
          combination: comb.name,
          values: comb.values,
          image: null,
          price: "",
          productCode: "",
          quantity: "",
          description: "",
        }
      );
    });

    setVariants(newVariants);
  };

  // Toggle option selection
  const toggleOption1 = (option) => {
    setSelectedOptions1((prev) =>
      prev.includes(option)
        ? prev.filter((opt) => opt !== option)
        : [...prev, option]
    );
  };

  const toggleOption2 = (option) => {
    setSelectedOptions2((prev) =>
      prev.includes(option)
        ? prev.filter((opt) => opt !== option)
        : [...prev, option]
    );
  };

  // Variant management
  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant((prev) => ({ ...prev, [name]: value }));
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setVariants(updatedVariants);
  };

  const editVariant = (index) => {
    setCurrentVariant(variants[index]);
    setEditingVariantIndex(index);
    setShowVariantDialog(true);
  };

  const saveVariant = () => {
    if (editingVariantIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingVariantIndex] = currentVariant;
      setVariants(updatedVariants);
    }
    setShowVariantDialog(false);
    setEditingVariantIndex(null);
    setCurrentVariant({
      combination: "",
      image: null,
      price: "",
      productCode: "",
      quantity: "",
      description: "",
    });
  };

  const resetVariantForm = () => {
    setCurrentVariant({
      combination: "",
      image: null,
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
      !formData.categoryId
    ) {
      alert("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const submitFormData = new FormData();

      submitFormData.append("productName", formData.productName);
      submitFormData.append("productCode", formData.productCode);
      submitFormData.append("categoryId", formData.categoryId);
      submitFormData.append(
        "availableQuantity",
        formData.availableQuantity || 0
      );
      submitFormData.append("shortDescription", formData.shortDescription);
      submitFormData.append("longDescription", formData.longDescription);
      submitFormData.append("regularPrice", formData.regularPrice || 0);
      submitFormData.append("discountType", formData.discountType);
      submitFormData.append("discountValue", formData.discountValue || 0);
      submitFormData.append("isActive", formData.isActive);
      submitFormData.append("isFeatured", formData.isFeatured);
      submitFormData.append("metaTitle", formData.metaTitle);
      submitFormData.append("metaDescription", formData.metaDescription);
      submitFormData.append("deliveryCharge", formData.deliveryCharge);
      if (formData.deliveryCharge === "paid") {
        submitFormData.append(
          "deliveryCharges",
          JSON.stringify(formData.deliveryCharges)
        );
      }
      if (formData.mainImage) {
        submitFormData.append("mainImage", formData.mainImage.file);
      }
      formData.galleryImages?.forEach((img, index) => {
        submitFormData.append(`galleryImages`, img.file);
      });
      submitFormData.append("variants", JSON.stringify(variants));
      submitFormData.append("shopId", user.shopId);
      submitFormData.append("userId", user.userId);

      const response = await fetch(
        API_ENDPOINTS.BASE_URL + "/product/update/" + productId,
        {
          method: "POST",
          body: submitFormData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      const data = await response.json();
      toast.success("Product created successfully!");
      // router.push("/dashboard/category");
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

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              className="order-2 sm:order-1 px-6 py-3 border border-indigo-600 text-indigo-600 bg-white rounded-lg font-semibold text-base hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 bangla-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="order-1 sm:order-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-base hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 bangla-text"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99999L16.25 7.82843M4.92157 19.0784L7.75 16.25M4.92157 4.92157L7.75 7.75"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Add Product
                </>
              )}
            </button>
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
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
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
                          <SelectValue placeholder="Select discount type" />
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
                        <SelectValue placeholder="Select delivery type" />
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
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Click to upload main image
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "main")}
                            className="hidden"
                            id="mainImageInput"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() =>
                            document.getElementById("mainImageInput")?.click()
                          }
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </Button>
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
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, "gallery")}
                          className="hidden"
                          id="galleryImageInput"
                        />
                        <Button
                          variant="outline"
                          className="gap-2 w-full"
                          onClick={() =>
                            document
                              .getElementById("galleryImageInput")
                              ?.click()
                          }
                        >
                          <Upload className="h-4 w-4" />
                          Upload Images
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Product Variants
                </CardTitle>
                <CardDescription>
                  Create variant combinations by selecting types and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variant Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Variant Type 1 */}
                  <div className="space-y-4">
                    <Label htmlFor="variant-type-1">
                      Variant Type 1 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={selectedVariantType1}
                      onValueChange={setSelectedVariantType1}
                    >
                      <SelectTrigger id="variant-type-1">
                        <SelectValue placeholder="Select first variant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {variantTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedVariantType1 && (
                      <div className="space-y-2">
                        <Label>
                          Select{" "}
                          {
                            variantTypes.find(
                              (vt) => vt.id === selectedVariantType1
                            )?.name
                          }{" "}
                          Options
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {variantOptions1.map((option) => (
                            <Badge
                              key={option}
                              variant={
                                selectedOptions1.includes(option)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer px-3 py-1"
                              onClick={() => toggleOption1(option)}
                            >
                              {option}
                              {selectedOptions1.includes(option) && (
                                <X className="h-3 w-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedOptions1.length} selected
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Variant Type 2 */}
                  <div className="space-y-4">
                    <Label htmlFor="variant-type-2">
                      Variant Type 2 (Optional)
                    </Label>
                    <Select
                      value={selectedVariantType2}
                      onValueChange={setSelectedVariantType2}
                    >
                      <SelectTrigger id="variant-type-2">
                        <SelectValue placeholder="Select second variant type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {variantTypes
                          .filter((vt) => vt.id !== selectedVariantType1)
                          .map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {selectedVariantType2 &&
                      selectedVariantType2 !== "none" && (
                        <div className="space-y-2">
                          <Label>
                            Select{" "}
                            {
                              variantTypes.find(
                                (vt) => vt.id === selectedVariantType2
                              )?.name
                            }{" "}
                            Options
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {variantOptions2.map((option) => (
                              <Badge
                                key={option}
                                variant={
                                  selectedOptions2.includes(option)
                                    ? "default"
                                    : "outline"
                                }
                                className="cursor-pointer px-3 py-1"
                                onClick={() => toggleOption2(option)}
                              >
                                {option}
                                {selectedOptions2.includes(option) && (
                                  <X className="h-3 w-3 ml-1" />
                                )}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {selectedOptions2.length} selected
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Generated Combinations */}
                {variantCombinations.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Variant Combinations
                      </CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {variantCombinations.length} combinations generated
                      </span>
                    </div>

                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Variant Combination</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variants.map((variant, index) => (
                            <TableRow key={variant.combination}>
                              <TableCell className="font-medium">
                                {variant.combination}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  value={variant.price}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.quantity}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="SKU"
                                  value={variant.productCode}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "productCode",
                                      e.target.value
                                    )
                                  }
                                  className="w-32"
                                />
                              </TableCell>
                              <TableCell>
                                {variant.image ? (
                                  <img
                                    src={variant.image.url}
                                    alt="Variant"
                                    className="h-10 w-10 object-cover rounded"
                                  />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editVariant(index)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Variant Detail Dialog */}
            <Dialog
              open={showVariantDialog}
              onOpenChange={setShowVariantDialog}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Variant</DialogTitle>
                  <DialogDescription>
                    Configure details for {currentVariant.combination}
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "variant")}
                            className="hidden"
                            id="variantImageInput"
                          />
                          <Button
                            variant="outline"
                            className="gap-2 mt-2"
                            onClick={() =>
                              document
                                .getElementById("variantImageInput")
                                ?.click()
                            }
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
                      <Label htmlFor="price">Price</Label>
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
                        />
                      </div>
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
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="productCode">Product Code</Label>
                      <Input
                        id="productCode"
                        name="productCode"
                        value={currentVariant.productCode}
                        onChange={handleVariantInputChange}
                        placeholder="Variant code"
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
                  <Button onClick={saveVariant} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Variant
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

export default UpdateProduct;
