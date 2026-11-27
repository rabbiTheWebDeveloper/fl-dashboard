import bcrypt from "bcryptjs";
import dns from "dns/promises";
import jwt from "jsonwebtoken";
import {
  ADMIN_MODULES,
  ADMIN_ROLES,
  AdminUserModel,
  PlatformSettingModel,
} from "@/model/admin-user-model";
import { UserModel } from "@/model/user-model";
import Shop from "@/model/shop.model";
import { ShopInfoModel } from "@/model/shopInfo-model";
import { DomainModel } from "@/model/domain-model";
import { ThemeModel } from "@/model/theme-model";
import { ProductModel } from "@/model/product-model";
import { OrderModel } from "@/model/order-model";
import { CustomerModel } from "@/model/customer-model";
import { BillingModel } from "@/model/billing-model";
import { DepositeModel } from "@/model/deposite-model";
import { shopVisitorModel } from "@/model/shopVisitor-model";
import { visitorCountModel } from "@/model/visitorCount-model";
import { VisitorCountDayModel } from "@/model/visitorCountDay-model";
import Category from "@/model/category-model";
import {
  BILLING_CYCLE_DAYS,
  GRACE_PERIOD_DAYS,
  PLANS,
  VAT_PERCENT,
} from "@/config/billingConfig";
import { dbConnect } from "@/service/mongo";
import { issueAdminSessionTokens } from "@/queries/authTokens";

const DEFAULT_SUPERADMIN_EMAIL = "admin@sm.com";
const DEFAULT_SUPERADMIN_INITIAL_PASS = "810880";

function serialize(val) {
  return JSON.parse(JSON.stringify(val));
}

/**
 * Idempotently ensure the primary `superadmin` account (`admin@sm.com`) exists in `AdminUserModel`.
 * Never overwrites an existing `admin@sm.com` record so password updates persist safely.
 */
export async function ensureSuperAdminSeeded() {
  await dbConnect();

  const existing = await AdminUserModel.findOne({
    email: DEFAULT_SUPERADMIN_EMAIL,
  }).lean();

  if (existing) return existing;

  const hashedPassword = await bcrypt.hash(DEFAULT_SUPERADMIN_INITIAL_PASS, 10);
  const created = await AdminUserModel.create({
    fullName: "Super Admin",
    email: DEFAULT_SUPERADMIN_EMAIL,
    phone: "01700000000",
    password: hashedPassword,
    role: "superadmin",
    permissions: [...ADMIN_MODULES],
    status: "active",
    department: "Executive Administration",
  });

  return created.toObject();
}

/**
 * Authenticate an admin account from `AdminUserModel`.
 * Returns `null` if no `AdminUserModel` account exists for `email` (allowing fallback to merchant `UserModel`).
 */
export async function authenticateAdminAccount({
  email: rawEmail,
  password,
  rememberMe = false,
}) {
  await ensureSuperAdminSeeded();

  const email = String(rawEmail || "").trim().toLowerCase();
  if (!email || !password) return null;

  const admin = await AdminUserModel.findOne({ email });
  if (!admin) return null;

  if (admin.status !== "active") {
    return {
      status: false,
      code: "ACCOUNT_SUSPENDED",
      message: "This admin account is currently suspended. Contact a Superadmin.",
    };
  }

  const isMatch = await bcrypt.compare(String(password), admin.password);
  if (!isMatch) {
    return {
      status: false,
      code: "INVALID_CREDENTIALS",
      message: "Invalid admin email or password.",
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("Server JWT_SECRET configuration is missing.");
  }

  const sessionBundle = await issueAdminSessionTokens(admin._id, {
    rememberMe,
  });

  return serialize({
    status: true,
    message: `Welcome back, ${admin.fullName}!`,
    redirectTo: "/admin",
    ...sessionBundle,
  });
}

/* ─── 1. Executive Overview Dashboard Query ─── */
export async function getAdminOverviewStatsQuery() {
  await ensureSuperAdminSeeded();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalMerchants,
    verifiedMerchants,
    totalShops,
    totalProducts,
    activeProducts,
    totalAdmins,
    orderFacetArr,
    billingFacetArr,
    dailyOrders,
    topShopsAgg,
    recentOrdersRaw,
    recentMerchants,
  ] = await Promise.all([
    UserModel.countDocuments({ role: "merchant" }),
    UserModel.countDocuments({ role: "merchant", emailVerified: true }),
    Shop.countDocuments({}),
    ProductModel.countDocuments({}),
    ProductModel.countDocuments({ isActive: { $ne: false } }),
    AdminUserModel.countDocuments({}),
    OrderModel.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalGmv: { $sum: { $ifNull: ["$grand_total", 0] } },
                confirmedGmv: {
                  $sum: {
                    $cond: [
                      { $in: ["$status", ["confirmed", "shipped", "delivered"]] },
                      { $ifNull: ["$grand_total", 0] },
                      0,
                    ],
                  },
                },
              },
            },
          ],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],
        },
      },
    ]),
    BillingModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: { $ifNull: ["$totalDue", 0] } },
        },
      },
    ]),
    OrderModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$grand_total", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    OrderModel.aggregate([
      {
        $group: {
          _id: "$shopId",
          orderCount: { $sum: 1 },
          gmv: { $sum: { $ifNull: ["$grand_total", 0] } },
        },
      },
      { $sort: { gmv: -1 } },
      { $limit: 5 },
    ]),
    OrderModel.find({})
      .populate({
        path: "customer",
        model: CustomerModel,
        select: "customerName customerPhone",
      })
      .populate({ path: "shopId", model: Shop, select: "shopName shopSlug" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    UserModel.find({ role: "merchant" })
      .populate({ path: "shops", model: Shop, select: "shopName shopSlug shopId" })
      .select("fullName email phone emailVerified payment_status createdAt shops")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  const orderTotals = orderFacetArr?.[0]?.totals?.[0] || {
    totalOrders: 0,
    totalGmv: 0,
    confirmedGmv: 0,
  };

  const statusMap = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const s of orderFacetArr?.[0]?.byStatus || []) {
    if (s?._id && s._id in statusMap) statusMap[s._id] = s.count;
  }

  let saasPaidRevenue = 0;
  let saasPendingDues = 0;
  for (const b of billingFacetArr || []) {
    if (b._id === "paid") saasPaidRevenue += b.amount;
    if (b._id === "unpaid" || b._id === "overdue") saasPendingDues += b.amount;
  }

  // Build continuous 7-day chart array
  const dailyMap = Object.fromEntries(dailyOrders.map((d) => [d._id, d]));
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    const label = dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    trendData.push({
      date: label,
      orders: dailyMap[key]?.orders || 0,
      revenue: dailyMap[key]?.revenue || 0,
    });
  }

  // Hydrate top shops
  const topShopIds = topShopsAgg.map((t) => t._id).filter(Boolean);
  const topShopDocs =
    topShopIds.length > 0
      ? await Shop.find({ _id: { $in: topShopIds } })
          .select("shopName shopSlug shopId")
          .lean()
      : [];
  const shopDocMap = Object.fromEntries(
    topShopDocs.map((s) => [String(s._id), s])
  );

  const topShops = topShopsAgg
    .map((item) => {
      const s = shopDocMap[String(item._id)];
      if (!s) return null;
      return {
        _id: String(s._id),
        shopName: s.shopName,
        shopSlug: s.shopSlug || s.shopId,
        shopId: s.shopId,
        orderCount: item.orderCount,
        gmv: item.gmv,
      };
    })
    .filter(Boolean);

  return serialize({
    kpis: {
      totalMerchants,
      verifiedMerchants,
      totalShops,
      totalProducts,
      activeProducts,
      totalAdmins,
      totalOrders: orderTotals.totalOrders,
      totalGmv: orderTotals.totalGmv,
      confirmedGmv: orderTotals.confirmedGmv,
      saasPaidRevenue,
      saasPendingDues,
    },
    statusBreakdown: statusMap,
    trendData,
    topShops,
    recentOrders: recentOrdersRaw,
    recentMerchants,
  });
}

