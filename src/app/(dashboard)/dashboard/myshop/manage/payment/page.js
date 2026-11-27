import ComingSoonCard from "@/app/(dashboard)/_component/ComingSoonCard";

export default function PaymentGatewayPage() {
  return (
    <ComingSoonCard
      title="Payment Gateway Integrations"
      subtitle="Accept automated bKash, Nagad, SSLCommerz, and card payments directly at checkout."
      badge="Payments"
      progress={88}
      backHref="/dashboard/myshop/manage"
      backLabel="Back to Manage Shop"
    />
  );
}
