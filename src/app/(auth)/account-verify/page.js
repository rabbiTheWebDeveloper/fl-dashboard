import VerifyEmail from "./_component/VerifyEmail";

export default function VerifyPage({ searchParams }) {
  const email = searchParams.email;

  console.log("Email from query:", email);
  return (
    <>
      <VerifyEmail />
    </>
  );
}
