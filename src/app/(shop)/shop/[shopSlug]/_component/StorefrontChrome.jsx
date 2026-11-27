/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingCart,
  Sparkles,
  Store,
} from "lucide-react";
import {
  CART_EVENT_NAME,
  buildStorePalette,
  computeCartTotals,
  formatPrice,
  getStoreWhatsappUrl,
  readStoreCart,
  rgba,
} from "../_lib/storefrontUtils";

export default function StorefrontChrome({
  store,
  activePage = "",
  breadcrumbs = [],
  children,
}) {
  const {
    shopId,
    shop,
    merchant,
    shopInfo,
    theme = {},
    socialLinks,
    delivery = {},
  } = store;

  const palette = useMemo(() => buildStorePalette(theme), [theme]);
  const baseHref = `/shop/${encodeURIComponent(shop.shopSlug || shop.shopId)}`;

  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(readStoreCart(shopId));
    const onSync = (e) => {
      if (!e?.detail?.shopId || e.detail.shopId === shopId) {
        setCart(readStoreCart(shopId));
      }
    };
    window.addEventListener(CART_EVENT_NAME, onSync);
    window.addEventListener("storage", onSync);
    return () => {
      window.removeEventListener(CART_EVENT_NAME, onSync);
      window.removeEventListener("storage", onSync);
    };
  }, [shopId]);

  const cartTotals = useMemo(
    () => computeCartTotals(cart, delivery, "insideDhaka"),
    [cart, delivery]
  );

  const contactPhone = shopInfo?.phone || merchant?.phone || "";
  const contactEmail = shopInfo?.email || merchant?.email || "";
  const whatsappUrl = useMemo(
    () => getStoreWhatsappUrl(socialLinks, contactPhone),
    [socialLinks, contactPhone]
  );

  const navLinks = [
    { key: "home", label: "Shop", href: baseHref },
    { key: "about", label: "About Us", href: `${baseHref}/about` },
    { key: "terms", label: "Terms", href: `${baseHref}/terms` },
    { key: "privacy", label: "Privacy Policy", href: `${baseHref}/privacy-policy` },
  ];

  return (
    <div
      style={{
        backgroundColor: palette.background,
        color: palette.text,
      }}
      className="min-h-screen flex flex-col selection:bg-violet-600 selection:text-white"
    >
      {/* Top Announcement Bar */}
      <div
        style={{ backgroundColor: palette.primary }}
        className="text-white text-[11px] sm:text-xs font-medium py-2 px-4 print:hidden"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <p className="truncate flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              Welcome to <strong>{shop.shopName}</strong> · Cash on Delivery Across Bangladesh!
            </span>
          </p>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3" /> {contactPhone}
              </a>
            )}
            <span className="opacity-80">Shop ID: #{shop.shopId}</span>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <header
        style={{
          backgroundColor: palette.isDarkBg
            ? rgba(palette.background, 0.9)
            : "rgba(255, 255, 255, 0.92)",
          borderBottom: `1px solid ${palette.borderCol}`,
        }}
        className="sticky top-0 z-40 backdrop-blur-xl print:hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[70px] flex items-center justify-between gap-4">
          {/* Logo & Store Name */}
          <Link
            href={baseHref}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 group"
          >
            {shopInfo?.companyLogo?.url ? (
              <img
                src={shopInfo.companyLogo.url}
                alt={shop.shopName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-black/10 shrink-0"
              />
            ) : (
              <div
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0"
              >
                {String(shop.shopName || "S").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-extrabold text-sm sm:text-lg tracking-tight truncate bangla-text"
                  style={{ color: palette.text }}
                >
                  {shop.shopName}
                </span>
                <BadgeCheck
                  className="w-4 h-4 shrink-0"
                  style={{ color: palette.primary }}
                />
              </div>
              <p
                className="text-[10px] sm:text-xs truncate"
                style={{ color: palette.muted }}
              >
                Official Online Storefront
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isCurrent = activePage === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  style={
                    isCurrent
                      ? {
                          backgroundColor: rgba(palette.primary, 0.12),
                          color: palette.primary,
                        }
                      : { color: palette.text }
                  }
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition hover:opacity-80"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Support"
                style={{
                  backgroundColor: rgba(palette.accent, 0.12),
                  color: palette.accent,
                }}
                className="w-10 h-10 rounded-xl hidden sm:inline-flex items-center justify-center hover:opacity-85 transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            )}

            <Link
              href={`${baseHref}/checkout`}
              style={{ backgroundColor: palette.primary }}
              className="relative h-10 px-3.5 sm:px-4 rounded-xl text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md hover:opacity-95 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">
                {cartTotals.totalItems > 0
                  ? formatPrice(cartTotals.discountedSubtotal)
                  : "Checkout"}
              </span>
              <span
                style={{ backgroundColor: palette.secondary }}
                className="min-w-5 h-5 px-1.5 rounded-full text-[11px] font-extrabold inline-flex items-center justify-center text-white"
              >
                {cartTotals.totalItems}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Quick Nav Strip */}
        <div
          style={{ borderTop: `1px solid ${palette.borderCol}` }}
          className="md:hidden px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        >
          {navLinks.map((link) => {
            const isCurrent = activePage === link.key;
            return (
              <Link
                key={link.key}
                href={link.href}
                style={
                  isCurrent
                    ? {
                        backgroundColor: palette.primary,
                        color: "#ffffff",
                      }
                    : {
                        backgroundColor: palette.subtleBg,
                        color: palette.text,
                      }
                }
                className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Breadcrumb Bar */}
      {breadcrumbs.length > 0 && (
        <div
          style={{
            backgroundColor: palette.subtleBg,
            borderBottom: `1px solid ${palette.borderCol}`,
          }}
          className="print:hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
            <Link
              href={baseHref}
              className="inline-flex items-center gap-1 font-semibold shrink-0 hover:underline"
              style={{ color: palette.primary }}
            >
              <Home className="w-3.5 h-3.5" />
              {shop.shopName}
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight
                  className="w-3.5 h-3.5 shrink-0 opacity-50"
                  style={{ color: palette.muted }}
                />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="font-semibold shrink-0 hover:underline bangla-text"
                    style={{ color: palette.muted }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="font-bold truncate max-w-[240px] sm:max-w-md bangla-text"
                    style={{ color: palette.text }}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">{children}</div>

      {/* Storefront Footer */}
      <footer
        style={{ backgroundColor: palette.footer }}
        className="text-white/90 mt-auto pt-12 pb-10 print:hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {shopInfo?.companyLogo?.url ? (
                <img
                  src={shopInfo.companyLogo.url}
                  alt={shop.shopName}
                  className="w-10 h-10 rounded-xl object-cover bg-white"
                />
              ) : (
                <div
                  style={{ backgroundColor: palette.primary }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white"
                >
                  {String(shop.shopName || "S").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-extrabold text-white bangla-text">
                  {shop.shopName}
                </h3>
                <p className="text-xs text-white/60">/{shop.shopSlug}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed bangla-text">
              {shopInfo?.description ||
                shopInfo?.shopInfo ||
                `Shop authentic products from ${shop.shopName} with fast nationwide Cash on Delivery.`}
            </p>
          </div>

          {/* Col 2: Quick Pages */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Store Information
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <Link href={baseHref} className="hover:text-white hover:underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseHref}/about`}
                  className="hover:text-white hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseHref}/checkout`}
                  className="hover:text-white hover:underline"
                >
                  Checkout & Bag
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseHref}/terms`}
                  className="hover:text-white hover:underline"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href={`${baseHref}/privacy-policy`}
                  className="hover:text-white hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Contact & Address
            </h4>
            {shopInfo?.shopAddress && (
              <p className="text-xs sm:text-sm text-white/80 flex items-start gap-2 bangla-text">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/60" />
                <span>{shopInfo.shopAddress}</span>
              </p>
            )}
            {contactPhone && (
              <p className="text-xs sm:text-sm text-white/80 flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-white/60" />
                <a href={`tel:${contactPhone}`} className="hover:underline">
                  {contactPhone}
                </a>
              </p>
            )}
            {contactEmail && (
              <p className="text-xs sm:text-sm text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-white/60" />
                <span>{contactEmail}</span>
              </p>
            )}
          </div>

          {/* Col 4: Social & Delivery */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Follow & Delivery
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                >
                  Facebook
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                >
                  Instagram
                </a>
              )}
              {socialLinks?.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                >
                  YouTube
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition"
                >
                  WhatsApp
                </a>
              )}
            </div>
            <p className="text-xs text-white/65 leading-relaxed">
              Inside Dhaka:{" "}
              <strong className="text-white">
                {formatPrice(delivery.deliveryChargeInside ?? 60)}
              </strong>{" "}
              · Outside Dhaka:{" "}
              <strong className="text-white">
                {formatPrice(delivery.deliveryChargeOutside ?? 120)}
              </strong>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <p>
            &copy; {new Date().getFullYear()} {shop.shopName}. All rights reserved.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition"
          >
            <Store className="w-3.5 h-3.5" /> Powered by{" "}
            <strong className="text-white">AMARDokan</strong>
          </Link>
        </div>
      </footer>
    </div>
  );
}
