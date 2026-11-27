"use client";

import React, { useState } from "react";
import { CheckCircle2, HelpCircle, Sparkles, Zap } from "lucide-react";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const PLANS = [
  {
    id: "basic",
    name: "Starter",
    price: { monthly: 500, yearly: 450 },
    description: "Essential tools for new merchants launching online",
    features: [
      "Up to 100 orders/month",
      "Core sales analytics",
      "Email support",
      "1 merchant seat",
      "Custom storefront theme",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Growth Pro",
    price: { monthly: 1000, yearly: 850 },
    description: "Built for scaling Bangladeshi D2C brands",
    features: [
      "Up to 1,000 orders/month",
      "Deep cohort & product analytics",
      "Priority support",
      "5 team accounts",
      "Courier integrations (Steadfast, Pathao, RedX)",
      "Custom domain connection",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 2000, yearly: 1800 },
    description: "Unlimited volume & dedicated onboarding",
    features: [
      "Unlimited monthly orders",
      "Real-time custom reporting",
      "24/7 dedicated account manager",
      "Unlimited team seats",
      "All integrations unlocked",
      "99.9% SLA uptime guarantee",
    ],
    popular: false,
  },
];

const FAQS = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and prorate on your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We support bKash, Nagad, Rocket, bank transfers, and major debit/credit cards.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Every new AMARDokan merchant starts with a 14-day trial—no card required.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "You can cancel anytime from Billing & Invoices with zero cancellation fees.",
  },
];

export default function Subscription() {
  const [activePlan, setActivePlan] = useState("premium");
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (plan) => {
    setActivePlan(plan.id);
    toast.success(`${plan.name} plan selected!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Badge className="bg-violet-500/10 text-violet-700 border-violet-200">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Flexible Merchant Pricing
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Choose Your <span className="rgb-gradient-text">Growth Plan</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Transparent pricing tailored for Bangladeshi online stores—upgrade as
          your order volume grows.
        </p>

        {/* Billing Cycle Switch */}
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
          <span
            className={`text-sm font-medium ${
              !isYearly ? "text-slate-900 font-bold" : "text-slate-500"
            }`}
          >
            Monthly
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span
            className={`text-sm font-medium ${
              isYearly ? "text-slate-900 font-bold" : "text-slate-500"
            }`}
          >
            Yearly{" "}
            <Badge className="ml-1 bg-emerald-500/15 text-emerald-700 border-emerald-200">
              Save 15%
            </Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => {
          const isSelected = activePlan === plan.id;
          const unitPrice = isYearly ? plan.price.yearly : plan.price.monthly;
          return (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between transition-all duration-200 ${
                plan.popular
                  ? "rgb-card border-violet-400 shadow-xl bg-white lg:-translate-y-2"
                  : "border-slate-200/80 bg-white/95 hover:shadow-md"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-xl font-extrabold text-slate-900">
                    {plan.name}
                  </CardTitle>
                  {plan.popular && (
                    <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>

                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ৳{unitPrice}
                    </span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>
                  {isYearly && (
                    <p className="text-xs font-semibold text-emerald-600 mt-1">
                      Billed annually · Save ৳
                      {(plan.price.monthly - plan.price.yearly) * 12}/year
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular || isSelected ? "gradient" : "outline"}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {isSelected ? "Selected Plan" : `Choose ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <Card className="border-slate-200/80 bg-white/95 max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-1">
            <HelpCircle className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Everything you need to know about AMARDokan billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-sm font-semibold text-slate-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
