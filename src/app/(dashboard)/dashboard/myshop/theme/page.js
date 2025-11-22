import { userInfo } from "@/lib";
import CustomizeTheme from "../_component/CustomizeTheme";
import { getThemeQuery } from "@/queries/theme";

const page = async () => {
  const user = await userInfo();
  const themeInfo = await getThemeQuery(user);

  return (
    <>
      <CustomizeTheme user={user} themeInfo={themeInfo} />
    </>
  );
};

export default page;
