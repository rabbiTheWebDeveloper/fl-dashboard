import ComingSoonCard from "@/app/(dashboard)/_component/ComingSoonCard";

export default function ShopPolicyPage() {
  return (
    <ComingSoonCard
      title="Store Policy Generator"
      subtitle="Publish custom Return, Refund, Shipping, and Privacy policy pages for your storefront."
      badge="Legal & Trust"
      progress={75}
      backHref="/dashboard/myshop/manage"
      backLabel="Back to Manage Shop"
    />
  );
}
