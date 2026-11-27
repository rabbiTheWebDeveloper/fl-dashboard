import ComingSoonCard from "@/app/(dashboard)/_component/ComingSoonCard";

export default function LandingPagesPage() {
  return (
    <ComingSoonCard
      title="Landing Page Builder Coming Soon"
      subtitle="Launch high-converting single-product sales funnels and campaign landing pages in minutes."
      badge="Funnel Builder"
      progress={82}
      backHref="/dashboard/myshop/manage"
      backLabel="Back to Manage Shop"
    />
  );
}
