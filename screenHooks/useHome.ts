import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { Ad } from "../globalTypes";
import { handleAddNotificationToken } from "../redux/features/userSlice";
import {
  useGetAllAdsQuery,
  useSearchAdQuery,
} from "../redux/services/adService";
import { useGetLastFourCategoriesQuery } from "../redux/services/categoryService";
import { useGetBannerQuery } from "../redux/services/layout";
import {
  useCreateSavedSearchMutation,
  useDeleteSavedSearchMutation,
  useGetSavedSearchQuery,
} from "../redux/services/savedSearch";
import {
  useMeQuery,
  useUpdateUserMutation,
} from "../redux/services/userServices";
import { RootStackParamList } from "../types";
import { useDebounce } from "../utils/hook/useDebounce";
import { useAppDispatch } from "./../redux/hooks";

export const useHome = (
  navigation: NativeStackNavigationProp<RootStackParamList, "Home", undefined>,
  route: any
) => {
  const dispatch = useAppDispatch();
  const [timeOfDay, setTimeOfDay] = useState("");
  const [isReachEnd, setIsReachEnd] = useState(false);
  const [adData, setAdData] = useState<Ad[] | []>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery: string = useDebounce<string>(query, 500);
  const savedSearchTerms = useRef<string[] | undefined>();
  const [numColumns, setNumColumns] = useState(2);
  const [keyCounter, setKeyCounter] = useState(0);
  const changeColumns = (column: number) => {
    setNumColumns(column);
    setKeyCounter((perv) => perv + 1);
  };
  const [pagination, setPagination] = useState<{
    limit: number;
    page: number;
  }>({ limit: 6, page: 0 });
  const { data: bannerData } = useGetBannerQuery();
  const { data: userData, refetch: meQueryRefetch } = useMeQuery();
  const {
    currentData: searchData,
    isLoading: searchIsLoading,
    isFetching: searchIsFetching,
  } = useSearchAdQuery({ query: debouncedQuery }, { skip: !debouncedQuery });

  const { data: lastFourCategoryData } = useGetLastFourCategoriesQuery();
  const [updateUserToken] = useUpdateUserMutation();
  const [deleteSavedSearch] = useDeleteSavedSearchMutation();
  const [createSavedSearch] = useCreateSavedSearchMutation();
  const { data: savedSearchData, isLoading: savedSearchIsLoading } =
    useGetSavedSearchQuery({ count: "5" });
  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      dispatch(handleAddNotificationToken(token));
      if (!userData?.data.notificationToken) {
        await updateUserToken({
          notificationToken: token,
        });
      }
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (e) {
      console.log(e, "error in notification function placed in useHome file");
    }
  };
  const handleSearch = (value: string) => {
    setQuery(value);
  };
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const {
    data: allAds,
    isLoading: adDataLoading,
    refetch,
    isFetching: adDataFetching,
  } = useGetAllAdsQuery(
    { ...pagination!, ...{ isApproved: true }, ...route.params?.filterData },
    { refetchOnMountOrArgChange: true }
  );
  const handleLoadMore = () => {
    if (allAds?.totalCount === adData.length) return;
    if (adDataFetching || adDataLoading) return;
    setPagination((perv) => ({ ...perv, page: perv.page! + 1 }));
  };
  const onRefresh = () => {
    setPagination((perv) => ({ ...perv, page: 1 }));
    navigation.setParams({ filterData: undefined });
    refetch();
    setAdData(allAds?.ads!);
  };
  const handleClickSearchTerm = (searchTerm: string) => {
    setQuery(searchTerm);
  };
  const handleDeleteSavedSearch = (savedSearchId: string) => {
    deleteSavedSearch({ savedSearchId });
  };
  const handleCreateSavedSearch = async () => {
    try {
      await createSavedSearch({
        searchTerm: debouncedQuery,
      });
      Toast.show({
        text1: "Successfully add to your saved search list!",
        autoHide: true,
        visibilityTime: 5000,
      });
    } catch (e) {
      Toast.show({
        text1: "Something went wrong",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
  };
  useEffect(() => {
    if (adData?.length && pagination.page > 0) {
      setAdData((perv) => [...perv, ...allAds?.ads!]);
    } else {
      setAdData(allAds?.ads!);
    }
  }, [allAds]);
  useEffect(() => {
    if (route.params?.searchTerm?.length) {
      setQuery(route.params?.searchTerm ?? "");
    }
    return () => {
      setQuery("");
    };
  }, [route.params?.searchTerm]);
  useEffect(() => {
    savedSearchTerms.current = savedSearchData?.data.map(
      (saved) => saved.searchTerm
    );
  }, [savedSearchData?.data]);
  useEffect(() => {
    if (route.params?.filterData) {
      setPagination((perv) => ({ ...perv, page: 1 }));
    }
    setTimeOfDay(getTimeOfDay());
    refetch();
    registerForPushNotificationsAsync();
  }, []);
  return {
    get: {
      adData,
      adDataLoading,
      pagination,
      adDataFetching,
      query,
      searchData,
      searchIsFetching,
      searchIsLoading,
      lastFourCategoryData: lastFourCategoryData?.data,
      savedSearchData,
      savedSearchIsLoading,
      savedSearchTerms,
      numColumns,
      timeOfDay,
      userData,
      isReachEnd,
      keyCounter,
      bannerData,
    },
    set: { setPagination, setAdData, setQuery, setIsReachEnd },
    on: {
      handleLoadMore,
      onRefresh,
      handleSearch,
      changeColumns,
      handleClickSearchTerm,
      handleDeleteSavedSearch,
      handleCreateSavedSearch,
    },
  };
};
