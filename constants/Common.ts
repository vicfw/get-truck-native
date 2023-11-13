import { Appearance } from "react-native";
const theme = Appearance.getColorScheme();
export const themeRenderer = (ifDarkColor: string, ifLightColor: string) => {
  return theme === "dark" ? ifDarkColor : ifLightColor;
};
