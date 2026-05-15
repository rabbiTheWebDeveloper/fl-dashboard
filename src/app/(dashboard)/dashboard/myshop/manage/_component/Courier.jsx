"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { saveCourierSettingsAction } from "@/app/actions/myshop";

/* ── per-courier brand config ─────────────────────────────── */
const COURIERS = [
  {
    id: "steadfast",
    name: "Steadfast",
    tagline: "Fast & Reliable Delivery",
    color: "#1D6FDB",
    gradient: "from-blue-600 to-blue-400",
    light: "bg-blue-50",
    ring: "ring-blue-500",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <circle cx="20" cy="20" r="20" fill="#1D6FDB" />
        <path d="M10 20h20M20 10l10 10-10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    fields: [
      { key: "apiKey", label: "API Key", type: "text", placeholder: "Enter your Steadfast API Key", hint: "Found in Steadfast merchant dashboard → Settings → API" },
      { key: "secretKey", label: "Secret Key", type: "password", placeholder: "Enter your Steadfast Secret Key", hint: "Keep this secure — never share publicly" },
    ],
    docsUrl: "https://steadfast.com.bd",
    webhookInfo: null,
  },
  {
    id: "redx",
    name: "REDX",
    tagline: "Bangladesh's Smart Delivery",
    color: "#E31C25",
    gradient: "from-red-600 to-rose-400",
    light: "bg-red-50",
    ring: "ring-red-500",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    btn: "bg-red-600 hover:bg-red-700 focus:ring-red-300",
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <circle cx="20" cy="20" r="20" fill="#E31C25" />
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">RX</text>
      </svg>
    ),
    fields: [
      { key: "token", label: "API Token", type: "text", placeholder: "Enter your REDX Bearer Token", hint: "Get your token from REDX merchant panel → API Integration" },
    ],
    docsUrl: "https://redx.com.bd",
    webhookInfo: null,
  },
  {
    id: "pathao",
    name: "Pathao",
    tagline: "Pathao Parcel Integration",
    color: "#F15A22",
    gradient: "from-orange-500 to-amber-400",
    light: "bg-orange-50",
    ring: "ring-orange-500",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    btn: "bg-orange-500 hover:bg-orange-600 focus:ring-orange-300",
    icon: (
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <circle cx="20" cy="20" r="20" fill="#F15A22" />
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">PTH</text>
      </svg>
    ),
    fields: [
      { key: "clientId",     label: "Client ID",     type: "text",     placeholder: "e.g. nXe0YZ7axr",         hint: "Provided by Pathao during API onboarding",    readOnly: true },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "Enter Client Secret",     hint: "Your unique Pathao client secret key" },
      { key: "username",     label: "Username (Email)", type: "email", placeholder: "your@email.com",         hint: "Pathao merchant account email",                readOnly: true },
      { key: "password",     label: "Password",      type: "password", placeholder: "Pathao account password", hint: "Your Pathao merchant login password" },
      { key: "storeId",      label: "Store ID",      type: "text",     placeholder: "e.g. 77790",             hint: "Pathao store identifier",                     readOnly: true },
    ],
    docsUrl: "https://pathao.com",
    webhookInfo: {
      title: "Pathao Webhook Setup",
      subtitle: "Pathao Dashboard → Developer's API → Webhook Integration",
      items: [
        { label: "Callback URL", value: "https://web.funnelliner.com/pathao/webhook/funnelliner1234" },
        { label: "Secret",       value: "funnelliner1234" },
      ],
    },
  },
];

/* ── Show/hide password eye icon ─────────────────────────── */
const EyeIcon = ({ show }) =>
  show ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

/* ── Copy to clipboard button ────────────────────────────── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button type="button" onClick={copy} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" title="Copy">
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

/* ── Single field with show/hide ─────────────────────────── */
const CredentialField = ({ field, value, onChange, accentRing }) => {
  const [visible, setVisible] = useState(false);
  const isPassword = field.type === "password";
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {field.label}
        {field.readOnly && (
          <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">read-only</span>
        )}
      </label>
      <div className="relative">
        <input
          type={isPassword && !visible ? "password" : "text"}
          value={value}
          onChange={onChange}
          readOnly={!!field.readOnly}
          placeholder={field.placeholder}
          className={`w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm bg-white transition-all duration-150 outline-none
            ${field.readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed" : `focus:ring-2 ${accentRing} focus:border-transparent`}`}
        />
        {isPassword && !field.readOnly && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <EyeIcon show={visible} />
          </button>
        )}
      </div>
      {field.hint && <p className="text-xs text-gray-400">{field.hint}</p>}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────── */
