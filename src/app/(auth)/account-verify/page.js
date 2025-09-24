import VerifyEmail from "./_component/VerifyEmail";

export default async function VerifyPage({ searchParams }) {
   const { email } = await searchParams; 

  console.log("Email from query:", email);

  console.log("Email from query:", email);
  return (
    <>
      <VerifyEmail />
    </>
  );
}
