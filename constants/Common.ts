import { Appearance } from "react-native";
const theme = Appearance.getColorScheme();

export const AndroidBannerUnitId = "ca-app-pub-5191028754472941/3312863357";
export const themeRenderer = (ifDarkColor: string, ifLightColor: string) => {
  return theme === "dark" ? ifDarkColor : ifLightColor;
};
