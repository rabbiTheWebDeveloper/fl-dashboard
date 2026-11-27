"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  Radar,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DOMAIN_BADGE_STYLES = {
  connected: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/15 text-amber-700 border-amber-200",
  failed: "bg-rose-500/15 text-rose-700 border-rose-200",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-200",
  disconnected: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminDomainClient({ admin, initialData = {} }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shopId: initialData?.shops?.[0]?._id || "",
    domain_name: "",
    domain_status: "connected",
  });

  const [dnsCheckingId, setDnsCheckingId] = useState("");
  const [dnsReport, setDnsReport] = useState(null);

  const { counts = {}, domains = [], shops = [], dnsConfig = {} } = data;
  const canManage = ["superadmin", "user-admin"].includes(admin?.role);

  const refreshDomains = async (silent = false) => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/domain", {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json?.success && json.data) {
        setData(json.data);
        if (!silent) toast.success("Domain records refreshed!");
      }
    } catch {
      if (!silent) toast.error("Failed to refresh domains.");
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return domains.filter((d) => {
      if (statusFilter !== "all" && d.domain_status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        String(d.domain_name || "")
          .toLowerCase()
          .includes(q) ||
        String(d.shopId?.shopName || "")
          .toLowerCase()
          .includes(q) ||
        String(d.userId?.email || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [domains, search, statusFilter]);

  const handleCopyText = async (val, label) => {
    try {
      await navigator.clipboard.writeText(val);
      toast.success(`Copied ${label}: ${val}`);
    } catch {
      toast.info(val);
    }
  };

  const handleAssignDomain = async (e) => {
    e.preventDefault();
    if (!form.shopId || !form.domain_name.trim()) {
      toast.error("Please select a shop and enter a domain hostname.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/domain", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to save domain.");
        return;
      }
      toast.success(json.message);
      setAddOpen(false);
      setForm((p) => ({ ...p, domain_name: "" }));
      await refreshDomains(true);
    } catch {
      toast.error("Error saving custom domain.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (domainId, nextStatus) => {
    try {
      const res = await fetch("/api/admin/domain", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ domainId, domain_status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to update status.");
        return;
      }
      toast.success(json.message);
      await refreshDomains(true);
    } catch {
      toast.error("Could not update domain status.");
    }
  };

  const handleCheckDns = async (domainDoc) => {
    setDnsCheckingId(domainDoc._id);
    try {
      const res = await fetch("/api/admin/domain", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: "check_dns",
          domainId: domainDoc._id,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "DNS lookup failed.");
        return;
      }
      setDnsReport(json.data);
    } catch {
      toast.error("Failed to run DNS verification.");
    } finally {
      setDnsCheckingId("");
    }
  };

  const handleDeleteDomain = async (d) => {
    if (!window.confirm(`Remove custom domain "${d.domain_name}"?`)) return;
    try {
      const res = await fetch(
        `/api/admin/domain?id=${encodeURIComponent(d._id)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Delete failed.");
        return;
      }
      toast.success("Custom domain removed.");
      await refreshDomains(true);
    } catch {
      toast.error("Error deleting domain.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-slate-200/80 bg-white shadow-2xs">
        <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600">
              <Globe className="w-4 h-4" /> Multi-Tenant Custom Domains
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Domain Verification & Routing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Inspect merchant custom domains, run live DNS A/CNAME lookups, and approve or reject domain requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={refreshing}
              onClick={() => refreshDomains(false)}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Connect Domain
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Domains",
            val: counts.total ?? domains.length,
            icon: Globe,
            bar: "from-violet-600 to-indigo-600",
            tone: "text-violet-600 bg-violet-500/15",
          },
          {
            label: "Connected & Active",
            val: counts.connected ?? 0,
            icon: CheckCircle2,
            bar: "from-emerald-500 to-teal-600",
            tone: "text-emerald-600 bg-emerald-500/15",
          },
          {
            label: "Pending Review",
            val: counts.pending ?? 0,
            icon: Clock,
            bar: "from-amber-500 to-orange-500",
            tone: "text-amber-600 bg-amber-500/15",
          },
          {
            label: "Failed / Rejected",
            val: counts.issues ?? 0,
            icon: ShieldAlert,
            bar: "from-rose-500 to-pink-600",
            tone: "text-rose-600 bg-rose-500/15",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className="relative overflow-hidden py-4 border-slate-200/80 bg-white shadow-2xs"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.bar}`}
              />
              <CardContent className="px-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {item.val}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.tone}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Required Platform DNS Target Strip */}
      <div className="rounded-2xl bg-slate-950 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
            Required Merchant DNS Targets
          </p>
          <p className="text-xs text-slate-300">
            Merchants must point their apex `A` record or `www` `CNAME` record to these targets before approval.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <button
            type="button"
            onClick={() =>
              handleCopyText(
                dnsConfig.primaryDnsIp || "76.76.21.21",
                "A-Record IP"
              )
            }
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 inline-flex items-center gap-2"
          >
            <span className="text-emerald-300 font-bold">A</span>
            <span>{dnsConfig.primaryDnsIp || "76.76.21.21"}</span>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() =>
              handleCopyText(
                dnsConfig.primaryCnameTarget || "cname.amardokan.com",
                "CNAME Target"
              )
            }
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 inline-flex items-center gap-2"
          >
            <span className="text-cyan-300 font-bold">CNAME</span>
            <span>{dnsConfig.primaryCnameTarget || "cname.amardokan.com"}</span>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            "all",
            "pending",
            "connected",
            "failed",
            "rejected",
            "disconnected",
          ].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize shrink-0 transition ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domain, shop, or email..."
            className="pl-9 bg-white rounded-xl"
          />
        </div>
      </div>

      {/* Domains Table */}
      <Card className="border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold">Custom Domain</TableHead>
                <TableHead className="font-bold">Merchant Store</TableHead>
                <TableHead className="font-bold">Owner</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-center">
                  Submitted
                </TableHead>
                <TableHead className="font-bold text-right">
                  DNS & Moderation
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((d) => {
                  const slug =
                    d.shopId?.shopSlug || d.shopId?.shopId || "";
                  const checking = dnsCheckingId === d._id;
                  return (
                    <TableRow key={d._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                          <div>
                            <a
                              href={`https://${d.domain_name}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono font-bold text-xs sm:text-sm text-slate-900 hover:text-violet-600 inline-flex items-center gap-1"
                            >
                              {d.domain_name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-slate-800 bangla-text">
                          {d.shopId?.shopName || "—"}
                        </p>
                        {slug && (
                          <Link
                            href={`/shop/${encodeURIComponent(slug)}`}
                            target="_blank"
                            className="text-xs text-violet-600 hover:underline"
                          >
                            /shop/{slug}
                          </Link>
                        )}
                      </TableCell>

                      <TableCell>
                        <p className="text-xs font-bold text-slate-800 bangla-text">
                          {d.userId?.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {d.userId?.email || ""}
                        </p>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={
                            DOMAIN_BADGE_STYLES[d.domain_status] ||
                            DOMAIN_BADGE_STYLES.pending
                          }
                        >
                          {d.domain_status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center text-xs text-slate-500">
                        {d.createdAt
                          ? new Date(d.createdAt).toLocaleDateString("en-GB")
                          : "—"}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={checking}
                            onClick={() => handleCheckDns(d)}
                            className="h-7 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            {checking ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Radar className="w-3 h-3 text-cyan-600" />
                            )}
                            Check DNS
                          </button>

                          {d.domain_status !== "connected" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(d._id, "connected")
                              }
                              className="h-7 px-2.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                          )}

                          {d.domain_status === "pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(d._id, "rejected")
                              }
                              className="h-7 px-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          )}

                          <select
                            aria-label="Update domain status"
                            value={d.domain_status}
                            onChange={(e) =>
                              handleStatusUpdate(d._id, e.target.value)
                            }
                            className="h-7 px-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold bg-white"
                          >
                            <option value="pending">pending</option>
                            <option value="connected">connected</option>
                            <option value="failed">failed</option>
                            <option value="disconnected">disconnected</option>
                            <option value="rejected">rejected</option>
                          </select>

                          {canManage && (
                            <button
                              type="button"
                              onClick={() => handleDeleteDomain(d)}
                              title="Remove Domain"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-14 text-center text-xs text-slate-400"
                  >
                    No custom domains found. Click &ldquo;Connect Domain&rdquo; to map a custom domain to a store.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Connect Custom Domain Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              Assign Custom Domain to Store
            </DialogTitle>
            <DialogDescription className="text-xs">
              Bind a merchant&apos;s custom domain directly to their AMARDokan shop.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignDomain} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Select Store *</Label>
              <select
                required
                value={form.shopId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shopId: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="">-- Choose Shop --</option>
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.shopName} ({s.owner?.email || `#${s.shopId}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Domain Hostname *</Label>
              <Input
                required
                value={form.domain_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, domain_name: e.target.value }))
                }
                placeholder="e.g. www.mystorebd.com"
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Initial Status</Label>
              <select
                value={form.domain_status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, domain_status: e.target.value }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
              >
                <option value="connected">connected (Active)</option>
                <option value="pending">pending (Awaiting DNS)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                Save Domain
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DNS Inspection Result Modal */}
      <Dialog
        open={Boolean(dnsReport)}
        onOpenChange={(o) => {
          if (!o) setDnsReport(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold flex items-center gap-2">
              <Radar className="w-5 h-5 text-cyan-600" />
              Live DNS Inspection: {dnsReport?.domainName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Real-time A & CNAME record lookup from server DNS resolver
            </DialogDescription>
          </DialogHeader>

          {dnsReport && (
            <div className="space-y-3 text-xs">
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                  dnsReport.matchesTarget
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : dnsReport.resolvesAnywhere
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {dnsReport.matchesTarget ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                )}
                <div>
                  <p className="font-extrabold">
                    {dnsReport.matchesTarget
                      ? "DNS Matches Platform Target!"
                      : dnsReport.resolvesAnywhere
                      ? "Domain resolves, but points to a different IP/CNAME"
                      : "No public A/CNAME records detected yet"}
                  </p>
                  <p className="mt-0.5 opacity-85">
                    Expected IP: {dnsReport.expectedIp} or CNAME:{" "}
                    {dnsReport.expectedCname}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5 font-mono">
                <p className="text-slate-500 font-sans font-bold">
                  Detected A Records:
                </p>
                <p className="text-slate-900">
                  {dnsReport.aRecords?.length > 0
                    ? dnsReport.aRecords.join(", ")
                    : "None"}
                </p>
                <p className="text-slate-500 font-sans font-bold pt-1">
                  Detected CNAME Records:
                </p>
                <p className="text-slate-900">
                  {dnsReport.cnameRecords?.length > 0
                    ? dnsReport.cnameRecords.join(", ")
                    : "None"}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDnsReport(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="gradient"
                  onClick={() => {
                    handleStatusUpdate(dnsReport.domainId, "connected");
                    setDnsReport(null);
                  }}
                >
                  Mark Connected
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
