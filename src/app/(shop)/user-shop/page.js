// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
// import { COLORS, CATEGORIES, PRODUCTS } from '@/lib/constants'
// lib/constants.js
export const COLORS = {
  primary: {
    light: "#3b82f6",
    dark: "#1d4ed8",
  },
  secondary: {
    light: "#f59e0b",
    dark: "#d97706",
  },
  background: {
    light: "#ffffff",
    dark: "#0f172a",
  },
  text: {
    light: "#1f2937",
    dark: "#f8fafc",
  },
  muted: {
    light: "#6b7280",
    dark: "#94a3b8",
  },
};

export const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    image: "/images/electronics.jpg",
    slug: "electronics",
  },
  { id: 2, name: "Clothing", image: "/images/clothing.jpg", slug: "clothing" },
  {
    id: 3,
    name: "Home & Garden",
    image: "/images/home-garden.jpg",
    slug: "home-garden",
  },
  { id: 4, name: "Sports", image: "/images/sports.jpg", slug: "sports" },
  { id: 5, name: "Beauty", image: "/images/beauty.jpg", slug: "beauty" },
  { id: 6, name: "Books", image: "/images/books.jpg", slug: "books" },
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    originalPrice: 129.99,
    image: "/images/headphones.jpg",
    category: "Electronics",
    rating: 4.5,
    reviews: 124,
    isFeatured: true,
    isTopSelling: true,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/images/smartwatch.jpg",
    category: "Electronics",
    rating: 4.3,
    reviews: 89,
    isFeatured: true,
    isTopSelling: true,
  },
  // Add more products as needed
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const slides = [
    {
      id: 1,
      image: "/images/slide1.jpg",
      title: "Summer Collection 2024",
      subtitle: "Up to 50% Off",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      image: "/images/slide2.jpg",
      title: "New Tech Gadgets",
      subtitle: "Latest Innovation",
      buttonText: "Explore",
    },
    {
      id: 3,
      image: "/images/slide3.jpg",
      title: "Home Essentials",
      subtitle: "Comfort for Your Home",
      buttonText: "Discover",
    },
  ];

  const banners = [
    {
      id: 1,
      image: "/images/banner1.jpg",
      title: "Smartphones",
      subtitle: "Latest Models",
    },
    {
      id: 2,
      image: "/images/banner2.jpg",
      title: "Laptops",
      subtitle: "Powerful Performance",
    },
    {
      id: 3,
      image: "/images/banner3.jpg",
      title: "Accessories",
      subtitle: "Complete Your Setup",
    },
  ];

  const topSellingProducts = PRODUCTS.filter((product) => product.isTopSelling);
  const featuredProducts = PRODUCTS.filter((product) => product.isFeatured);
  const allProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS]; // Mock more products

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Pagination
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const currentProducts = allProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.background.light,
        color: COLORS.text.light,
      }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: COLORS.muted.light + "20" }}
      >
        <div className="container mx-auto px-4 py-3">
          <div
            className="flex justify-between items-center text-sm"
            style={{ color: COLORS.muted.light }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>support@shopex.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
                <Button variant="ghost" size="sm">
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b"
        style={{ borderColor: COLORS.muted.light + "20" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="text-2xl font-bold"
              style={{ color: COLORS.primary.light }}
            >
              ShopEx
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Shop
              </a>
              <div className="relative group">
                <button className="font-medium hover:text-blue-600 transition-colors flex items-center">
                  Categories{" "}
                  <ChevronRight className="h-4 w-4 ml-1 transform group-hover:rotate-90 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {CATEGORIES.map((category) => (
                    <a
                      key={category.id}
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="#"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                About Us
              </a>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Slider */}
        <section className="relative h-96 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute left-20 top-1/2 transform -translate-y-1/2 text-white max-w-md">
                  <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-xl mb-4">{slide.subtitle}</p>
                  <Button
                    size="lg"
                    style={{ backgroundColor: COLORS.primary.light }}
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative h-48 rounded-lg overflow-hidden group"
                >
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-4xl">🖼️</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{banner.title}</h3>
                    <p>{banner.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Selling Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Top Selling Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Product List with Pagination */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              All Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {currentProducts.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">ShopEx</h3>
              <p className="text-gray-400 mb-4">
                Your one-stop destination for all your shopping needs. Quality
                products at affordable prices.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 cursor-pointer hover:text-blue-400" />
                <Twitter className="h-5 w-5 cursor-pointer hover:text-blue-400" />
                <Instagram className="h-5 w-5 cursor-pointer hover:text-pink-400" />
                <Youtube className="h-5 w-5 cursor-pointer hover:text-red-400" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                {CATEGORIES.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <a href="#" className="hover:text-white transition-colors">
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Street, City, Country</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@shopex.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopEx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{product.category}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
            </div>
          </div>
          <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span
              className="text-lg font-bold"
              style={{ color: COLORS.primary.light }}
            >
              ${product.price}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          </div>
        </div>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            style={{ backgroundColor: COLORS.primary.light }}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
