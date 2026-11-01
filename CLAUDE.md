# CLAUDE.md — AMARDokan (fl-dashboard) Project Guide

> **Project:** AMARDokan (Bangladeshi Multi-Tenant E-Commerce & Merchant Automation Platform)  
> **Repository:** `fl-dashboard`  
> **Primary Runtime:** Node.js (v18+) with `pnpm`  
> **Framework:** Next.js 16 (App Router with Turbopack) + React 19

---

## 1. Project Overview

AMARDokan is an all-in-one e-commerce management and merchant automation dashboard tailored for Bangladeshi online merchants. Key functionalities include:
- **Multi-Tenant Shop Management:** Domain management, shop customization, themes, social links, SEO marketing settings.
- **Order & Inventory Lifecycle:** Order creation, status pipeline, bulk invoice PDF generation (`jspdf`), inventory/variant tracking.
- **Courier & Logistics Integration:** Steadfast, Pathao, RedX shipping integrations.
- **Realtime Notifications:** Pusher channels for instant order updates and visitor counts.
- **Bilingual UI Support:** Native Bengali (`Hind Siliguri` font) & English typography.
- **Storage & Media:** ImageKit / Cloudinary asset uploads.

---

## 2. Tech Stack & Dependencies

| Category | Technology |
|---|---|
| **Core Framework** | Next.js 16.2.x (App Router, Turbopack enabled) |
| **Frontend Library** | React 19.2.x, React DOM 19.2.x |
| **Styling & UI** | Tailwind CSS v4 (`@tailwindcss/postcss`), Radix UI Primitives (shadcn/ui), `lucide-react`, `tw-animate-css` |
| **Database & ORM** | MongoDB with Mongoose 9.x (Serverless cached connection) |
| **Forms & Validation** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **Authentication** | JWT (`jsonwebtoken`, `jwt-decode`), `bcryptjs`, cookie-based session (`js-cookie`) |
| **Realtime** | Pusher Server (`pusher`) & Pusher Client (`pusher-js`) |
| **Media / Assets** | ImageKit (`@imagekit/nodejs`), Cloudinary |
| **PDF Generation** | `jspdf` (for Bengali/English bulk printable invoices) |
| **Charts & Analytics** | `recharts` |
| **Package Manager** | `pnpm` (lockfile: `pnpm-lock.yaml`) |

---

## 3. Essential Commands

Always use `pnpm` as the package manager for this project:

```bash
# Development (with Turbopack)
pnpm dev

# Production Build
pnpm build

# Start Production Server
pnpm start

# Lint Codebase
pnpm lint

# Install New Dependency
pnpm add <package-name>

# Install New Dev Dependency
pnpm add -D <package-name>
```

---

## 4. Recommended Project Structure

```
fl-dashboard/
├── .env.example               # Template for environment variables
├── .env.local / .env          # Active environment secrets
├── components.json            # shadcn/ui configuration
├── jsconfig.json              # Path alias mapping (@/* -> ./src/*)
├── next.config.mjs            # Next.js config (image domains: ik.imagekit.io)
├── package.json               # Scripts & dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js         # Tailwind configuration
├── public/                    # Static assets, fonts, default logos
└── src/
    ├── app/                   # Next.js App Router (File-system routes)
    │   ├── (auth)/            # Auth route group: login, registration, verify
    │   ├── (dashboard)/       # Merchant backoffice: orders, products, analytics
    │   │   ├── _component/    # Dashboard-shared layout components (Sidebar, TopNav)
    │   │   └── dashboard/     # Sub-pages: /orders, /products, /analytics, /settings
    │   ├── (shop)/            # Tenant storefront routes: /shop, /user-shop
    │   ├── (home)/            # Public marketing landing page & pricing
    │   ├── (common)/          # Legal & policy routes: /privacy, /terms
    │   ├── actions/           # Next.js Server Actions ('use server')
    │   ├── api/               # Next.js Route Handlers (Cron, Webhooks)
    │   ├── globals.css        # Tailwind v4 entry, @custom-variant, Bengali fonts
    │   ├── layout.js          # Root layout (ThemeProvider, Sonner, Toastify)
    │   ├── loading.js         # Global suspense fallback
    │   ├── not-found.js       # 404 page
    │   └── sitemap.js         # Dynamic XML sitemap
    │
    ├── components/            # Reusable UI & Domain Components
    │   ├── ui/                # shadcn/ui atomic primitives (button, dialog, input, etc.)
    │   ├── dashboard/         # Domain components for dashboard features
    │   ├── commons/           # Shared UI elements (headers, footers, loaders)
    │   └── meta/              # Structured data, JSON-LD, SEO elements
    │
    ├── models/                # Mongoose Models (PascalCase export, cached init)
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   ├── ShopInfo.js
    │   └── ...
    │
    ├── queries/               # Data-fetching queries & database operations
    │   ├── user.js
    │   ├── product.js
    │   ├── order.js
    │   └── dashboardStats.js
    │
    ├── lib/                   # Shared utilities, configs, third-party clients
    │   ├── db/
    │   │   └── mongoose.js    # Global cached Mongoose connection for serverless
    │   ├── auth/              # Server & client auth helpers
    │   ├── pusher-client.js   # Client Pusher subscription
    │   ├── pusher-server.js   # Server Pusher trigger instance
    │   ├── seo.js             # SEO metadata single source of truth
    │   └── utils.js           # cn() clsx + twMerge utility
    │
    ├── utils/                 # General helper utilities (email, upload, date)
    │   ├── mail.js            # Nodemailer transport & HTML email templates
    │   ├── imageUpload.js     # ImageKit / Cloudinary image upload handlers
    │   └── permissions.js     # Role-based access control helpers
    │
    ├── hooks/                 # Custom React hooks (e.g., use-mobile.js)
    ├── constants/             # Application constants, role enums, order statuses
    └── config/                # Billing tiers, API endpoint configuration
```

