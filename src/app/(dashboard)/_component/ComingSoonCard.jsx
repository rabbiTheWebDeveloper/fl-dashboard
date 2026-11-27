"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Rocket, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function ComingSoonCard({
  title = "Feature Coming Soon",
  subtitle = "We're crafting an upgraded experience for your AMARDokan store.",
  badge = "In Development",
  progress = 80,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  highlights = [
    "Seamless one-click store integration",
    "Real-time analytics & automation",
    "Built for Bangladeshi merchants",
  ],
}) {
  const [email, setEmail] = useState("");

  const handleNotify = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.info("Enter your email to get notified when this launches.");
      return;
    }
    toast.success("You're on the early-access list!");
    setEmail("");
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <Card className="rgb-card w-full max-w-2xl border-slate-200/80 shadow-lg bg-white/95 backdrop-blur">
        <CardHeader className="text-center items-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-3">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-indigo-700 border-indigo-200 mb-2">
            <Sparkles className="w-3 h-3 mr-1 text-violet-600" />
            {badge}
          </Badge>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base max-w-lg mx-auto mt-1 text-slate-500">
            {subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Release Readiness</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs font-medium text-slate-700 text-center"
              >
                {item}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleNotify}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for launch alert..."
              className="bg-white"
            />
            <Button type="submit" variant="gradient" className="shrink-0">
              <Bell className="w-4 h-4" />
              Notify Me
            </Button>
          </form>

          <div className="flex justify-center pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={backHref}>
                <ArrowLeft className="w-4 h-4" />
                {backLabel}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
