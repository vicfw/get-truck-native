import { CommonActions, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import React, { useMemo, useState } from "react";
import { Platform } from "react-native";
import { LatLng } from "react-native-maps";
import Toast from "react-native-toast-message";
import { baseUrl } from "../constants/Api";
import Colors, { truckColors } from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import {
  useGetSingleAdQuery,
  useUpdateAdMutation,
} from "../redux/services/adService";
import { useGetAllCategoriesWithoutChildrenQuery } from "../redux/services/categoryService";
import { CreateOrUpdateAdBody } from "../redux/services/types/ad.types";
import { CategoriesWithoutChildrenResponse } from "../redux/services/types/category.types";
import { RootStackParamList } from "../types";
import { getYearsArray } from "../utils/getAllYears";
import { Category } from "./../globalTypes";

export const useEditModal = (
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "EditModal",
    undefined
  >,
  route: RouteProp<RootStackParamList, "EditModal">
) => {
  const [uploadPhotoIsLoading, setUploadPhotoIsLoading] = useState(false);
  const [updateAd] = useUpdateAdMutation();
  const { data: adData } = useGetSingleAdQuery({ adId: route.params.adId });
  const { data: categoryData } = useGetAllCategoriesWithoutChildrenQuery();
  const randomId = React.useId();
  const [uiImages, setUiImages] = useState<string[]>([]);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [openSpecs, setOpenSpecs] = useState(false);
  const [trucksCategoryId, setTrucksCategoryId] = useState("");
  const [filterTrailerCategoryId, setFilterTrailerCategoryId] = useState("");
  const [createImages, setCreateImages] = useState<{
    lg: string[];
    xs: string[];
    md: string[];
  } | null>(null);
  const [dropdownData, setDropdownData] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });
  const years = getYearsArray();
  const exteriorColors = useMemo(() => truckColors, []);
  const formInitialValues = useMemo(() => {
    return {
      title: adData?.ad.title ?? "",
      description: adData?.ad.description ?? "",
      category: (adData?.ad.category as Category)._id,
      year: adData?.ad.year,
      price: adData?.ad.price ?? undefined,
      facebook: adData?.ad.socialMedia?.facebook,
      instagram: adData?.ad.socialMedia?.instagram,
      twitter: adData?.ad.socialMedia?.twitter,
      youtube: adData?.ad.socialMedia?.youtube,
      tiktok: adData?.ad.socialMedia?.tiktok,
      pinterest: adData?.ad.socialMedia?.pinterest,
      linkedin: adData?.ad.socialMedia?.linkedin,
      saleBy: adData?.ad.saleBy ?? "all",
      condition: adData?.ad.condition!,
      phone: adData?.ad.phone ?? undefined,
      brand: adData?.ad.brand,
      kilometers: adData?.ad.kilometers,
      transmission: adData?.ad.transmission,
      wheels: adData?.ad.wheels,
      engineHP: adData?.ad.engineHP ?? "",
      engine: adData?.ad.engine ?? "",
      exteriorColor: adData?.ad.exteriorColor ?? "",
      differential: adData?.ad.differential ?? "",
      frontAxel: adData?.ad.frontAxel ?? "",
      realAxel: adData?.ad.realAxel ?? "",
      suspension: adData?.ad.suspension ?? "",
      wheelbase: adData?.ad.wheelbase ?? "",
    };
  }, [categoryData]);
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
  const pickImage = async () => {
    if (uiImages.length >= 10) {
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled) {
        const data = new FormData();
        setUploadPhotoIsLoading(true);

        const photo = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { height: 700, width: 700 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        const newImageUri =
          Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri;
        // @ts-ignore
        data.append("image", {
          // @ts-ignore
          name: randomId,
          type: mime.getType(photo.uri)!,
          uri: newImageUri,
        });
        try {
          const json = await fetch(`${baseUrl}/upload/adImage`, {
            body: data,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            method: "post",
          });
          const uploadPhotoData = await json.json();
          if (uploadPhotoData.status === "success") {
            setUiImages((perv) => [...perv, photo.uri]);
            setCreateImages((perv) => {
              return {
                lg: perv?.lg.length
                  ? [...perv?.lg, uploadPhotoData.data.lg.Location]
                  : [uploadPhotoData.data.lg.Location],
                md: perv?.md.length
                  ? [...perv?.md, uploadPhotoData.data.md.Location]
                  : [uploadPhotoData.data.md.Location],
                xs: perv?.xs.length
                  ? [...perv?.xs, uploadPhotoData.data.xs.Location]
                  : [uploadPhotoData.data.xs.Location],
              };
            });
          }
          setUploadPhotoIsLoading(false);
        } catch (e) {
          console.log(e, "error");
        }
      }
    } catch (e) {
      console.log(e, "image picker error");
    }
  };
  const updateAdHandler = async (values: typeof formInitialValues) => {
    if (!createImages?.xs.length) {
      return Toast.show({
        type: "error",
        text1: "Please add an image",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
    const body: CreateOrUpdateAdBody = {
      ...values,
      socialMedia: {
        facebook: values.facebook,
        instagram: values.instagram,
        linkedin: values.linkedin,
        pinterest: values.pinterest,
        tiktok: values.tiktok,
        twitter: values.twitter,
        youtube: values.youtube,
      },
      adImages: createImages,
      ...(route.params.lat
        ? {
            address: {
              latitude: route.params.lat,
              longitude: route.params.lng,
              address: route.params.address,
            },
          }
        : undefined),
    };
    let propName: keyof typeof body;
    for (propName in body) {
      if (
        body[propName] === "" ||
        body[propName] === undefined ||
        !body[propName]
      ) {
        delete body[propName];
      }
    }
    const result = await updateAd({ body, adId: route.params.adId }).unwrap();
    if (result.status === "success") {
      Toast.show({
        text1: "Ad updated successfully.",
        autoHide: true,
        visibilityTime: 5000,
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "PostAd" }],
        })
      );
      setCreateImages(null);
      setUiImages([]);
      // @ts-ignore
      navigation.navigate("Home");
    } else {
      Toast.show({
        text1: "Someting went wrong!",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
  };
  const handleRemovePhotos = (index: number) => {
    setUiImages((perv) => perv.filter((_photo, i) => i !== index));
    // @ts-ignore
    setCreateImages((perv) => {
      let newPerv = { ...perv };
      let size: keyof typeof newPerv;
      for (size in newPerv) {
        newPerv[size] = newPerv[size]!.filter((_photo, i) => i !== index);
      }
      return newPerv;
    });
  };
  const findParent = (
    selectedCategoryId: string
  ): CategoriesWithoutChildrenResponse | undefined => {
    let category = categoryData?.find((cat) => cat._id === selectedCategoryId);
    if (category?.parentId) {
      const parent = categoryData?.find(
        (cat) => cat._id === category?.parentId
      );
      if (parent?._id) {
        category = findParent(parent?._id);
      }
    }
    return category;
  };
  React.useEffect(() => {
    const mappedData = categoryData?.map((dt) => {
      return { label: dt.name, value: dt._id };
    });
    const filteredData = categoryData?.filter(
      (dt) => dt.name.toLowerCase() === "trucks"
    );

    if (filteredData?.length) {
      setTrucksCategoryId(filteredData[0]._id ?? "");
    }
    const filterTrailerCategoryId = categoryData?.find(
      (dt) =>
        dt.name.toLowerCase() === "trailers" ||
        dt.name.toLowerCase() === "trailer"
    );
    if (filterTrailerCategoryId) {
      setFilterTrailerCategoryId(filterTrailerCategoryId?._id);
    }
    setDropdownData(mappedData);
  }, [categoryData]);
  React.useEffect(() => {
    if (adData) {
      setUiImages(adData.ad.adImages.xs);
      setCreateImages(adData.ad.adImages);
      setLocation(
        adData.ad.address?.latitude
          ? adData.ad.address
          : { latitude: 43.6532, longitude: -79.3832 }
      );
    }
  }, [adData]);
  return {
    get: {
      uploadPhotoIsLoading,
      openSocialMedia,
      uiImages,
      createImages,
      dropdownData,
      trucksCategoryId,
      filterTrailerCategoryId,
      formInitialValues,
      selectPickerStyles,
      years,
      location,
      showMap,
      openSpecs,
      exteriorColors,
    },
    set: { setLocation, setShowMap, setOpenSpecs, setOpenSocialMedia },
    on: { pickImage, updateAdHandler, handleRemovePhotos, findParent },
  };
};
