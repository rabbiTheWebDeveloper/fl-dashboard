import Login from "./_component/Login";
export const metadata = {
  title: "লগইন | AMARDokan",
  description: "আপনার AMARDokan অ্যাকাউন্টে লগইন করুন এবং আপনার অনলাইন ব্যবসা পরিচালনা শুরু করুন।",
  openGraph: {
    title: "লগইন | AMARDokan",
    description: "আপনার AMARDokan অ্যাকাউন্টে লগইন করুন",
  },
};

export default function Page() {
  return (
    <>
      <Login />
    </>
  );
}
