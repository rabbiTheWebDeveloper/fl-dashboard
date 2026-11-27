import ComingSoonCard from "@/app/(dashboard)/_component/ComingSoonCard";

export default function SmsSupportPage() {
  return (
    <ComingSoonCard
      title="Automated SMS Notifications"
      subtitle="Send instant order confirmation, courier tracking, and OTP alerts to your customers via Bangladeshi SMS gateways."
      badge="SMS Automation"
      progress={80}
      backHref="/dashboard/myshop/manage"
      backLabel="Back to Manage Shop"
    />
  );
}
