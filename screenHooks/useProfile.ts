import { Dimensions } from "react-native";
import { useMeQuery } from "../redux/services/userServices";

export const useProfile = () => {
  const { data: me, refetch, isLoading, isFetching } = useMeQuery();

  const width = Dimensions.get("window").width;

  return {
    get: { width, me: me?.data, isLoading, isFetching },
    set: {},
    on: { refetch },
  };
};