/* ─── 2. Admin Users (`superadmin`, `user-admin`, etc.) CRUD ─── */
export async function listAdminUsersQuery() {
  await ensureSuperAdminSeeded();
  const admins = await AdminUserModel.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();
  return serialize(admins);
}

export async function createAdminUserQuery({
  fullName,
  email,
  phone,
  password,
  role = "user-admin",
  permissions,
  department,
  createdBy = null,
}) {
  await ensureSuperAdminSeeded();

  const cleanName = String(fullName || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanRole = ADMIN_ROLES.includes(role) ? role : "user-admin";

  if (!cleanName || !cleanEmail || !password) {
    throw new Error("Full name, email, and password are required.");
  }
  if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }
  if (String(password).length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const duplicate = await AdminUserModel.findOne({ email: cleanEmail }).lean();
  if (duplicate) {
    throw new Error("An admin account with this email already exists.");
  }

  const defaultPerms =
    cleanRole === "superadmin"
      ? [...ADMIN_MODULES]
      : cleanRole === "user-admin"
      ? [
          "overview",
          "users",
          "merchants",
          "shops",
          "orders",
          "products",
          "billing",
          "analytics",
        ]
      : ["overview", "merchants", "shops", "orders", "products"];

  const validPerms = Array.isArray(permissions) && permissions.length > 0
    ? permissions.filter((p) => ADMIN_MODULES.includes(p))
    : defaultPerms;

  const hashedPassword = await bcrypt.hash(String(password), 10);

  const created = await AdminUserModel.create({
    fullName: cleanName,
    email: cleanEmail,
    phone: String(phone || "").trim(),
    password: hashedPassword,
    role: cleanRole,
    permissions: validPerms,
    department: String(department || "Platform Operations").trim(),
    status: "active",
    createdBy: createdBy || null,
  });

  const obj = created.toObject();
  delete obj.password;
  return serialize(obj);
}

export async function updateAdminUserQuery(id, updates = {}) {
  await dbConnect();
  const admin = await AdminUserModel.findById(id);
  if (!admin) throw new Error("Admin user not found.");

  // Protect primary superadmin from accidental role downgrade or suspension
  if (admin.email === DEFAULT_SUPERADMIN_EMAIL) {
    if (updates.status === "suspended") {
      throw new Error("Primary superadmin account cannot be suspended.");
    }
    if (updates.role && updates.role !== "superadmin") {
      throw new Error("Primary superadmin role cannot be downgraded.");
    }
  }

  if (updates.fullName) admin.fullName = String(updates.fullName).trim();
  if (updates.phone !== undefined) admin.phone = String(updates.phone).trim();
  if (updates.department !== undefined) {
    admin.department = String(updates.department).trim();
  }
  if (updates.role && ADMIN_ROLES.includes(updates.role)) {
    admin.role = updates.role;
  }
  if (updates.status && ["active", "suspended"].includes(updates.status)) {
    admin.status = updates.status;
  }
  if (Array.isArray(updates.permissions)) {
    admin.permissions = updates.permissions.filter((p) =>
      ADMIN_MODULES.includes(p)
    );
  }
  if (updates.newPassword && String(updates.newPassword).length >= 6) {
    admin.password = await bcrypt.hash(String(updates.newPassword), 10);
    admin.refreshSessions = [];
  }

  await admin.save();
  const obj = admin.toObject();
  delete obj.password;
  return serialize(obj);
}

export async function deleteAdminUserQuery(targetId, actorId) {
  await dbConnect();
  if (String(targetId) === String(actorId)) {
    throw new Error("You cannot delete your own active admin account.");
  }

  const target = await AdminUserModel.findById(targetId);
  if (!target) throw new Error("Admin user not found.");

  if (target.email === DEFAULT_SUPERADMIN_EMAIL) {
    throw new Error("The primary superadmin account cannot be deleted.");
  }

  if (target.role === "superadmin") {
    const superCount = await AdminUserModel.countDocuments({
      role: "superadmin",
    });
    if (superCount <= 1) {
      throw new Error("Cannot delete the last remaining superadmin.");
    }
  }

  await AdminUserModel.findByIdAndDelete(targetId);
  return { deletedId: String(targetId) };
}

/* ─── 3. Merchants Management ─── */
export async function listAllMerchantsAdminQuery() {
  await dbConnect();

  const merchants = await UserModel.find({ role: "merchant" })
    .populate({ path: "shops", model: Shop, select: "shopId shopName shopSlug" })
    .select("-password -emailVerificationCode -resetPasswordCode")
    .sort({ createdAt: -1 })
    .lean();

  const userIds = merchants.map((m) => m._id);

  const [productCounts, orderAgg] = await Promise.all([
    ProductModel.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]),
    OrderModel.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          gmv: { $sum: { $ifNull: ["$grand_total", 0] } },
        },
      },
    ]),
  ]);

  const prodMap = Object.fromEntries(
    productCounts.map((p) => [String(p._id), p.count])
  );
  const ordMap = Object.fromEntries(
    orderAgg.map((o) => [String(o._id), o])
  );

  return serialize(
    merchants.map((m) => {
      const uid = String(m._id);
      return {
        ...m,
        productCount: prodMap[uid] || 0,
        orderCount: ordMap[uid]?.orderCount || 0,
        totalGmv: ordMap[uid]?.gmv || 0,
      };
    })
  );
}

