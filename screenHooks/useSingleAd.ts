import { CreateFeaturedAd } from "./../redux/services/types/featuredAd.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Animated, Dimensions, Alert } from "react-native";
import {
  useDeleteAdMutation,
  useGetSingleAdQuery,
} from "../redux/services/adService";
import { RootStackParamList } from "../types";
import {
  useCreateFeaturedAdMutation,
  useDeleteFeaturedAdMutation,
} from "../redux/services/featuredAdService";
import { useMeQuery } from "../redux/services/userServices";
import { Share } from "react-native";

export const useSingleAdScreen = (
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "SingleAd",
    undefined
  >,
  adId: string
) => {
  const [headerShown, setHeaderShown] = React.useState(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState(1);
  const [isFeaturedAd, setIsFeaturedAd] = React.useState<boolean | undefined>(
    false
  );
  const [modalVisible, setModalVisible] = React.useState({
    show: false,
    activeImageIndex: 0,
  });

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  //get current user
  const { data: user } = useMeQuery();

  //get single ad
  const { data: adData, isLoading: getSingleAdIsLoading } = useGetSingleAdQuery(
    { adId }
  );

  //delete ad
  const [deleteAd] = useDeleteAdMutation();

  // add to featured list of user
  const [createFeaturedAd] = useCreateFeaturedAdMutation();

  //delete featured ad from user
  const [deleteFeaturedAd] = useDeleteFeaturedAdMutation();

  const createFeaturedAdHandler = async () => {
    try {
      await createFeaturedAd({ ad: adId });
      setIsFeaturedAd(true);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFeaturedAdHandler = async () => {
    try {
      const featureAdId = user?.data.featuredAds.find(
        (ad) => ad.ad === adId
      )?._id;

      if (featureAdId) {
        const deleted = await deleteFeaturedAd({ featuredAdId: featureAdId });

        setIsFeaturedAd(false);
      }
    } catch (e) {
      setIsFeaturedAd(true);
    }
  };

  const deleteAdHandler = async () => {
    try {
      await deleteAd({ id: adId }).unwrap();
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      navigation.navigate("Profile");
    } catch (e) {}
  };

  const deleteAdModal = () =>
    Alert.alert("Are You Sure To Delete Your Ad ?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Yes", onPress: () => deleteAdHandler() },
    ]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: headerShown ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [headerShown]);

  React.useEffect(() => {
    const _isFeaturedAd = user?.data.featuredAds.some(
      (featuredAd) => featuredAd.ad === adId
    );
    setIsFeaturedAd(_isFeaturedAd);
  }, [user]);

  const width = Dimensions.get("window").width;

  const share = async () => {
    const url = `https://www.gettruckloan.com`;
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return {
    get: {
      fadeAnim,
      width,
      activeImageIndex,
      ad: adData?.ad,
      isFeaturedAd,
      featuredAdsArray: user?.data.featuredAds,
      getSingleAdIsLoading,
      modalVisible,
    },
    set: { setHeaderShown, setActiveImageIndex, setModalVisible },
    on: {
      deleteAdHandler,
      deleteAdModal,
      createFeaturedAdHandler,
      deleteFeaturedAdHandler,
      share,
    },
  };
};
