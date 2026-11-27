/**
 * Unified Bangladesh Send-Money + TrxID Verification Payment Gateway Configuration
 * Default Receiver Number: 01726278251 (Send Money across bKash, Nagad, Rocket, Upay, GPay)
 */

export const DEFAULT_GATEWAY_NUMBER = "01726278251";

export const SEND_MONEY_GATEWAYS = [
  {
    id: "bKash",
    key: "bkash",
    name: "bKash",
    bnName: "বিকাশ",
    logo: "/images/gateways/bkash.png",
    mode: "Send Money (Personal)",
    defaultNumber: DEFAULT_GATEWAY_NUMBER,
    ussd: "*247#",
    accent: "#E2136E",
    softBg: "rgba(226, 19, 110, 0.08)",
    border: "rgba(226, 19, 110, 0.3)",
    steps: [
      "Open your bKash App or dial *247#",
      "Tap 'Send Money' (সেন্ড মানি)",
      "Enter receiver number: 01726278251",
      "Enter the exact payable amount and confirm with your bKash PIN",
      "Copy the Transaction ID (TrxID) from the confirmation screen/SMS and submit below",
    ],
  },
  {
    id: "Nagad",
    key: "nagad",
    name: "Nagad",
    bnName: "নগদ",
    logo: "/images/gateways/nagad.png",
    mode: "Send Money (Personal)",
    defaultNumber: DEFAULT_GATEWAY_NUMBER,
    ussd: "*167#",
    accent: "#F7941D",
    softBg: "rgba(247, 148, 29, 0.09)",
    border: "rgba(247, 148, 29, 0.35)",
    steps: [
      "Open your Nagad App or dial *167#",
      "Choose 'Send Money' (সেন্ড মানি)",
      "Enter receiver number: 01726278251",
      "Enter the exact payable amount and confirm with your Nagad PIN",
      "Copy the Transaction ID (TxnID) and submit below for verification",
    ],
  },
  {
    id: "Rocket",
    key: "rocket",
    name: "Rocket",
    bnName: "রকেট",
    logo: "/images/gateways/rocket.png",
    mode: "Send Money (Personal)",
    defaultNumber: DEFAULT_GATEWAY_NUMBER,
    ussd: "*322#",
    accent: "#8C3494",
    softBg: "rgba(140, 52, 148, 0.08)",
    border: "rgba(140, 52, 148, 0.32)",
    steps: [
      "Open DBBL NexusPay / Rocket App or dial *322#",
      "Select 'Send Money'",
      "Enter receiver number: 01726278251",
      "Enter the exact payable amount and confirm with your Rocket PIN",
      "Copy the Transaction ID (TxnId) from your SMS and submit below",
    ],
  },
  {
    id: "Upay",
    key: "upay",
    name: "Upay",
    bnName: "উপায়",
    logo: "/images/gateways/upay.png",
    mode: "Send Money (Personal)",
    defaultNumber: DEFAULT_GATEWAY_NUMBER,
    ussd: "*268#",
    accent: "#0054A6",
    softBg: "rgba(0, 84, 166, 0.08)",
    border: "rgba(0, 84, 166, 0.3)",
    steps: [
      "Open your Upay App or dial *268#",
      "Select 'Send Money' (সেন্ড মানি)",
      "Enter receiver number: 01726278251",
      "Enter the exact payable amount and confirm with your Upay PIN",
      "Copy the Transaction ID (TrxID) and submit below for verification",
    ],
  },
  {
    id: "GPay",
    key: "gpay",
    name: "GPay",
    bnName: "জিপে",
    logo: "/images/gateways/gpay.png",
    mode: "Send Money (Wallet)",
    defaultNumber: DEFAULT_GATEWAY_NUMBER,
    ussd: "*777#",
    accent: "#0078D4",
    softBg: "rgba(0, 120, 212, 0.08)",
    border: "rgba(0, 120, 212, 0.3)",
    steps: [
      "Open your GPay Wallet App (or dial *777#)",
      "Select 'Send Money / Transfer'",
      "Enter receiver number: 01726278251",
      "Enter the exact payable amount and confirm with your PIN",
      "Copy the Transaction ID (TrxID) and submit below for verification",
    ],
  },
];

export function getGatewayByMethod(method = "") {
  const key = String(method || "").trim().toLowerCase();
  if (!key) return null;
  return (
    SEND_MONEY_GATEWAYS.find(
      (g) => g.key === key || g.id.toLowerCase() === key
    ) || null
  );
}

export const BD_SENDER_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
export const TRX_ID_REGEX = /^[A-Za-z0-9_-]{5,32}$/;

export function normalizeSenderPhone(raw = "") {
  const digits = String(raw).replace(/[\s-]/g, "").trim();
  const match = digits.match(/^(?:\+?88)?(01[3-9]\d{8})$/);
  return match ? match[1] : "";
}

export function normalizeTrxId(raw = "") {
  return String(raw).trim().toUpperCase();
}
