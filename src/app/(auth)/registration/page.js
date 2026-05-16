import Register from "./_component/Register";
export const metadata = {
  title: "রেজিস্ট্রেশন | AMARDokan",
  description: "আজই AMARDokan-এ আপনার অনলাইন দোকান খুলুন এবং আপনার ব্যবসা সম্প্রসারণ করুন।",
  openGraph: {
    title: "রেজিস্ট্রেশন | AMARDokan",
    description: "আজই আপনার অনলাইন দোকান খুলুন",
  },
};


export default async function RegistrationPage() {
  return (
    <>
      <Register />
    </>
  );
}
