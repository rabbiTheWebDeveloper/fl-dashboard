import mongoose, { Schema } from "mongoose";

export const ADMIN_ROLES = [
    "superadmin",
    "user-admin",
    "moderator",
    "support",
];

export const ADMIN_MODULES = [
    "overview",
    "dashboard",
    "users",
    "role",
    "merchants",
    "shops",
    "domain",
    "orders",
    "products",
    "payment-list",
    "billing",
    "visitor",
    "analytics",
    "settings",
];

const adminUserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            default: "",
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ADMIN_ROLES,
            default: "user-admin",
            index: true,
        },
        permissions: {
            type: [String],
            default: [
                "overview",
                "merchants",
                "shops",
                "orders",
                "products",
                "analytics",
            ],
        },
        status: {
            type: String,
            enum: ["active", "suspended"],
            default: "active",
            index: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        department: {
            type: String,
            default: "Platform Operations",
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "AdminUser",
            default: null,
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
        refreshSessions: {
            type: [
                {
                    tokenHash: { type: String, required: true },
                    expiresAt: { type: Date, required: true },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

adminUserSchema.index({ role: 1, status: 1, createdAt: -1 });

const platformSettingSchema = new Schema(
    {
        singletonKey: {
            type: String,
            default: "global",
            unique: true,
        },
        // 1. General & Branding
        platformName: {
            type: String,
            default: "AMARDokan",
            trim: true,
        },
        platformTagline: {
            type: String,
            default: "Next-Gen Multi-Store E-Commerce Cloud",
            trim: true,
        },
        companyAddress: {
            type: String,
            default: "Dhaka, Bangladesh",
            trim: true,
        },
        supportEmail: {
            type: String,
            default: "support@amardokan.com",
            trim: true,
        },
        supportPhone: {
            type: String,
            default: "01700000000",
            trim: true,
        },
        whatsappSupport: {
            type: String,
            default: "01700000000",
            trim: true,
        },
        logoUrl: {
            type: String,
            default: "",
            trim: true,
        },
        faviconUrl: {
            type: String,
            default: "",
            trim: true,
        },
        currency: {
            type: String,
            default: "BDT",
            trim: true,
        },
        timezone: {
            type: String,
            default: "Asia/Dhaka",
            trim: true,
        },
        announcementBanner: {
            type: String,
            default: "",
            trim: true,
        },

        // 2. SaaS Plan Tiers & Billing Rules
        basicPlanPrice: {
            type: Number,
            default: 299,
            min: 0,
        },
        standardPlanPrice: {
            type: Number,
            default: 599,
            min: 0,
        },
        professionalPlanPrice: {
            type: Number,
            default: 999,
            min: 0,
        },
        monthlyPlanFee: {
            type: Number,
            default: 499,
            min: 0,
        },
        vatPercent: {
            type: Number,
            default: 5,
            min: 0,
            max: 100,
        },
        trialDays: {
            type: Number,
            default: 14,
            min: 0,
        },
        billingCycleDays: {
            type: Number,
            default: 30,
            min: 1,
        },
        gracePeriodDays: {
            type: Number,
            default: 7,
            min: 0,
        },

        // 3. Merchant SaaS Payment Gateways
        bkashEnabled: { type: Boolean, default: true },
        bkashMerchantNumber: { type: String, default: "01700000000", trim: true },
        bkashAccountType: { type: String, default: "Merchant", trim: true },

        nagadEnabled: { type: Boolean, default: true },
        nagadMerchantNumber: { type: String, default: "01700000000", trim: true },

        rocketEnabled: { type: Boolean, default: false },
        rocketMerchantNumber: { type: String, default: "", trim: true },

        bankTransferEnabled: { type: Boolean, default: true },
        bankName: { type: String, default: "City Bank PLC", trim: true },
        bankAccountName: { type: String, default: "AMARDokan Technologies", trim: true },
        bankAccountNumber: { type: String, default: "", trim: true },
        bankBranch: { type: String, default: "Gulshan Branch, Dhaka", trim: true },

        sslcommerzEnabled: { type: Boolean, default: false },
        sslStoreId: { type: String, default: "", trim: true },

        // 4. System, DNS & Security Controls
        allowRegistrations: {
            type: Boolean,
            default: true,
        },
        requireEmailVerification: {
            type: Boolean,
            default: true,
        },
        maintenanceMode: {
            type: Boolean,
            default: false,
        },
        enableOrderEmailAlerts: {
            type: Boolean,
            default: true,
        },
        enableBillingReminders: {
            type: Boolean,
            default: true,
        },
        customDomainSupport: {
            type: Boolean,
            default: true,
        },
        primaryDnsIp: {
            type: String,
            default: "76.76.21.21",
            trim: true,
        },
        primaryCnameTarget: {
            type: String,
            default: "cname.amardokan.com",
            trim: true,
        },

        // 5. Role Permission Matrix Templates (`/admin/role`)
        roleTemplates: {
            type: Schema.Types.Mixed,
            default: {
                superadmin: [
                    "overview",
                    "dashboard",
                    "users",
                    "role",
                    "merchants",
                    "shops",
                    "domain",
                    "orders",
                    "products",
                    "payment-list",
                    "billing",
                    "visitor",
                    "analytics",
                    "settings",
                ],
                "user-admin": [
                    "overview",
                    "dashboard",
                    "users",
                    "role",
                    "merchants",
                    "shops",
                    "domain",
                    "orders",
                    "products",
                    "payment-list",
                    "billing",
                    "visitor",
                    "analytics",
                ],
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
            },
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "AdminUser",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

if (
    mongoose.models.AdminUser &&
    (!mongoose.models.AdminUser.schema.path("permissions") ||
        !mongoose.models.AdminUser.schema.path("refreshSessions"))
) {
    delete mongoose.models.AdminUser;
}

if (
    mongoose.models.PlatformSetting &&
    !mongoose.models.PlatformSetting.schema.path("roleTemplates")
) {
    delete mongoose.models.PlatformSetting;
}

export const AdminUserModel =
    mongoose.models.AdminUser ?? mongoose.model("AdminUser", adminUserSchema);

export const PlatformSettingModel =
    mongoose.models.PlatformSetting ??
    mongoose.model("PlatformSetting", platformSettingSchema);
