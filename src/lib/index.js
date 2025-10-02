import { cookies } from "next/headers";

export const userInfo = async () => {
  const user = await cookies().get("user")?.value;
  if (!user) return null;
  const { shops, id } = JSON.parse(user);
  if (!shops) return null;
  return {
    shopId: shops?._id,
    userId: id,
  };
};
