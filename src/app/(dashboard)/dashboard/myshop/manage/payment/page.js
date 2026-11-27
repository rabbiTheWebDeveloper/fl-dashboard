"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  DEFAULT_GATEWAY_NUMBER,
  SEND_MONEY_GATEWAYS,
} from "@/config/paymentGatewayConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentGatewayPage() {
  const [copiedId, setCopiedId] = useState("");

  const copyNum = async (num, id, name) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopiedId(id);
      toast.success(`Copied ${name} Send Money number: ${num}`);
      setTimeout(() => setCopiedId(""), 2000);
    } catch {
      toast.info(`${name}: ${num}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/myshop/manage"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Manage Shop
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Send Money{" "}
            <span className="rgb-gradient-text">Payment Gateway</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Active Send Money + TrxID Verification channels across bKash, Nagad,
            Rocket, Upay, and GPay ({DEFAULT_GATEWAY_NUMBER}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild variant="outline">
            <Link href="/dashboard/billings">Billing & Invoices</Link>
          </Button>
          <Button asChild variant="gradient">
            <Link href="/subscription">
              Pay Subscription
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Unified Number Highlight Card + 5 Logos Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-7 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />5 Active MFS Channels
            </Badge>
            <div className="inline-flex items-center gap-1.5">
              {SEND_MONEY_GATEWAYS.map((gw) => (
                <span
                  key={gw.id}
                  title={gw.name}
                  className="w-9 h-7 rounded-lg bg-white p-1 flex items-center justify-center shadow-2xs"
                >
                  <img
                    src={gw.logo}
                    alt={gw.name}
                    className="max-h-5 max-w-full object-contain"
                  />
                </span>
              ))}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold">
            Official Send Money Number:{" "}
            <span className="font-mono text-cyan-300">
              {DEFAULT_GATEWAY_NUMBER}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Send the exact invoice amount via{" "}
            <strong>bKash, Nagad, Rocket, Upay, or GPay</strong> to{" "}
            <strong className="font-mono">{DEFAULT_GATEWAY_NUMBER}</strong>,
            then submit your Sender Mobile Number and Transaction ID (TrxID) for
            Admin verification.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            copyNum(DEFAULT_GATEWAY_NUMBER, "master", "Official Gateway")
          }
          className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold shrink-0 h-11 px-5"
        >
          {copiedId === "master" ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Copied {DEFAULT_GATEWAY_NUMBER}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy {DEFAULT_GATEWAY_NUMBER}
            </>
          )}
        </Button>
      </div>

      {/* 5 Gateway Cards with Official Logos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEND_MONEY_GATEWAYS.map((gw) => (
          <Card
            key={gw.id}
            className="relative overflow-hidden border-slate-200/90 bg-white shadow-2xs"
          >
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: gw.accent }}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                    <img
                      src={gw.logo}
                      alt={gw.name}
                      className="max-h-9 max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base font-extrabold text-slate-900">
                      {gw.name}{" "}
                      <span className="text-xs font-semibold text-slate-400 bangla-text">
                        ({gw.bnName})
                      </span>
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      {gw.mode} · USSD {gw.ussd}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">
                  <BadgeCheck className="w-3 h-3 mr-1" /> Active
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div
                className="rounded-xl p-3 border flex items-center justify-between gap-2"
                style={{
                  backgroundColor: gw.softBg,
                  borderColor: gw.border,
                }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">
                    Send Money To
                  </p>
                  <p className="font-mono text-base font-extrabold text-slate-900">
                    {gw.defaultNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyNum(gw.defaultNumber, gw.id, gw.name)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                >
                  {copiedId === gw.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  Copy
                </button>
              </div>

              <ul className="space-y-1 text-[11px] text-slate-600">
                {gw.steps.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Smartphone
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      style={{ color: gw.accent }}
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