const Courier = ({ user, courierSettings }) => {
  const router = useRouter();
  const [active, setActive] = useState("steadfast");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState({
    steadfast: !!(courierSettings?.steadfast?.apiKey),
    redx:      !!(courierSettings?.redx?.token),
    pathao:    !!(courierSettings?.pathao?.clientSecret),
  });

  /* build initial form data from saved settings */
  const buildInitial = (id) => {
    const saved = courierSettings?.[id] || {};
    const courier = COURIERS.find((c) => c.id === id);
    const init = {};
    courier.fields.forEach((f) => { init[f.key] = saved[f.key] || ""; });
    return init;
  };

  const [forms, setForms] = useState({
    steadfast: buildInitial("steadfast"),
    redx:      buildInitial("redx"),
    pathao:    buildInitial("pathao"),
  });

  const updateField = (courierId, key, val) => {
    setForms((prev) => ({ ...prev, [courierId]: { ...prev[courierId], [key]: val } }));
  };

  const handleSubmit = async (e, courierId) => {
    e.preventDefault();
    if (!user?.userId || !user?.shopId) {
      toast.error("User session expired. Please refresh.");
      return;
    }
    setLoading(true);
    try {
      await saveCourierSettingsAction({
        userId: user.userId,
        shopId: user.shopId,
        courierType: courierId,
        data: { ...forms[courierId], status: true },
      });
      setConnected((prev) => ({ ...prev, [courierId]: true }));
      toast.success(`${COURIERS.find((c) => c.id === courierId)?.name} credentials saved!`);
    } catch (err) {
      toast.error(err.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeCourier = COURIERS.find((c) => c.id === active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Courier Integration</h1>
              <p className="text-xs text-gray-500">Connect your delivery partners</p>
            </div>
          </div>
          {/* connected pill summary */}
          <div className="hidden sm:flex items-center gap-2">
            {COURIERS.map((c) => (
              <span
                key={c.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  connected[c.id] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${connected[c.id] ? "bg-green-500" : "bg-gray-400"}`} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left Sidebar: Courier selector ───────────────── */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Select Courier</p>
            {COURIERS.map((courier) => (
              <button
                key={courier.id}
                onClick={() => setActive(courier.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left group
                  ${active === courier.id
                    ? `border-transparent bg-gradient-to-r ${courier.gradient} shadow-lg shadow-blue-200/40 text-white`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm text-gray-700"
                  }`}
              >
                {/* icon */}
                <div className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ${active === courier.id ? "ring-2 ring-white/40" : "ring-1 ring-gray-200"}`}>
                  {courier.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{courier.name}</span>
                    {connected[courier.id] && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${active === courier.id ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
                        ✓ Connected
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${active === courier.id ? "text-white/70" : "text-gray-400"}`}>
                    {courier.tagline}
                  </p>
                </div>
              </button>
            ))}

            {/* Info card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-amber-800">Security Note</p>
                  <p className="text-xs text-amber-700 mt-0.5">Credentials are stored encrypted. Never share your keys publicly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Form ─────────────────────────────── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Card header with gradient accent */}
              <div className={`bg-gradient-to-r ${activeCourier.gradient} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/20 p-1 flex-shrink-0 shadow-lg">
                    {activeCourier.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{activeCourier.name}</h2>
                      {connected[activeCourier.id] && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/25 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-white/75 text-sm mt-0.5">{activeCourier.tagline}</p>
                  </div>
                  <a
                    href={activeCourier.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto flex items-center gap-1 text-white/80 hover:text-white text-xs border border-white/30 hover:border-white/60 rounded-lg px-3 py-1.5 transition-all"
                  >
                    Docs
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Form body */}
              <form onSubmit={(e) => handleSubmit(e, activeCourier.id)} className="p-6 space-y-5">
                {activeCourier.fields.map((field) => (
                  <CredentialField
                    key={field.key}
                    field={field}
                    value={forms[activeCourier.id]?.[field.key] || ""}
                    onChange={(e) => updateField(activeCourier.id, field.key, e.target.value)}
                    accentRing={activeCourier.ring}
                  />
                ))}

                {/* Webhook info box (Pathao only) */}
                {activeCourier.webhookInfo && (
                  <div className={`rounded-xl border ${activeCourier.border} ${activeCourier.light} p-4`}>
                    <p className="text-xs font-bold text-gray-700 mb-1">{activeCourier.webhookInfo.title}</p>
                    <p className="text-xs text-gray-500 mb-3">{activeCourier.webhookInfo.subtitle}</p>
                    <div className="space-y-2">
                      {activeCourier.webhookInfo.items.map((item) => (
                        <div key={item.label} className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-gray-600 w-28 flex-shrink-0">{item.label}:</span>
                          <div className="flex items-center gap-1 flex-1">
                            <code className="text-xs text-gray-700 bg-white border border-gray-200 rounded px-2 py-0.5 flex-1 truncate">{item.value}</code>
                            <CopyBtn text={item.value} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${activeCourier.btn}`}
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving Credentials...
                      </>
                    ) : connected[activeCourier.id] ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Update {activeCourier.name} Credentials
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Save {activeCourier.name} Credentials
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* ── Status row ──────────────────────────────────── */}
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Connection Status</p>
              <div className="grid grid-cols-3 gap-3">
                {COURIERS.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${
                      connected[c.id]
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${connected[c.id] ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{c.name}</p>
                      <p className={`text-xs ${connected[c.id] ? "text-green-600" : "text-gray-400"}`}>
                        {connected[c.id] ? "Active" : "Not connected"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courier;