export async function updateMerchantAdminQuery(merchantId, updates = {}) {
  await dbConnect();
  const user = await UserModel.findById(merchantId);
  if (!user) throw new Error("Merchant not found.");

  if (typeof updates.emailVerified === "boolean") {
    user.emailVerified = updates.emailVerified;
  }
  if (updates.payment_status && ["paid", "unpaid"].includes(updates.payment_status)) {
    user.payment_status = updates.payment_status;
  }
  if (updates.fullName) {
    user.fullName = String(updates.fullName).trim();
  }

  await user.save();
  const obj = user.toObject();
  delete obj.password;
  return serialize(obj);
}

export async function deleteMerchantAdminQuery(merchantId) {
  await dbConnect();
  const user = await UserModel.findById(merchantId);
  if (!user) throw new Error("Merchant not found.");
  await UserModel.findByIdAndDelete(merchantId);
  return { deletedId: String(merchantId) };
}

/* ─── 4. All Stores / Shops Directory ─── */
export async function listAllShopsAdminQuery() {
  await dbConnect();

  const shops = await Shop.find({})
    .populate({
      path: "owner",
      model: UserModel,
      select: "fullName email phone payment_status emailVerified",
    })
    .sort({ createdAt: -1 })
    .lean();

  const shopIds = shops.map((s) => s._id);

  const [infos, themes, domains, prodAgg, ordAgg] = await Promise.all([
    ShopInfoModel.find({ shopId: { $in: shopIds } })
      .select("shopId companyLogo shopAddress phone websiteTitle")
      .lean(),
    ThemeModel.find({ shopId: { $in: shopIds } })
      .select("shopId primary secondary layoutPosition productGridCols")
      .lean(),
    DomainModel.find({ shopId: { $in: shopIds } })
      .select("shopId domain_name domain_status")
      .lean(),
    ProductModel.aggregate([
      { $match: { shopId: { $in: shopIds } } },
      { $group: { _id: "$shopId", count: { $sum: 1 } } },
    ]),
    OrderModel.aggregate([
      { $match: { shopId: { $in: shopIds } } },
      {
        $group: {
          _id: "$shopId",
          orderCount: { $sum: 1 },
          gmv: { $sum: { $ifNull: ["$grand_total", 0] } },
        },
      },
    ]),
  ]);

  const infoMap = Object.fromEntries(infos.map((i) => [String(i.shopId), i]));
  const themeMap = Object.fromEntries(themes.map((t) => [String(t.shopId), t]));
  const domMap = Object.fromEntries(domains.map((d) => [String(d.shopId), d]));
  const prodMap = Object.fromEntries(prodAgg.map((p) => [String(p._id), p.count]));
  const ordMap = Object.fromEntries(ordAgg.map((o) => [String(o._id), o]));

  return serialize(
    shops.map((s) => {
      const sid = String(s._id);
      return {
        ...s,
        shopInfo: infoMap[sid] || null,
        theme: themeMap[sid] || null,
        domain: domMap[sid] || null,
        productCount: prodMap[sid] || 0,
        orderCount: ordMap[sid]?.orderCount || 0,
        gmv: ordMap[sid]?.gmv || 0,
      };
    })
  );
}

/* ─── 5. Global Orders Monitor ─── */
export async function listAllOrdersAdminQuery() {
  await dbConnect();
  const orders = await OrderModel.find({})
    .populate({
      path: "customer",
      model: CustomerModel,
      select: "customerName customerPhone customerAddress",
    })
    .populate({
      path: "shopId",
      model: Shop,
      select: "shopName shopSlug shopId",
    })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return serialize(orders);
}

export async function updateOrderAdminQuery(orderId, status) {
  await dbConnect();
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    throw new Error("Invalid order status.");
  }
  const updated = await OrderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  )
    .populate({
      path: "customer",
      model: CustomerModel,
      select: "customerName customerPhone customerAddress",
    })
    .populate({
      path: "shopId",
      model: Shop,
      select: "shopName shopSlug shopId",
    })
    .lean();

  if (!updated) throw new Error("Order not found.");
  return serialize(updated);
}

/* ─── 6. Global Products Moderation ─── */
export async function listAllProductsAdminQuery() {
  await dbConnect();
  const products = await ProductModel.find({})
    .populate({ path: "shopId", model: Shop, select: "shopName shopSlug shopId" })
    .populate({ path: "categoryId", model: Category, select: "name" })
    .select(
      "productName productCode regularPrice discountType discountValue discountedPrice availableQuantity mainImage isActive isFeatured shopId categoryId createdAt"
    )
    .sort({ createdAt: -1 })
    .limit(250)
    .lean();

  return serialize(products);
}

