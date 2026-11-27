import mongoose from "mongoose";
import { BillingModel } from "@/model/billing-model";
import { UserModel } from "@/model/user-model";
import { ProductModel } from "@/model/product-model";
import { OrderModel } from "@/model/order-model";
import { PlatformSettingModel } from "@/model/admin-user-model";
import { dbConnect } from "@/service/mongo";
import {
  BILLING_CYCLE_DAYS,
  GRACE_PERIOD_DAYS,
  PLANS,
  VAT_PERCENT,
} from "@/config/billingConfig";

export { PLANS };

export const PLAN_LIMITS = {
  Basic: {
    maxProducts: 100,
    maxMonthlyOrders: 300,
    customDomain: false,
    courierIntegration: true,
    teamSeats: 1,
    badge: "Starter",
    description: "Essential tools for new merchants launching their online shop",
    features: [
      "Up to 100 active products",
      "Up to 300 monthly orders",
      "Custom storefront theme & layout",
      "Cash on Delivery & PDF invoices",
      "Standard email support",
    ],
  },
  Standard: {
    maxProducts: 500,
    maxMonthlyOrders: 2000,
    customDomain: true,
    courierIntegration: true,
    teamSeats: 5,
    popular: true,
    badge: "Most Popular",
    description: "Built for growing Bangladeshi e-commerce stores",
    features: [
      "Up to 500 active products",
      "Up to 2,000 monthly orders",
      "Custom domain connection",
      "Courier integrations (Steadfast, Pathao, RedX)",
      "Advanced sales & cohort analytics",
      "5 team member accounts",
    ],
  },
  Professional: {
    maxProducts: 999999,
    maxMonthlyOrders: 999999,
    customDomain: true,
    courierIntegration: true,
    teamSeats: 25,
    badge: "Unlimited",
    description: "Full-scale automation & unlimited catalog capacity",
    features: [
      "Unlimited active products",
      "Unlimited monthly orders",
      "Priority custom domain & SSL",
      "All courier & marketing pixel integrations",
      "25 team member accounts",
      "24/7 priority merchant support",
    ],
  },
};

