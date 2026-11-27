import ComingSoonCard from "@/app/(dashboard)/_component/ComingSoonCard";

export default function ChatSupportPage() {
  return (
    <ComingSoonCard
      title="Live Chat & Messenger Integration"
      subtitle="Connect WhatsApp, Messenger, and live storefront chat widgets to convert visitors faster."
      badge="Customer Support"
      progress={78}
      backHref="/dashboard/myshop/manage"
      backLabel="Back to Manage Shop"
    />
  );
}
