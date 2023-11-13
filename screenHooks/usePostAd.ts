import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import React, { useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { baseUrl } from "../constants/Api";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useCreateAdMutation } from "../redux/services/adService";
import { useGetAllCategoriesWithoutChildrenQuery } from "../redux/services/categoryService";
import { CreateOrUpdateAdBody } from "../redux/services/types/ad.types";
import { CategoriesWithoutChildrenResponse } from "../redux/services/types/category.types";
import { useUploadAdPhotoMutation } from "../redux/services/uploadService";
import { RootStackParamList } from "../types";
import { getYearsArray } from "../utils/getAllYears";
import { truckColors } from "./../constants/Colors";

export const usePostAd = (
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList, "PostAd", undefined>,
    NativeStackNavigationProp<RootStackParamList>
  >,
  route: RouteProp<RootStackParamList, "PostAd">
) => {
  const [uploadPhotoIsLoading, setUploadPhotoIsLoading] = useState(false);
  const [uploadPhoto] = useUploadAdPhotoMutation();
  const [createAd, { isLoading: createAdIsLoading, error }] =
    useCreateAdMutation();

  const { data } = useGetAllCategoriesWithoutChildrenQuery();

  const randomId = React.useId();
  const [uiImages, setUiImages] = useState<string[]>([]);
  const [openSpecs, setOpenSpecs] = useState(false);
  const [openSocialMedia, setOpenSocialMedia] = useState(false);
  const [trucksCategoryId, setTrucksCategoryId] = useState("");
  const [trailerCategoryId, setTrailerCategoryId] = useState("");

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

  const years = getYearsArray();

  const formInitialValues = useRef<any>();

  const exteriorColors = useMemo(() => truckColors, []);

  formInitialValues.current = {
    title: "",
    description: "",
    category: "",
    year: "",
    price: undefined,
    // saleBy: "",
    condition: "",
    phone: undefined,
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    pinterest: "",
    linkedin: "",
    brand: "",
    kilometers: 0,
    transmission: "",
    engineHP: "",
    engine: "",
    exteriorColor: "",
    differential: "",
    frontAxel: "",
    realAxel: "",
    suspension: "",
    wheelbase: "",
    wheels: "",
  };

  const findParent = (
    selectedCategoryId: string
  ): CategoriesWithoutChildrenResponse | undefined => {
    let category = data?.find((cat) => cat._id === selectedCategoryId);

    if (category?.parentId) {
      const parent = data?.find((cat) => cat._id === category?.parentId);
      if (parent?._id) {
        category = findParent(parent?._id);
      }
    }

    return category;
  };

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
          setUploadPhotoIsLoading(false);

          console.log(e, "error");
        }
      }
    } catch (e) {
      console.log(e, "image picker error");
    }
  };

  const createAdHandler = async (values: any, resetForm: any) => {
    if (!createImages?.xs.length) {
      return Toast.show({
        type: "error",
        text1: "Please add an image",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
    const images = {
      xs: createImages.xs,
      md: createImages.md,
      lg: createImages.lg,
    };
    // @ts-ignore
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
      adImages: images,
      ...(route?.params?.lat
        ? {
            address: {
              latitude: route.params.lat,
              longitude: route.params.lng,
              address: route.params.address,
            },
          }
        : undefined),
    };

    // remove empty strings
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

    const result = await createAd(body).unwrap();

    if (result.status === "success") {
      Toast.show({
        text1: "Ad created successfully.",
        text2: "it will be published after approved.",
        autoHide: true,
        visibilityTime: 5000,
      });
      resetForm();
      setCreateImages(null);
      setOpenSocialMedia(false);
      setOpenSpecs(false);
      setUiImages([]);
      navigation.navigate("Home", {
        filterData: undefined,
      });
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
  };

  const toggleOpenSpecs = () => {
    setOpenSpecs(!openSpecs);
  };

  React.useEffect(() => {
    const mappedData = data?.map((dt) => {
      return { label: dt.name, value: dt._id };
    });

    //set trucks category Id
    const filteredData = data?.filter(
      (dt) =>
        dt.name.toLowerCase() === "trucks" || dt.name.toLowerCase() === "truck"
    );

    if (filteredData?.length) {
      setTrucksCategoryId(filteredData[0]._id);
    }

    //set trailers category Id
    const filterTrailerCategoryId = data?.find(
      (dt) =>
        dt.name.toLowerCase() === "trailers" ||
        dt.name.toLowerCase() === "trailer"
    );

    if (filterTrailerCategoryId) {
      setTrailerCategoryId(filterTrailerCategoryId?._id);
    }

    setDropdownData(mappedData);
  }, [data]);

  return {
    get: {
      uploadPhotoIsLoading,
      uiImages,
      createImages,
      dropdownData,
      trucksCategoryId,
      createAdIsLoading,
      formInitialValues,
      selectPickerStyles,
      trailerCategoryId,
      years,
      openSpecs,
      exteriorColors,
      openSocialMedia,
    },
    set: { setOpenSpecs, setOpenSocialMedia },
    on: {
      pickImage,
      createAd,
      createAdHandler,
      handleRemovePhotos,
      findParent,
      toggleOpenSpecs,
    },
  };
};
