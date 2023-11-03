import { Platform } from "react-native";
import { getLocalStorageData } from "../redux/services/deviceStorage";

// export const baseUrl =
//   Platform.OS === "ios"
//     ? "http://localhost:3000/api/v1"
//     : "http://10.0.2.2:3000/api/v1";

// export const URL =
//   Platform.OS === "ios" ? "http://localhost:3000" : "http://10.0.2.2:3000";

export const baseUrl = "https://api.gettruckloan.com/api/v1";
export const URL = "https://api.gettruckloan.com";

export const authHeader = async () => {
  const token = await getLocalStorageData("token");

  return {
    authorization: token ? "Bearer " + token : "",
  };
};