function genInvoiceNumber(userId, prefix = "INV") {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const rand = String(userId || "0000")
    .slice(-4)
    .toUpperCase();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${ym}-${rand}${seq}`;
}

async function resolveDynamicPlatformPricing() {
  const settings = await PlatformSettingModel.findOne({
    singletonKey: "global",
  }).lean();

  const vatPercent =
    settings?.vatPercent !== undefined ? Number(settings.vatPercent) : VAT_PERCENT;
  const cycleDays =
    settings?.billingCycleDays !== undefined
      ? Number(settings.billingCycleDays)
      : BILLING_CYCLE_DAYS;
  const graceDays =
    settings?.gracePeriodDays !== undefined
      ? Number(settings.gracePeriodDays)
      : GRACE_PERIOD_DAYS;
  const trialDays =
    settings?.trialDays !== undefined ? Number(settings.trialDays) : 14;

  const prices = {
    Basic:
      settings?.basicPlanPrice !== undefined
        ? Number(settings.basicPlanPrice)
        : PLANS.Basic.price,
    Standard:
      settings?.standardPlanPrice !== undefined
        ? Number(settings.standardPlanPrice)
        : PLANS.Standard.price,
    Professional:
      settings?.professionalPlanPrice !== undefined
        ? Number(settings.professionalPlanPrice)
        : PLANS.Professional.price,
  };

  const gateways = {
    bkash: {
      enabled: settings?.bkashEnabled !== false,
      number: settings?.bkashMerchantNumber || "01700000000",
      accountType: settings?.bkashAccountType || "Merchant",
    },
    nagad: {
      enabled: settings?.nagadEnabled !== false,
      number: settings?.nagadMerchantNumber || "01700000000",
    },
    rocket: {
      enabled: Boolean(settings?.rocketEnabled),
      number: settings?.rocketMerchantNumber || "",
    },
    bank_transfer: {
      enabled: settings?.bankTransferEnabled !== false,
      bankName: settings?.bankName || "City Bank PLC",
      accountName: settings?.bankAccountName || "AMARDokan Technologies",
      accountNumber: settings?.bankAccountNumber || "",
      branch: settings?.bankBranch || "Gulshan Branch, Dhaka",
    },
  };

  return {
    prices,
    vatPercent,
    cycleDays,
    graceDays,
    trialDays,
    gateways,
  };
}

// ── Create one monthly bill for a shop ─────────────────────────────────────────
export async function createBillingForShop({
  userId,
  shopId,
  planName = "Basic",
}) {
  await dbConnect();
  const { prices, vatPercent, cycleDays, graceDays } =
    await resolveDynamicPlatformPricing();

  const validPlan = PLAN_LIMITS[planName] ? planName : "Basic";
  const basePrice = prices[validPlan] ?? PLANS.Basic.price;

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + cycleDays);
  const dueDate = new Date(periodEnd);
  dueDate.setDate(dueDate.getDate() + graceDays);

  const tax = Math.round(basePrice * (vatPercent / 100));
  const totalDue = basePrice + tax;

  const billing = await BillingModel.create({
    userId,
    shopId,
    invoiceNumber: genInvoiceNumber(userId, "INV"),
    invoiceTitle: `${validPlan} Plan — Monthly Subscription`,
    billingPeriodStart: now,
    billingPeriodEnd: periodEnd,
    dueDate,
    amount: basePrice,
    tax,
    totalDue,
    planName: validPlan,
    planPrice: basePrice,
    status: "unpaid",
  });

  return JSON.parse(JSON.stringify(billing));
}

// ── Auto-generate monthly bills for ALL shops that are due ────────────────────
export async function generateMonthlyBillings() {
  await dbConnect();
  const now = new Date();
  const { cycleDays } = await resolveDynamicPlatformPricing();

  const users = await UserModel.find({
    role: "merchant",
    auto_renew: { $ne: false },
    subscription_status: { $ne: "cancelled" },
    $or: [{ next_payment_date: null }, { next_payment_date: { $lte: now } }],
  })
    .populate("shops")
    .lean();

  const created = [];
  const errors = [];

  for (const user of users) {
    const activePlan = user.subscription_plan || "Basic";
    for (const shop of user.shops || []) {
      try {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const existing = await BillingModel.findOne({
          userId: user._id,
          shopId: shop._id,
          billingPeriodStart: { $gte: monthStart },
        });
        if (existing) continue;

        const bill = await createBillingForShop({
          userId: user._id,
          shopId: shop._id,
          planName: activePlan,
        });
        created.push(bill);

        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + cycleDays);
        await UserModel.findByIdAndUpdate(user._id, {
          next_payment_date: nextDate,
          payment_status: "unpaid",
          subscription_status: "past_due",
        });
      } catch (err) {
        errors.push({ userId: String(user._id), error: err.message });
      }
    }
  }

  return { created: created.length, errors };
}

// ── Get all billings for a shop ────────────────────────────────────────────────
export async function getBillingsForShop({ userId, shopId }) {
  await dbConnect();
  if (!userId || !shopId) return [];
  const bills = await BillingModel.find({ userId, shopId })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(bills));
}

// ── Mark a bill paid & extend monthly subscription ────────────────────────────
export async function markBillingPaid({
  billingId,
  paymentMethod,
  transactionId,
}) {
  await dbConnect();
  const { cycleDays } = await resolveDynamicPlatformPricing();

  const updated = await BillingModel.findByIdAndUpdate(
    billingId,
    {
      status: "paid",
      paidAt: new Date(),
      paymentMethod: paymentMethod || "bKash",
      transactionId: transactionId || "",
    },
    { new: true }
  ).lean();

  if (!updated) throw new Error("Billing not found");

  const nextRenewal = updated.billingPeriodEnd
    ? new Date(updated.billingPeriodEnd)
    : new Date(Date.now() + cycleDays * 24 * 60 * 60 * 1000);

  await UserModel.findByIdAndUpdate(updated.userId, {
    payment_status: "paid",
    subscription_status: "active",
    subscription_plan: PLAN_LIMITS[updated.planName]
      ? updated.planName
      : "Basic",
    next_payment_date: nextRenewal,
  });

  return JSON.parse(JSON.stringify(updated));
}

// ── Mark overdue bills ─────────────────────────────────────────────────────────
export async function markOverdueBillings() {
  await dbConnect();
  const result = await BillingModel.updateMany(
    { status: "unpaid", dueDate: { $lt: new Date() } },
    { $set: { status: "overdue" } }
  );
  return result.modifiedCount;
}

// ── Summary stats ──────────────────────────────────────────────────────────────
export async function getBillingSummary({ userId, shopId }) {
  await dbConnect();
  if (!userId || !shopId) {
    return { total: 0, paid: 0, unpaid: 0, overdue: 0, totalPaid: 0 };
  }

  const uid = new mongoose.Types.ObjectId(userId);
  const sid = new mongoose.Types.ObjectId(shopId);

  const [counts, paidAgg] = await Promise.all([
    BillingModel.aggregate([
      { $match: { userId: uid, shopId: sid } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          unpaid: { $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] } },
          overdue: { $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] } },
        },
      },
    ]),
    BillingModel.aggregate([
      { $match: { userId: uid, shopId: sid, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalDue" } } },
    ]),
  ]);

  const c = counts[0] || {};
  return {
    total: c.total || 0,
    paid: c.paid || 0,
    unpaid: c.unpaid || 0,
    overdue: c.overdue || 0,
    totalPaid: paidAgg[0]?.total || 0,
  };
}

/* ─── Monthly Subscription Dashboard & Upgrade/Renewal Queries (`/subscription`) ─── */
export async function getMerchantSubscriptionOverviewQuery({ userId, shopId }) {
  await dbConnect();
  const pricing = await resolveDynamicPlatformPricing();

  const plansCatalog = Object.entries(PLAN_LIMITS).map(([key, meta]) => {
    const monthlyPrice = pricing.prices[key] ?? 299;
    const vatAmount = Math.round(monthlyPrice * (pricing.vatPercent / 100));
    return {
      id: key,
      name: key,
      monthlyPrice,
      vatAmount,
      monthlyTotalWithVat: monthlyPrice + vatAmount,
      ...meta,
    };
  });

  if (!userId) {
    return JSON.parse(
      JSON.stringify({
        authenticated: false,
        plans: plansCatalog,
        vatPercent: pricing.vatPercent,
        cycleDays: pricing.cycleDays,
        trialDays: pricing.trialDays,
        gateways: pricing.gateways,
        subscription: null,
        usage: { products: 0, monthlyOrders: 0 },
        recentInvoices: [],
      })
    );
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [userDoc, productCount, monthlyOrdersCount, recentInvoices] =
    await Promise.all([
      UserModel.findById(userId)
        .select(
          "fullName email phone payment_status next_payment_date subscription_plan subscription_cycle subscription_status subscription_started_at auto_renew createdAt"
        )
        .lean(),
      shopId ? ProductModel.countDocuments({ shopId, userId }) : 0,
      shopId
        ? OrderModel.countDocuments({
            shopId,
            userId,
            createdAt: { $gte: monthStart },
          })
        : 0,
      shopId
        ? BillingModel.find({ userId, shopId })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean()
        : [],
    ]);

  if (!userDoc) {
    return JSON.parse(
      JSON.stringify({
        authenticated: false,
        plans: plansCatalog,
        vatPercent: pricing.vatPercent,
        cycleDays: pricing.cycleDays,
        trialDays: pricing.trialDays,
        gateways: pricing.gateways,
        subscription: null,
        usage: { products: 0, monthlyOrders: 0 },
        recentInvoices: [],
      })
    );
  }

  const activePlanKey = PLAN_LIMITS[userDoc.subscription_plan]
    ? userDoc.subscription_plan
    : "Basic";

  // Compute next renewal date (if null, fallback to createdAt + trialDays)
  const fallbackTrialEnd = new Date(userDoc.createdAt || now);
  fallbackTrialEnd.setDate(fallbackTrialEnd.getDate() + pricing.trialDays);
  const nextRenewalDate = userDoc.next_payment_date
    ? new Date(userDoc.next_payment_date)
    : fallbackTrialEnd;

  const diffMs = nextRenewalDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isTrial = !userDoc.next_payment_date && recentInvoices.length === 0;

  const openInvoice =
    recentInvoices.find(
      (inv) => inv.status === "unpaid" || inv.status === "overdue"
    ) || null;

  return JSON.parse(
    JSON.stringify({
      authenticated: true,
      userId: String(userId),
      shopId: shopId ? String(shopId) : null,
      plans: plansCatalog,
      vatPercent: pricing.vatPercent,
      cycleDays: pricing.cycleDays,
      trialDays: pricing.trialDays,
      gateways: pricing.gateways,
      subscription: {
        planName: activePlanKey,
        billingCycle: userDoc.subscription_cycle || "monthly",
        status: isTrial
          ? "trial"
          : openInvoice
          ? "past_due"
          : userDoc.subscription_status || "active",
        paymentStatus: userDoc.payment_status || "paid",
        autoRenew: userDoc.auto_renew !== false,
        startedAt: userDoc.subscription_started_at || userDoc.createdAt,
        nextRenewalDate,
        daysRemaining,
        isExpired: diffMs < 0,
        openInvoice,
      },
      usage: {
        products: productCount || 0,
        maxProducts: PLAN_LIMITS[activePlanKey].maxProducts,
        monthlyOrders: monthlyOrdersCount || 0,
        maxMonthlyOrders: PLAN_LIMITS[activePlanKey].maxMonthlyOrders,
      },
      recentInvoices,
    })
  );
}

/**
 * Subscribe to or renew a monthly plan (`months`: 1, 3, 6, or 12).
 */
export async function subscribeMerchantMonthlyPlanQuery({
  userId,
  shopId,
  planName = "Standard",
  months = 1,
  paymentMethod = "bKash",
  transactionId = "",
  payNow = true,
}) {
  await dbConnect();
  if (!userId || !shopId) {
    throw new Error("Merchant account and store ID are required.");
  }

  const validPlan = PLAN_LIMITS[planName] ? planName : "Basic";
  const cleanMonths = [1, 3, 6, 12].includes(Number(months))
    ? Number(months)
    : 1;

  if (payNow && !String(transactionId || "").trim()) {
    throw new Error(
      "Please enter your payment Transaction ID (TrxID) to activate immediately, or choose 'Generate Invoice (Pay Later)'."
    );
  }

  const userDoc = await UserModel.findById(userId);
  if (!userDoc) throw new Error("Merchant account not found.");

  const { prices, vatPercent, cycleDays, graceDays } =
    await resolveDynamicPlatformPricing();

  const unitMonthly = prices[validPlan] ?? 299;
  const discountRate =
    cleanMonths === 12 ? 0.15 : cleanMonths === 6 ? 0.1 : cleanMonths === 3 ? 0.05 : 0;

  const grossAmount = unitMonthly * cleanMonths;
  const discountAmount = Math.round(grossAmount * discountRate);
  const netSubtotal = grossAmount - discountAmount;
  const tax = Math.round(netSubtotal * (vatPercent / 100));
  const totalDue = netSubtotal + tax;

  const now = new Date();
  // If renewing the same active plan before expiration, extend seamlessly from current next_payment_date
  const baseStart =
    userDoc.subscription_plan === validPlan &&
    userDoc.next_payment_date &&
    new Date(userDoc.next_payment_date) > now
      ? new Date(userDoc.next_payment_date)
      : now;

  const periodEnd = new Date(baseStart);
  periodEnd.setDate(periodEnd.getDate() + cycleDays * cleanMonths);

  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + graceDays);

  const cycleLabel =
    cleanMonths === 1 ? "Monthly (30 Days)" : `${cleanMonths}-Month`;

  const createdInvoice = await BillingModel.create({
    userId,
    shopId,
    invoiceNumber: genInvoiceNumber(userId, "SUB"),
    invoiceTitle: `${validPlan} Plan — ${cycleLabel} Subscription`,
    billingPeriodStart: baseStart,
    billingPeriodEnd: periodEnd,
    dueDate: payNow ? periodEnd : dueDate,
    amount: netSubtotal,
    discount: discountAmount,
    tax,
    totalDue,
    planName: validPlan,
    planPrice: unitMonthly,
    status: payNow ? "paid" : "unpaid",
    paidAt: payNow ? now : null,
    paymentMethod: payNow ? String(paymentMethod || "bKash").trim() : "",
    transactionId: String(transactionId || "").trim(),
    notes: payNow
      ? `Merchant self-service ${cycleLabel} subscription payment`
      : `Merchant generated ${cycleLabel} subscription invoice`,
  });

  userDoc.subscription_plan = validPlan;
  userDoc.subscription_cycle = cleanMonths === 12 ? "yearly" : "monthly";
  userDoc.subscription_status = payNow ? "active" : "past_due";
  userDoc.payment_status = payNow ? "paid" : "unpaid";
  userDoc.next_payment_date = payNow ? periodEnd : dueDate;
  if (!userDoc.subscription_started_at) {
    userDoc.subscription_started_at = now;
  }
  await userDoc.save();

  return JSON.parse(
    JSON.stringify({
      invoice: createdInvoice,
      nextRenewalDate: userDoc.next_payment_date,
      planName: validPlan,
      status: userDoc.subscription_status,
    })
  );
}

export async function updateMerchantSubscriptionPreferencesQuery({
  userId,
  autoRenew,
  cancelAtPeriodEnd = false,
}) {
  await dbConnect();
  const userDoc = await UserModel.findById(userId);
  if (!userDoc) throw new Error("Merchant account not found.");

  if (typeof autoRenew === "boolean") {
    userDoc.auto_renew = autoRenew;
    if (autoRenew && userDoc.subscription_status === "cancelled") {
      userDoc.subscription_status =
        userDoc.payment_status === "paid" ? "active" : "past_due";
    }
  }

  if (cancelAtPeriodEnd) {
    userDoc.auto_renew = false;
    userDoc.subscription_status = "cancelled";
  }

  await userDoc.save();

  return JSON.parse(
    JSON.stringify({
      autoRenew: userDoc.auto_renew,
      status: userDoc.subscription_status,
    })
  );
}
