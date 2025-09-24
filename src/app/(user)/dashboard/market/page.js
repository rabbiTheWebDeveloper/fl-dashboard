import React from "react";
import Market from "./_component/Market";
import { getCards } from "@/queries/card";
import { cookies } from "next/headers";
import { getUsersBalance } from "@/queries/user";
export const dynamic = 'force-dynamic'

const page = async () => {
  const cookieStore = await cookies();
  const cookieUser = cookieStore.get("user");
  const user = JSON.parse(cookieUser.value);
  const getCardsList = await getCards();
  const balance = await getUsersBalance(user._id);

  return (
    <>
      <Market getCardsList={getCardsList} balance={balance} />
    </>
  );
};

export default page;
