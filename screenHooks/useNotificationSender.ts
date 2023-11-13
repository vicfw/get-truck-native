import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useGetAllCategoriesWithoutChildrenQuery } from "../redux/services/categoryService";
import {
  useCreateNotificationSenderMutation,
  useDeleteNotificationForSendMutation,
  useGetNotificationForSendQuery,
  useUpdateNotificationSenderMutation,
} from "../redux/services/notificationsenderService";
import { CategoriesWithoutChildrenResponse } from "../redux/services/types/category.types";
import { getYearsArray } from "../utils/getAllYears";

export const useNotificationSender = () => {
  const [dropdownData, setDropdownData] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [trucksCategoryId, setTrucksCategoryId] = useState("");
  const [trailerCategoryId, setTrailerCategoryId] = useState("");

  const { data: categoriesData } = useGetAllCategoriesWithoutChildrenQuery();
  const { data: notificationsToSend, isFetching: notificationSenderLoading } =
    useGetNotificationForSendQuery();
  const [
    createNotificationSender,
    { isLoading: createNotificationSenderLoading },
  ] = useCreateNotificationSenderMutation();
  const [
    updateNotificationSender,
    { isLoading: updateNotificationSenderLoading },
  ] = useUpdateNotificationSenderMutation();
  const [
    deleteNotificationSender,
    { isLoading: deleteNotificationSenderLoading },
  ] = useDeleteNotificationForSendMutation();

  const formInitialValues = useMemo(() => {
    return {
      category: notificationsToSend?.data?.categoryId ?? "",
      minYear: notificationsToSend?.data?.minYear ?? "",
      maxYear: notificationsToSend?.data?.maxYear ?? "",
      brand: notificationsToSend?.data?.brand ?? "",
      minKilometers: notificationsToSend?.data?.minKilometers ?? 0,
      maxKilometers: notificationsToSend?.data?.maxKilometers ?? 0,
    };
  }, [notificationsToSend]);

  const years = getYearsArray();

  const selectPickerStyles = useMemo(() => {
    return {
      placeholder: {
        color: themeRenderer("#fff", Colors["gray-500"]),
        fontSize: 14,
      },
      iconContainer: {
        top: Platform.OS === "android" ? 14 : 17,
        right: 10,
      },
      inputAndroid: {
        color: themeRenderer("#fff", Colors["gray-500"]),
        fontSize: 14,
        paddingHorizontal: 13,
        paddingVertical: 10,
      },
      inputIOS: {
        color: themeRenderer("#fff", Colors["gray-500"]),
        fontSize: 14,
        paddingVertical: 18,
        paddingHorizontal: 13,
      },
    };
  }, []);

  function findParent(
    selectedCategoryId: string
  ): CategoriesWithoutChildrenResponse | undefined {
    let category = categoriesData?.find(
      (cat) => cat._id === selectedCategoryId
    );

    if (category?.parentId) {
      const parent = categoriesData?.find(
        (cat) => cat._id === category?.parentId
      );
      if (parent?._id) {
        category = findParent(parent?._id);
      }
    }

    return category;
  }

  async function onCreateNotificationSender(values: typeof formInitialValues) {
    // if there is an id => its update
    if (notificationsToSend?.data?._id) {
      try {
        const response = await updateNotificationSender({
          body: {
            brand: values.brand,
            categoryId: values.category as string,
            ...(values.minKilometers
              ? { kilometers: values.minKilometers }
              : undefined),
            ...(values.maxKilometers
              ? { kilometers: values.maxKilometers }
              : undefined),
            minYear: parseInt(values.minYear as string),
            maxYear: parseInt(values.maxYear as string),
          },
          notificationSenderId: notificationsToSend.data._id,
        }).unwrap();

        if (response.status === "success") {
          Toast.show({
            text1: "Notification tracker updated successfully.",
            text2: "we will send notification if we find a match.",
            autoHide: true,
            visibilityTime: 5000,
          });
        }
      } catch (e) {
        Toast.show({
          text1: "Something went wrong!",
          autoHide: true,
          visibilityTime: 5000,
        });
      }
      return;
    }
    try {
      const response = await createNotificationSender({
        brand: values.brand,
        categoryId: values.category as string,
        ...(values.minKilometers
          ? { minKilometers: values.minKilometers }
          : undefined),
        ...(values.maxKilometers
          ? { maxKilometers: values.maxKilometers }
          : undefined),
        minYear: parseInt(values.minYear as string),
        maxYear: parseInt(values.maxYear as string),
      }).unwrap();

      if (response.status === "success") {
        Toast.show({
          text1: "Notification tracker created successfully.",
          text2: "we will send notification if we find a match.",
          autoHide: true,
          visibilityTime: 5000,
        });
      }
    } catch (e) {
      Toast.show({
        text1: "Something went wrong!",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
  }

  async function deleteNotificationSenderHandler(id: string) {
    try {
      const response = await deleteNotificationSender({ id }).unwrap();
      if (response.status === "success") {
        Toast.show({
          text1: "Notification tracker deleted successfully.",
          autoHide: true,
          visibilityTime: 5000,
        });
      }
    } catch (e) {
      Toast.show({
        text1: "Something went wrong!",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
  }

  useEffect(() => {
    const mappedData = categoriesData?.map((dt) => {
      return { label: dt.name, value: dt._id };
    });

    //set trucks category Id
    const filteredData = categoriesData?.filter(
      (dt) =>
        dt.name.toLowerCase() === "trucks" || dt.name.toLowerCase() === "truck"
    );

    if (filteredData?.length) {
      setTrucksCategoryId(filteredData[0]._id);
    }

    //set trailers category Id
    const filterTrailerCategoryId = categoriesData?.find(
      (dt) =>
        dt.name.toLowerCase() === "trailers" ||
        dt.name.toLowerCase() === "trailer"
    );

    if (filterTrailerCategoryId) {
      setTrailerCategoryId(filterTrailerCategoryId?._id);
    }

    setDropdownData(mappedData);
  }, [categoriesData]);
  return {
    get: {
      notificationSenderLoading,
      formInitialValues,
      selectPickerStyles,
      dropdownData,
      years,
      trailerCategoryId,
      trucksCategoryId,
      notificationsToSend: notificationsToSend?.data,
      createNotificationSenderLoading,
      updateNotificationSenderLoading,
      deleteNotificationSenderLoading,
    },
    set: {},
    on: {
      onCreateNotificationSender,
      findParent,
      deleteNotificationSenderHandler,
    },
  };
};
