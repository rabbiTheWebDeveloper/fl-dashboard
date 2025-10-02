import { cookies } from "next/headers";

export const userInfo = async () => {
  // cookies().get("user") returns { name, value } | undefined
  const userCookie = cookies().get("user");

  if (!userCookie?.value) return {};  // safe check

  let parsed;
  try {
    parsed = JSON.parse(userCookie.value);
  } catch (e) {
    return {}; // invalid cookie data
  }

  const { shops, id } = parsed;
  if (!shops) return {};

  return {
    shopId: shops?._id || null,
    userId: id || null,
  };
};
