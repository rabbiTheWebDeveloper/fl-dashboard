"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createOrderAction } from "@/app/actions/order";

const tk = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

const hasVariants = (p) => p?.variants?.length > 0;

export default function CreateOrder({ productlist = [], user }) {
  const router = useRouter();
  const [customer, setCustomer] = useState({ customerName: "", customerPhone: "", customerAddress: "", customerNote: "" });
  const [orderType, setOrderType] = useState("website");
  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [selProduct, setSelProduct] = useState(null);
  const [selIdx, setSelIdx] = useState("");
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState([]);
  const [shipping, setShipping] = useState(0);
  const [cod, setCod] = useState(true);
  const [loading, setLoading] = useState(false);

  const filtered = productlist.filter(p =>
    p.productName?.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = subtotal + Number(shipping);

  // For variant products: selected variant object
  const selVariant = selProduct && hasVariants(selProduct) && selIdx !== ""
    ? selProduct.variants[Number(selIdx)]
    : null;

  // For no-variant products: use regularPrice + availableQuantity
  const noVariantProduct = selProduct && !hasVariants(selProduct) ? selProduct : null;

  const pickProduct = (p) => {
    setSelProduct(p);
    // Auto-select only option if single variant
    if (hasVariants(p) && p.variants.length === 1) setSelIdx("0");
    else if (!hasVariants(p)) setSelIdx("novariant");
    else setSelIdx("");
    setQty(1);
    setSearch(p.productName);
    setShowDrop(false);
  };

  const addItem = () => {
    if (!selProduct) { toast.error("Please select a product"); return; }

    let price, stock, variantLabel, variantIdxNum;

    if (hasVariants(selProduct)) {
      if (selIdx === "" || selVariant == null) { toast.error("Please select a variant"); return; }
      price = selVariant.price;
      stock = selVariant.quantity;
      variantLabel = selVariant.combination || `Variant ${Number(selIdx) + 1}`;
      variantIdxNum = Number(selIdx);
    } else {
      price = selProduct.regularPrice;
      stock = selProduct.availableQuantity || 0;
      variantLabel = "Default";
      variantIdxNum = 0;
    }

    if (qty < 1) { toast.error("Quantity must be at least 1"); return; }
    if (stock > 0 && qty > stock) { toast.error(`Only ${stock} in stock`); return; }

    const key = `${selProduct._id}-${variantIdxNum}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      const nq = existing.qty + qty;
      if (stock > 0 && nq > stock) { toast.error(`Max stock: ${stock}`); return; }
      setItems(items.map(i => i.key === key ? { ...i, qty: nq } : i));
    } else {
      setItems(prev => [...prev, {
        key, id: Date.now(),
        productId: selProduct._id,
        productName: selProduct.productName,
        image: selProduct.mainImage?.url,
        variantIdx: variantIdxNum,
        variant: variantLabel,
        price, stock, qty,
      }]);
    }
    toast.success(`${selProduct.productName} added!`);
    setSelProduct(null); setSelIdx(""); setQty(1); setSearch("");
  };

  const removeItem = (id) => setItems(items.filter(i => i.id !== id));

  const changeQty = (id, v) => {
    const item = items.find(i => i.id === id);
    const n = Number(v);
    if (n < 1) return;
    if (item.stock > 0 && n > item.stock) { toast.warning(`Max ${item.stock} in stock`); return; }
    setItems(items.map(i => i.id === id ? { ...i, qty: n } : i));
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!customer.customerName.trim()) { toast.error("Customer name is required"); return; }
    if (!customer.customerPhone.trim()) { toast.error("Phone number is required"); return; }
    if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(customer.customerPhone.trim())) {
      toast.error("Enter a valid Bangladeshi phone number"); return;
    }
    if (!customer.customerAddress.trim()) { toast.error("Delivery address is required"); return; }
    if (items.length === 0) { toast.error("Add at least one product"); return; }

    setLoading(true);
    try {
      const result = await createOrderAction({
        ...customer,
        userId: user?.userId,
        shopId: user?.shopId,
        productId: items.map(i => i.productId),
        variationId: items.map(i => i.variantIdx),
        quantity: items.map(i => i.qty),
        orderType,
        visitorId: `manual_${Date.now()}`,
        grand_total: grandTotal,
        due: cod ? grandTotal : 0,
        cod,
        shipping_cost: Number(shipping),
        status: "pending",
      });
      if (result?.status === 200) {
        toast.success("Order created successfully!");
        router.push("/dashboard/orders");
      } else {
        toast.error(result?.message || "Failed to create order");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button type="button" onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Create Order</h1>
          <p className="text-xs text-gray-400">Fill in customer info and add products</p>
        </div>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="button" onClick={submit} disabled={loading || items.length === 0} className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center gap-2">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</>
            : "Place Order"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT col */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="font-semibold text-gray-800">Customer Information</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "customerName", label: "Full Name *", placeholder: "Ahmed Rahman" },
                { key: "customerPhone", label: "Phone *", placeholder: "01XXXXXXXXX" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input value={customer[f.key]} onChange={e => setCustomer({ ...customer, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"/>
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Delivery Address *</label>
                <textarea value={customer.customerAddress} onChange={e => setCustomer({ ...customer, customerAddress: e.target.value })} placeholder="House, Road, Area, City..." rows={2} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Order Type</label>
                <select value={orderType} onChange={e => setOrderType(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white transition-all">
                  {["website","phone","walkin","facebook","whatsapp"].map(v => <option key={v} value={v} className="capitalize">{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Note (optional)</label>
                <input value={customer.customerNote} onChange={e => setCustomer({ ...customer, customerNote: e.target.value })} placeholder="Special instruction..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"/>
              </div>
            </div>
          </section>

          {/* Product selector */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-semibold text-gray-800">Add Products</h2>
            </div>
            <div className="p-5 space-y-4">
              {/* Search */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Search Product</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input value={search} onChange={e => { setSearch(e.target.value); setShowDrop(true); setSelProduct(null); setSelIdx(""); }} onFocus={() => setShowDrop(true)} onBlur={() => setTimeout(() => setShowDrop(false), 150)} placeholder="Type to search..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition-all"/>
                </div>
                {showDrop && search && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {filtered.length === 0
                      ? <p className="px-4 py-5 text-sm text-center text-gray-400">No products found</p>
                      : filtered.map(p => (
                        <button key={p._id} type="button" onMouseDown={() => pickProduct(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-left transition-colors">
                          <img src={p.mainImage?.url} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0 bg-gray-100"/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{p.productName}</p>
                            <p className="text-xs text-gray-400">
                              {hasVariants(p) ? `${p.variants.length} variants` : `${tk(p.regularPrice)} • Stock: ${p.availableQuantity || 0}`}
                            </p>
                          </div>
                          {!hasVariants(p) && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">No Variant</span>
                          )}
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>

              {/* Variant selector — only show if product has variants */}
              {selProduct && hasVariants(selProduct) && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Select Variant <span className="text-red-500">*</span>
                    <span className="ml-2 font-normal text-gray-400">({selProduct.variants.length} options)</span>
                  </label>
                  <select value={selIdx} onChange={e => setSelIdx(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none bg-white transition-all">
                    <option value="">-- Choose a variant --</option>
                    {selProduct.variants.map((v, i) => (
                      <option key={i} value={i} disabled={v.quantity === 0}>
                        {v.combination || `Option ${i + 1}`} — {tk(v.price)}
                        {v.quantity > 0 ? ` (${v.quantity} left)` : " — Out of Stock"}
                      </option>
                    ))}
                  </select>
                  {selVariant && (
                    <p className="text-xs text-green-600 mt-1">Selected: <strong>{selVariant.combination}</strong> • {tk(selVariant.price)} • {selVariant.quantity} in stock</p>
                  )}
                </div>
              )}

              {/* No-variant product info */}
              {selProduct && !hasVariants(selProduct) && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <img src={selProduct.mainImage?.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-green-200 bg-gray-100"/>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">{selProduct.productName}</p>
                    <p className="text-xs text-green-700">{tk(selProduct.regularPrice)} • Stock: {selProduct.availableQuantity || 0}</p>
                  </div>
                </div>
              )}

              {/* Qty + Add row */}
              <div className="flex gap-3 items-end">
                <div className="w-32">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                  <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} disabled={!selProduct} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 outline-none disabled:bg-gray-50 transition-all"/>
                </div>
                <button type="button" onClick={addItem} disabled={!selProduct || (hasVariants(selProduct) && !selVariant)} className="flex-1 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add to Order
                </button>
              </div>
            </div>
          </section>

          {/* Order items */}
          {items.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">3</span>
                  <h2 className="font-semibold text-gray-800">Order Items</h2>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-0.5 rounded-full">{items.length} item{items.length > 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-100 flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400">{item.variant} • {tk(item.price)}</p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button type="button" onClick={() => changeQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors">−</button>
                      <input type="number" value={item.qty} onChange={e => changeQty(item.id, e.target.value)} className="w-10 py-1.5 text-center text-sm font-semibold border-0 outline-none"/>
                      <button type="button" onClick={() => changeQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors">+</button>
                    </div>
                    <span className="text-sm font-bold text-blue-700 w-20 text-right">{tk(item.price * item.qty)}</span>
                    <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT col */}
        <div className="space-y-5">
          {/* Delivery */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm">Delivery & Payment</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Shipping Cost (৳)</label>
                <input type="number" min="0" value={shipping} onChange={e => setShipping(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all"/>
              </div>
              <button type="button" onClick={() => setCod(!cod)} className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${cod ? "border-purple-400 bg-purple-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">{cod ? "Collect on delivery" : "Already paid"}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${cod ? "bg-purple-500" : "bg-gray-300"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${cod ? "translate-x-5" : "translate-x-0.5"}`}/>
                </div>
              </button>
            </div>
          </section>

          {/* Summary */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-20">
            <div className="px-5 py-4 border-b border-gray-100 bg-orange-50/50">
              <h2 className="font-semibold text-gray-800 text-sm">Order Summary</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm text-gray-600"><span>Items ({items.reduce((s,i) => s+i.qty, 0)} pcs)</span><span className="font-medium text-gray-800">{tk(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="font-medium text-gray-800">{tk(shipping)}</span></div>
              <div className="h-px bg-gray-100"/>
              <div className="flex justify-between"><span className="font-bold text-gray-800">Grand Total</span><span className="font-bold text-lg text-orange-600">{tk(grandTotal)}</span></div>
              {cod && grandTotal > 0 && (
                <div className="flex justify-between text-sm bg-orange-50 border border-orange-100 p-2.5 rounded-lg">
                  <span className="text-orange-800 font-medium">COD Amount</span>
                  <span className="text-orange-800 font-bold">{tk(grandTotal)}</span>
                </div>
              )}
              <div className="h-px bg-gray-100"/>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between"><span>Type</span><span className="font-medium text-gray-700 capitalize">{orderType}</span></div>
                <div className="flex justify-between"><span>Payment</span><span className="font-medium text-gray-700">{cod ? "Cash on Delivery" : "Prepaid"}</span></div>
              </div>
              <button type="button" onClick={submit} disabled={loading || items.length === 0} className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating...</>
                  : `Place Order • ${tk(grandTotal)}`}
              </button>
              {items.length === 0 && <p className="text-xs text-center text-gray-400">Add at least one product</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}