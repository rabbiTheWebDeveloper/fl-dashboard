import { getInvoiceForGatewayCheckoutQuery } from "@/queries/billing";
import HostedGatewayClient from "./_component/HostedGatewayClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Gateway Checkout",
  description:
    "Send Money to 01726278251 via bKash, Nagad, Rocket, Upay, or GPay and submit your Transaction ID (TrxID) for verification.",
};

export default async function HostedPaymentGatewayPage({ params }) {
  const resolvedParams = await params;
  const invoiceId = resolvedParams?.invoiceId || "";
  const data = await getInvoiceForGatewayCheckoutQuery(invoiceId);

  return (
    <HostedGatewayClient
      initialInvoice={data?.invoice || null}
      gateways={data?.gateways || []}
    />
  );
}