export async function updateProductAdminQuery(productId, updates = {}) {
  await dbConnect();
  const patch = {};
  if (typeof updates.isActive === "boolean") patch.isActive = updates.isActive;
  if (typeof updates.isFeatured === "boolean") {
    patch.isFeatured = updates.isFeatured;
  }
  const updated = await ProductModel.findByIdAndUpdate(productId, patch, {
    new: true,
  }).lean();
  if (!updated) throw new Error("Product not found.");
  return serialize(updated);
}

export async function deleteProductAdminQuery(productId) {
  await dbConnect();
  await ProductModel.findByIdAndDelete(productId);
  return { deletedId: String(productId) };
}

/* ─── 7. SaaS Billing & Invoices ─── */
export async function listAllBillingAdminQuery() {
  await dbConnect();
  const [invoices, shops] = await Promise.all([
    BillingModel.find({})
      .populate({
        path: "userId",
        model: UserModel,
        select: "fullName email phone payment_status",
      })
      .populate({
        path: "shopId",
        model: Shop,
        select: "shopName shopSlug shopId",
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
    Shop.find({})
      .populate({ path: "owner", model: UserModel, select: "fullName email" })
      .select("shopName shopSlug shopId owner")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return serialize({ invoices, shops });
}

export async function createBillingInvoiceAdminQuery({
  shopId,
  planName = "Pro Merchant",
  amount = 499,
  invoiceTitle = "Monthly Platform Subscription",
  dueDays = 7,
  notes = "",
}) {
  await dbConnect();
  const shop = await Shop.findById(shopId).lean();
  if (!shop) throw new Error("Target shop not found.");

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + Math.max(1, Number(dueDays) || 7));

  const invoiceNumber = `BILL-${Date.now().toString().slice(-6)}-${Math.floor(
    10 + Math.random() * 89
  )}`;
  const numericAmount = Math.max(0, Number(amount) || 0);

  const created = await BillingModel.create({
    userId: shop.owner,
    shopId: shop._id,
    invoiceNumber,
    invoiceTitle: String(invoiceTitle || "Monthly Platform Subscription").trim(),
    billingPeriodStart: now,
    billingPeriodEnd: periodEnd,
    dueDate,
    amount: numericAmount,
    totalDue: numericAmount,
    planName: String(planName || "Pro Merchant").trim(),
    planPrice: numericAmount,
    status: "unpaid",
    notes: String(notes || "").trim(),
  });

  await UserModel.findByIdAndUpdate(shop.owner, {
    payment_status: "unpaid",
    next_payment_date: dueDate,
  });

  return serialize(created);
}

export async function updateBillingStatusAdminQuery(invoiceId, status) {
  await dbConnect();
  const allowed = ["paid", "unpaid", "overdue", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Invalid invoice status.");

  const patch = { status };
  if (status === "paid") {
    patch.paidAt = new Date();
    patch.paymentMethod = "Admin Verified";
  }

  const updated = await BillingModel.findByIdAndUpdate(invoiceId, patch, {
    new: true,
  }).lean();
  if (!updated) throw new Error("Invoice not found.");

  if (status === "paid") {
    await UserModel.findByIdAndUpdate(updated.userId, {
      payment_status: "paid",
    });
  } else if (status === "overdue" || status === "unpaid") {
    await UserModel.findByIdAndUpdate(updated.userId, {
      payment_status: "unpaid",
    });
  }

  return serialize(updated);
}

/* ─── 8. Platform Analytics ─── */
export async function getAdminAnalyticsQuery() {
  await dbConnect();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [dailySeries, byLocation, byOrderType, totalCategories, totalCustomers] =
    await Promise.all([
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            orders: { $sum: 1 },
            gmv: { $sum: { $ifNull: ["$grand_total", 0] } },
            shipping: { $sum: { $ifNull: ["$shipping_cost", 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      OrderModel.aggregate([
        {
          $group: {
            _id: "$deliveryLocation",
            count: { $sum: 1 },
            gmv: { $sum: { $ifNull: ["$grand_total", 0] } },
          },
        },
      ]),
      OrderModel.aggregate([
        {
          $group: {
            _id: "$orderType",
            count: { $sum: 1 },
          },
        },
      ]),
      Category.countDocuments({}),
      CustomerModel.countDocuments({}),
    ]);

  const mapByDay = Object.fromEntries(dailySeries.map((d) => [d._id, d]));
  const timeline = [];
  for (let i = 13; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    timeline.push({
      date: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      orders: mapByDay[key]?.orders || 0,
      gmv: mapByDay[key]?.gmv || 0,
      shipping: mapByDay[key]?.shipping || 0,
    });
  }

  return serialize({
    timeline,
    byLocation,
    byOrderType,
    totalCategories,
    totalCustomers,
  });
}

/* ─── 9. Global Platform Settings, Diagnostics & Profile/Password ─── */
export async function getPlatformSettingsQuery() {
  await dbConnect();
  let doc = await PlatformSettingModel.findOne({
    singletonKey: "global",
  }).lean();

  if (!doc) {
    const created = await PlatformSettingModel.create({
      singletonKey: "global",
    });
    doc = created.toObject();
  }

  const [
    adminsCount,
    merchantsCount,
    shopsCount,
    productsCount,
    ordersCount,
    billingsCount,
    domainsCount,
  ] = await Promise.all([
    AdminUserModel.countDocuments({}),
    UserModel.countDocuments({ role: "merchant" }),
    Shop.countDocuments({}),
    ProductModel.countDocuments({}),
    OrderModel.countDocuments({}),
    BillingModel.countDocuments({}),
    DomainModel.countDocuments({}),
  ]);

  return serialize({
    ...doc,
    diagnostics: {
      adminsCount,
      merchantsCount,
      shopsCount,
      productsCount,
      ordersCount,
      billingsCount,
      domainsCount,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
    },
  });
}

export async function updatePlatformSettingsQuery(data = {}, adminId = null) {
  await dbConnect();

  const stringFields = [
    "platformName",
    "platformTagline",
    "companyAddress",
    "supportEmail",
    "supportPhone",
    "whatsappSupport",
    "logoUrl",
    "faviconUrl",
    "currency",
    "timezone",
    "announcementBanner",
    "bkashMerchantNumber",
    "bkashAccountType",
    "nagadMerchantNumber",
    "rocketMerchantNumber",
    "bankName",
    "bankAccountName",
    "bankAccountNumber",
    "bankBranch",
    "sslStoreId",
    "primaryDnsIp",
    "primaryCnameTarget",
  ];

  const numberFields = [
    "basicPlanPrice",
    "standardPlanPrice",
    "professionalPlanPrice",
    "monthlyPlanFee",
    "vatPercent",
    "trialDays",
    "billingCycleDays",
    "gracePeriodDays",
  ];

  const booleanFields = [
    "bkashEnabled",
    "nagadEnabled",
    "rocketEnabled",
    "bankTransferEnabled",
    "sslcommerzEnabled",
    "allowRegistrations",
    "requireEmailVerification",
    "maintenanceMode",
    "enableOrderEmailAlerts",
    "enableBillingReminders",
    "customDomainSupport",
  ];

  const patch = { updatedBy: adminId || null };

  for (const key of stringFields) {
    if (data[key] !== undefined) {
      patch[key] = String(data[key]).trim();
    }
  }
  for (const key of numberFields) {
    if (data[key] !== undefined) {
      patch[key] = Math.max(0, Number(data[key]) || 0);
    }
  }
  for (const key of booleanFields) {
    if (typeof data[key] === "boolean") {
      patch[key] = data[key];
    }
  }

  const updated = await PlatformSettingModel.findOneAndUpdate(
    { singletonKey: "global" },
    { $set: patch },
    { new: true, upsert: true }
  ).lean();

  return serialize(updated);
}

export async function updateOwnAdminProfileQuery(adminId, data = {}) {
  await dbConnect();
  const admin = await AdminUserModel.findById(adminId);
  if (!admin) throw new Error("Admin account not found.");

  if (data.fullName && String(data.fullName).trim()) {
    admin.fullName = String(data.fullName).trim();
  }
  if (data.phone !== undefined) {
    admin.phone = String(data.phone).trim();
  }
  if (data.department !== undefined) {
    admin.department = String(data.department).trim();
  }

  await admin.save();
  return serialize({
    id: String(admin._id),
    fullName: admin.fullName,
    email: admin.email,
    phone: admin.phone || "",
    role: admin.role,
    permissions: admin.permissions || [],
    department: admin.department || "Platform Operations",
    isAdmin: true,
  });
}

export async function changeAdminPasswordQuery({
  adminId,
  currentPassword,
  newPassword,
}) {
  await dbConnect();
  if (!currentPassword || !newPassword || String(newPassword).length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  const admin = await AdminUserModel.findById(adminId);
  if (!admin) throw new Error("Admin account not found.");

  const valid = await bcrypt.compare(String(currentPassword), admin.password);
  if (!valid) throw new Error("Current password is incorrect.");

  admin.password = await bcrypt.hash(String(newPassword), 10);
  admin.refreshSessions = [];
  await admin.save();

  return { success: true };
}

/* ─── 10. Platform Payment List & Transaction Ledger (`/admin/payment-list`) ─── */
export async function getAdminPaymentListQuery() {
  await dbConnect();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [saasPayments, orderPayments, deposits, shops] = await Promise.all([
    BillingModel.find({})
      .populate({
        path: "userId",
        model: UserModel,
        select: "fullName email phone payment_status next_payment_date",
      })
      .populate({
        path: "shopId",
        model: Shop,
        select: "shopName shopSlug shopId",
      })
      .sort({ paidAt: -1, createdAt: -1 })
      .limit(300)
      .lean(),
    OrderModel.find({})
      .populate({
        path: "customer",
        model: CustomerModel,
        select: "customerName customerPhone",
      })
      .populate({
        path: "shopId",
        model: Shop,
        select: "shopName shopSlug shopId",
      })
      .select(
        "customer shopId status deliveryLocation orderType shipping_cost grand_total advanced due createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
    DepositeModel.find({}).sort({ createdAt: -1 }).limit(100).lean().catch(() => []),
    Shop.find({})
      .populate({
        path: "owner",
        model: UserModel,
        select: "fullName email phone payment_status next_payment_date",
      })
      .select("shopName shopSlug shopId owner createdAt")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  let totalCollectedSaaS = 0;
  let thisMonthCollectedSaaS = 0;
  let pendingReceivables = 0;
  let overdueAmount = 0;
  let overdueCount = 0;
  let paidTransactionsCount = 0;
  const methodMap = {};

  for (const p of saasPayments) {
    const dueVal = Number(p.totalDue ?? p.amount ?? 0);
    if (p.status === "paid") {
      totalCollectedSaaS += dueVal;
      paidTransactionsCount += 1;
      const paidDate = p.paidAt ? new Date(p.paidAt) : new Date(p.updatedAt || p.createdAt);
      if (paidDate >= monthStart) {
        thisMonthCollectedSaaS += dueVal;
      }
      const mKey = String(p.paymentMethod || "Manual").trim() || "Manual";
      methodMap[mKey] = (methodMap[mKey] || 0) + dueVal;
    } else if (p.status === "unpaid") {
      pendingReceivables += dueVal;
    } else if (p.status === "overdue") {
      pendingReceivables += dueVal;
      overdueAmount += dueVal;
      overdueCount += 1;
    }
  }

  let storefrontDeliveredCash = 0;
  let storefrontPendingCod = 0;
  for (const ord of orderPayments) {
    const gt = Number(ord.grand_total || 0);
    if (ord.status === "delivered") {
      storefrontDeliveredCash += gt;
    } else if (ord.status !== "cancelled") {
      storefrontPendingCod += gt;
    }
  }

  const methodBreakdown = Object.entries(methodMap)
    .map(([method, total]) => ({ method, total }))
    .sort((a, b) => b.total - a.total);

  return serialize({
    kpis: {
      totalCollectedSaaS,
      thisMonthCollectedSaaS,
      pendingReceivables,
      overdueAmount,
      overdueCount,
      paidTransactionsCount,
      totalInvoicesCount: saasPayments.length,
      storefrontDeliveredCash,
      storefrontPendingCod,
    },
    methodBreakdown,
    saasPayments,
    orderPayments,
    deposits,
    shops,
    plans: PLANS,
  });
}

export async function recordAdminPaymentQuery({
  billingId,
  shopId,
  planName = "Basic",
  amount,
  includeVat = false,
  paymentMethod = "bKash",
  transactionId = "",
  status = "paid",
  notes = "",
}) {
  await dbConnect();

  const cleanMethod = String(paymentMethod || "Manual").trim();
  const cleanTrx = String(transactionId || "").trim();
  const cleanNotes = String(notes || "").trim();
  const validStatus = ["paid", "unpaid", "overdue", "cancelled"].includes(status)
    ? status
    : "paid";

  // Case A: Verify / settle an existing billing invoice
  if (billingId) {
    const existing = await BillingModel.findById(billingId);
    if (!existing) throw new Error("Billing invoice not found.");

    existing.status = validStatus;
    existing.paymentMethod = cleanMethod;
    existing.transactionId = cleanTrx;
    if (cleanNotes) existing.notes = cleanNotes;
    if (validStatus === "paid") {
      existing.paidAt = new Date();
    }

    await existing.save();

    if (validStatus === "paid") {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + BILLING_CYCLE_DAYS);
      await UserModel.findByIdAndUpdate(existing.userId, {
        payment_status: "paid",
        next_payment_date: nextDate,
      });
    } else if (validStatus === "unpaid" || validStatus === "overdue") {
      await UserModel.findByIdAndUpdate(existing.userId, {
        payment_status: "unpaid",
      });
    }

    return serialize(existing);
  }

  // Case B: Create and record a new payment/invoice for a shop
  if (!shopId) throw new Error("Please select a merchant store.");
  const shop = await Shop.findById(shopId).lean();
  if (!shop) throw new Error("Selected merchant store was not found.");

  const selectedPlan = PLANS[planName] || PLANS.Basic;
  const baseAmount =
    amount !== undefined && amount !== "" && Number(amount) >= 0
      ? Number(amount)
      : selectedPlan.price;
  const tax = includeVat ? Math.round(baseAmount * (VAT_PERCENT / 100)) : 0;
  const totalDue = baseAmount + tax;

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + BILLING_CYCLE_DAYS);
  const dueDate = new Date(periodEnd);
  dueDate.setDate(dueDate.getDate() + GRACE_PERIOD_DAYS);

  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const invoiceNumber = `PAY-${ym}-${Math.floor(10000 + Math.random() * 90000)}`;

  const created = await BillingModel.create({
    userId: shop.owner,
    shopId: shop._id,
    invoiceNumber,
    invoiceTitle: `${planName} Plan — Platform Subscription`,
    billingPeriodStart: now,
    billingPeriodEnd: periodEnd,
    dueDate,
    amount: baseAmount,
    tax,
    totalDue,
    planName,
    planPrice: baseAmount,
    status: validStatus,
    paidAt: validStatus === "paid" ? now : null,
    paymentMethod: validStatus === "paid" ? cleanMethod : "",
    transactionId: cleanTrx,
    notes: cleanNotes,
  });

  if (validStatus === "paid") {
    await UserModel.findByIdAndUpdate(shop.owner, {
      payment_status: "paid",
      next_payment_date: periodEnd,
    });
  } else {
    await UserModel.findByIdAndUpdate(shop.owner, {
      payment_status: "unpaid",
      next_payment_date: dueDate,
    });
  }

  return serialize(created);
}

export async function deleteAdminPaymentRecordQuery(billingId) {
  await dbConnect();
  const doc = await BillingModel.findById(billingId);
  if (!doc) throw new Error("Payment record not found.");
  await BillingModel.findByIdAndDelete(billingId);
  return { deletedId: String(billingId) };
}

/* ─── 11. Custom Domain Management (`/admin/domain`) ─── */
export async function getAdminDomainsQuery() {
  await dbConnect();

  const [domains, shops, settings] = await Promise.all([
    DomainModel.find({})
      .populate({
        path: "shopId",
        model: Shop,
        select: "shopName shopSlug shopId",
      })
      .populate({
        path: "userId",
        model: UserModel,
        select: "fullName email phone",
      })
      .sort({ createdAt: -1 })
      .lean(),
    Shop.find({})
      .populate({
        path: "owner",
        model: UserModel,
        select: "fullName email",
      })
      .select("shopName shopSlug shopId owner")
      .sort({ createdAt: -1 })
      .lean(),
    PlatformSettingModel.findOne({ singletonKey: "global" })
      .select("primaryDnsIp primaryCnameTarget customDomainSupport")
      .lean(),
  ]);

  const counts = {
    total: domains.length,
    connected: domains.filter((d) => d.domain_status === "connected").length,
    pending: domains.filter((d) => d.domain_status === "pending").length,
    issues: domains.filter((d) =>
      ["failed", "rejected", "disconnected"].includes(d.domain_status)
    ).length,
  };

  return serialize({
    counts,
    domains,
    shops,
    dnsConfig: {
      primaryDnsIp: settings?.primaryDnsIp || "76.76.21.21",
      primaryCnameTarget:
        settings?.primaryCnameTarget || "cname.amardokan.com",
      customDomainSupport: settings?.customDomainSupport !== false,
    },
  });
}

function cleanHostname(raw = "") {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

export async function upsertAdminDomainQuery({
  domainId,
  shopId,
  domain_name,
  domain_status = "pending",
}) {
  await dbConnect();

  const allowedStatuses = [
    "pending",
    "connected",
    "failed",
    "disconnected",
    "rejected",
  ];
  const nextStatus = allowedStatuses.includes(domain_status)
    ? domain_status
    : "pending";

  if (domainId) {
    const existing = await DomainModel.findById(domainId);
    if (!existing) throw new Error("Domain record not found.");

    if (domain_name !== undefined) {
      const host = cleanHostname(domain_name);
      if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) {
        throw new Error("Please enter a valid domain name (e.g. shop.com).");
      }
      existing.domain_name = host;
    }

    existing.domain_status = nextStatus;
    await existing.save();

    const populated = await DomainModel.findById(existing._id)
      .populate({ path: "shopId", model: Shop, select: "shopName shopSlug shopId" })
      .populate({ path: "userId", model: UserModel, select: "fullName email phone" })
      .lean();
    return serialize(populated);
  }

  // Create new custom domain assignment
  if (!shopId) throw new Error("Please select a merchant store.");
  const host = cleanHostname(domain_name);
  if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) {
    throw new Error("Please provide a valid domain hostname (e.g. mystore.com).");
  }

  const shop = await Shop.findById(shopId).lean();
  if (!shop) throw new Error("Selected store was not found.");

  const duplicate = await DomainModel.findOne({ domain_name: host }).lean();
  if (duplicate) {
    throw new Error(`Domain "${host}" is already registered on the platform.`);
  }

  const created = await DomainModel.findOneAndUpdate(
    { shopId: shop._id },
    {
      $set: {
        domain_name: host,
        domain_status: nextStatus,
        shopId: shop._id,
        userId: shop.owner,
      },
    },
    { new: true, upsert: true }
  )
    .populate({ path: "shopId", model: Shop, select: "shopName shopSlug shopId" })
    .populate({ path: "userId", model: UserModel, select: "fullName email phone" })
    .lean();

  return serialize(created);
}

export async function verifyAdminDomainDnsQuery(domainId) {
  await dbConnect();
  const doc = await DomainModel.findById(domainId).lean();
  if (!doc) throw new Error("Domain record not found.");

  const settings = await PlatformSettingModel.findOne({
    singletonKey: "global",
  }).lean();
  const expectedIp = settings?.primaryDnsIp || "76.76.21.21";
  const expectedCname = (
    settings?.primaryCnameTarget || "cname.amardokan.com"
  ).toLowerCase();

  const host = cleanHostname(doc.domain_name);
  let aRecords = [];
  let cnameRecords = [];

  try {
    aRecords = await dns.resolve4(host);
  } catch {
    // ignore NXDOMAIN / offline
  }

  try {
    cnameRecords = await dns.resolveCname(host);
  } catch {
    // ignore
  }

  const matchesTarget =
    aRecords.includes(expectedIp) ||
    cnameRecords.some((c) => c.toLowerCase().includes(expectedCname));
  const resolvesAnywhere = aRecords.length > 0 || cnameRecords.length > 0;

  return serialize({
    domainId: String(doc._id),
    domainName: host,
    aRecords,
    cnameRecords,
    expectedIp,
    expectedCname,
    matchesTarget,
    resolvesAnywhere,
  });
}

export async function deleteAdminDomainQuery(domainId) {
  await dbConnect();
  const doc = await DomainModel.findById(domainId);
  if (!doc) throw new Error("Domain record not found.");
  await DomainModel.findByIdAndDelete(domainId);
  return { deletedId: String(domainId) };
}

/* ─── 12. Role Matrix & Permissions Management (`/admin/role`) ─── */
const DEFAULT_ROLE_TEMPLATES = {
  superadmin: [...ADMIN_MODULES],
  "user-admin": ADMIN_MODULES.filter((m) => m !== "settings"),
  moderator: [
    "overview",
    "dashboard",
    "merchants",
    "shops",
    "domain",
    "orders",
    "products",
    "visitor",
  ],
  support: ["overview", "dashboard", "merchants", "orders", "visitor"],
};

export async function getAdminRoleMatrixQuery() {
  await ensureSuperAdminSeeded();

  const [admins, settingsDoc] = await Promise.all([
    AdminUserModel.find({}).select("-password").sort({ createdAt: -1 }).lean(),
    PlatformSettingModel.findOne({ singletonKey: "global" })
      .select("roleTemplates")
      .lean(),
  ]);

  const savedTemplates = settingsDoc?.roleTemplates || {};
  const roleTemplates = {
    superadmin: [...ADMIN_MODULES],
    "user-admin": Array.isArray(savedTemplates["user-admin"])
      ? savedTemplates["user-admin"]
      : DEFAULT_ROLE_TEMPLATES["user-admin"],
    moderator: Array.isArray(savedTemplates.moderator)
      ? savedTemplates.moderator
      : DEFAULT_ROLE_TEMPLATES.moderator,
    support: Array.isArray(savedTemplates.support)
      ? savedTemplates.support
      : DEFAULT_ROLE_TEMPLATES.support,
  };

  const roleCounts = {
    superadmin: admins.filter((a) => a.role === "superadmin").length,
    "user-admin": admins.filter((a) => a.role === "user-admin").length,
    moderator: admins.filter((a) => a.role === "moderator").length,
    support: admins.filter((a) => a.role === "support").length,
  };

  return serialize({
    modules: ADMIN_MODULES,
    roles: ADMIN_ROLES,
    roleTemplates,
    roleCounts,
    admins,
  });
}

export async function updateAdminRoleMatrixQuery(
  { roleTemplates, syncExistingUsers = false },
  actorId = null
) {
  await dbConnect();
  if (!roleTemplates || typeof roleTemplates !== "object") {
    throw new Error("Valid roleTemplates payload is required.");
  }

  const sanitized = {
    superadmin: [...ADMIN_MODULES],
    "user-admin": (roleTemplates["user-admin"] || []).filter((m) =>
      ADMIN_MODULES.includes(m)
    ),
    moderator: (roleTemplates.moderator || []).filter((m) =>
      ADMIN_MODULES.includes(m)
    ),
    support: (roleTemplates.support || []).filter((m) =>
      ADMIN_MODULES.includes(m)
    ),
  };

  await PlatformSettingModel.findOneAndUpdate(
    { singletonKey: "global" },
    {
      $set: {
        roleTemplates: sanitized,
        updatedBy: actorId || null,
      },
    },
    { upsert: true, new: true }
  );

  let syncedCount = 0;
  if (syncExistingUsers) {
    for (const roleKey of ["user-admin", "moderator", "support"]) {
      const res = await AdminUserModel.updateMany(
        { role: roleKey },
        { $set: { permissions: sanitized[roleKey] } }
      );
      syncedCount += res.modifiedCount || 0;
    }
  }

  return serialize({
    roleTemplates: sanitized,
    syncedCount,
  });
}

/* ─── 13. Platform & Storefront Visitor Analytics (`/admin/visitor`) ─── */
export async function getAdminVisitorAnalyticsQuery() {
  await dbConnect();

  const now = new Date();
  const bdNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  const todayStr = bdNow.toISOString().slice(0, 10);

  const [dailyDocs, todayHourlyDoc, shopVisitDocs, shops, orderAgg] =
    await Promise.all([
      visitorCountModel.find({}).sort({ date: -1 }).limit(30).lean(),
      VisitorCountDayModel.findOne({ date: todayStr }).lean(),
      shopVisitorModel.find({}).sort({ date: -1 }).limit(500).lean(),
      Shop.find({})
        .populate({ path: "owner", model: UserModel, select: "fullName email" })
        .select("shopName shopSlug shopId owner")
        .lean(),
      OrderModel.aggregate([
        {
          $group: {
            _id: "$shopId",
            orderCount: { $sum: 1 },
            gmv: { $sum: { $ifNull: ["$grand_total", 0] } },
          },
        },
      ]),
    ]);

  // Aggregate daily counts across both `visitorCountModel` and `shopVisitorModel`
  const dayCounter = {};
  for (const d of dailyDocs) {
    if (d?.date) {
      dayCounter[d.date] = Math.max(
        dayCounter[d.date] || 0,
        Number(d.dailyCount || 0)
      );
    }
  }

  const shopTotalsMap = {};
  const shopTodayMap = {};
  const hourlyBuckets = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    visitors: Number(
      todayHourlyDoc?.hourlyCounts?.find((hc) => hc.hour === h)?.count || 0
    ),
  }));

  const shopSumByDate = {};
  for (const sv of shopVisitDocs) {
    const sid = String(sv.shopId || "");
    const c = Number(sv.totalCount || 0);
    if (sid) {
      shopTotalsMap[sid] = (shopTotalsMap[sid] || 0) + c;
      if (sv.date === todayStr) {
        shopTodayMap[sid] = (shopTodayMap[sid] || 0) + c;
      }
    }
    if (sv.date) {
      shopSumByDate[sv.date] = (shopSumByDate[sv.date] || 0) + c;
    }
    if (sv.date === todayStr && Array.isArray(sv.hourlyCounts)) {
      for (const hc of sv.hourlyCounts) {
        const hr = Number(hc?.hour);
        if (hr >= 0 && hr < 24) {
          hourlyBuckets[hr].visitors = Math.max(
            hourlyBuckets[hr].visitors,
            Number(hc.count || 0)
          );
        }
      }
    }
  }

  for (const [dt, sum] of Object.entries(shopSumByDate)) {
    dayCounter[dt] = Math.max(dayCounter[dt] || 0, sum);
  }

  // Build 14-day timeline
  const dailyTimeline = [];
  let last7DaysVisitors = 0;
  for (let i = 13; i >= 0; i--) {
    const d = new Date(bdNow);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const val = dayCounter[key] || 0;
    if (i < 7) last7DaysVisitors += val;
    dailyTimeline.push({
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      rawDate: key,
      visitors: val,
    });
  }

  const todayVisitors = dayCounter[todayStr] || 0;
  const maxRecordedTotal = dailyDocs.reduce(
    (mx, d) => Math.max(mx, Number(d.totalCount || 0)),
    0
  );
  const sumShopVisits = Object.values(shopTotalsMap).reduce(
    (a, b) => a + b,
    0
  );
  const sumDaily = Object.values(dayCounter).reduce((a, b) => a + b, 0);
  const allTimeVisitors = Math.max(maxRecordedTotal, sumShopVisits, sumDaily);

  const ordMap = Object.fromEntries(
    orderAgg.map((o) => [String(o._id), o])
  );
  const totalOrders = orderAgg.reduce((s, o) => s + (o.orderCount || 0), 0);

  const shopLeaderboard = shops
    .map((s) => {
      const sid = String(s._id);
      const visits =
        shopTotalsMap[sid] || shopTotalsMap[String(s.shopId)] || 0;
      const todayVisits =
        shopTodayMap[sid] || shopTodayMap[String(s.shopId)] || 0;
      const orders = ordMap[sid]?.orderCount || 0;
      const gmv = ordMap[sid]?.gmv || 0;
      const conversion =
        visits > 0 ? Number(((orders / visits) * 100).toFixed(1)) : 0;

      return {
        _id: sid,
        shopId: s.shopId,
        shopName: s.shopName,
        shopSlug: s.shopSlug || s.shopId,
        ownerName: s.owner?.fullName || "—",
        ownerEmail: s.owner?.email || "",
        todayVisits,
        totalVisits: visits,
        orders,
        gmv,
        conversion,
      };
    })
    .sort((a, b) => b.totalVisits - a.totalVisits || b.orders - a.orders);

  const activeVisitedShops = shopLeaderboard.filter(
    (s) => s.totalVisits > 0
  ).length;
  const platformConversion =
    allTimeVisitors > 0
      ? Number(((totalOrders / allTimeVisitors) * 100).toFixed(1))
      : 0;

  return serialize({
    kpis: {
      todayVisitors,
      last7DaysVisitors,
      allTimeVisitors,
      activeVisitedShops,
      totalShops: shops.length,
      totalOrders,
      platformConversion,
    },
    dailyTimeline,
    hourlyBuckets,
    shopLeaderboard,
  });
}