> **Note on Migration:** Notice existing directories `src/model` (singular) and `src/utlis` (misspelled). For clean refactoring, standardize toward `models/` and `utils/` while preserving backward compatibility.

---

## 5. Architectural Conventions & Guidelines

### 5.1 Server Components vs Client Components
- **Default to Server Components (RSC):** Keep pages and parent containers as Server Components for fast initial HTML and SEO.
- **Use `'use client'` sparingly:** Only add `'use client'` to components that use:
  - React hooks (`useState`, `useEffect`, `useCallback`, `useForm`)
  - Browser APIs (`window`, `localStorage`, `document`, `navigator`)
  - Interactive event listeners (`onClick`, `onChange`, `onSubmit`)
  - Animation and carousel libraries (`embla-carousel-react`, `vaul`)
- **Server Actions (`'use server'`):**
  - Keep mutations inside `src/app/actions/` or exported directly from separate server action files.
  - Always validate incoming payloads using `zod` before querying the database.
  - Return predictable status objects: `{ success: true, data }` or `{ success: false, error: string }`.

### 5.2 MongoDB & Mongoose Pattern
Because Next.js runs in serverless/hot-reloading environments, **always use the cached connection helper**:
```javascript
import { dbConnect } from "@/service/mongo"; // or "@/lib/db/mongoose"

export async function getProducts() {
  await dbConnect();
  return await Product.find({}).lean();
}
```

When defining Mongoose models, guard against re-compilation in development:
```javascript
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  shopId: { type: Schema.Types.ObjectId, ref: "ShopInfo" },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
```

### 5.3 Authentication & Session Flow
- **Token Storage:** JWT tokens are stored in strict HTTP cookies (`token`, `user`, `role`).
- **Client Access:** Use `@/lib/auth.js` (`getToken()`, `getUser()`, `getRole()`).
- **Server Guarding:** Verify JWT using `jsonwebtoken` on server actions or route handlers against `process.env.JWT_SECRET`.
- **RBAC:** Enforce roles (`admin`, `merchant`, `staff`, `customer`) via `src/utlis/permissions.js`.

### 5.4 Realtime Events (Pusher)
- Client: Subscribe via `@/lib/pusher-client.js` with `NEXT_PUBLIC_PUSHER_KEY` and `NEXT_PUBLIC_PUSHER_CLUSTER`.
- Server: Trigger notifications via `@/lib/pusher-server.js` with `PUSHER_SECRET`.

---

## 6. Code Style & Standards

1. **Imports & Aliases:**
   - Always use the `@/*` alias (mapped in `jsconfig.json` to `./src/*`).
   - Group imports in order:
     1. Node / React / Next.js core (`react`, `next/navigation`, `next/image`)
     2. Third-party packages (`lucide-react`, `zod`, `mongoose`)
     3. Internal components (`@/components/ui/...`)
     4. Internal lib/queries/actions (`@/queries/...`, `@/lib/...`)
     5. Styles / assets
2. **Naming Conventions:**
   - **React Components:** PascalCase file names and function names (`OrderTable.jsx`, `MetricCard.jsx`).
   - **Utilities & Helpers:** camelCase (`formatCurrency.js`, `generateInvoice.js`).
   - **Route files:** Next.js standard lowercase (`page.js`, `layout.js`, `loading.js`, `error.js`).
   - **Private route components:** Prefixed with underscore `_component/`.
3. **Typography & Styling:**
   - Use standard Tailwind utility classes.
   - For Bengali typography, ensure `font-family: 'Hind Siliguri'` is applied (set globally in `globals.css`).
   - Use `cn(...)` from `@/lib/utils` for conditional class joining.
4. **Form Handling:**
   - Use `react-hook-form` with `@hookform/resolvers/zod`.
   - Show user-friendly toast feedback using `sonner` (`toast.success()`, `toast.error()`).

---

## 7. Environment Variables Reference

Ensure all of the following variables are defined in `.env.local`:

```env
# MongoDB Connection
MONGODB_CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/fl-database

# JWT Secret
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# ImageKit Storage
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...

# Email Delivery (Gmail SMTP)
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Pusher Realtime (Server)
PUSHER_KEY=...
PUSHER_CLUSTER=ap1
PUSHER_SECRET=...

# Pusher Realtime (Client)
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=ap1

# Application URLs
NEXT_PUBLIC_API_URL=https://...
```

---

## 8. Common Pitfalls & Best Practices

1. **Never Call `mongoose.connect()` Directly:** Always call `await dbConnect()` so the pool is reused across requests and HMR reloads.
2. **Avoid Plain `new Object()` Mutations in Server Components:** Always return plain JSON/primitives from queries (`.lean()` or serialize `_id.toString()`) to prevent Next.js serialization warnings.
3. **Pusher Client Cleanup:** In `useEffect`, always unbind events and unsubscribe channels on component unmount.
4. **ImageKit Remote Patterns:** If adding external domains for images, declare them under `images.remotePatterns` in `next.config.mjs`.
5. **PDF Bangla Font Rendering:** When rendering Bengali invoices in `jspdf`, ensure custom Unicode fonts are encoded/embedded to prevent broken character glyphs.
