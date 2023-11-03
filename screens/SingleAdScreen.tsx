import { Button, Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import React, { useMemo, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import { Ad as AdType, Category } from "../globalTypes";
import { useAppSelector } from "../redux/hooks";
import { useCreateOrAccessChatMutation } from "../redux/services/chatService";
import { useSingleAdScreen } from "../screenHooks/useSingleAd";
import { RootStackScreenProps } from "../types";
import { themeRenderer } from "../constants/Common";

interface SingleAdScreenProps {}

const SingleAdScreen: React.FC<
  RootStackScreenProps<"SingleAd"> & SingleAdScreenProps
> = ({ route, navigation }) => {
  const { get, set, on } = useSingleAdScreen(navigation, route.params.adId);
  const { user } = useAppSelector((state) => state);
  const [createChat] = useCreateOrAccessChatMutation();

  const accessChat = async (adOwnerUserId: string, adId: string) => {
    const result = await createChat({ userId: adOwnerUserId, adId }).unwrap();

    return result;
  };

  const TrucksDetails: { name: string; property: keyof Partial<AdType> }[] =
    useMemo(
      () => [
        { name: "Brand", property: "brand" },
        { name: "Kilometers", property: "kilometers" },
        { name: "Transmission", property: "transmission" },
        { name: "EngineHP", property: "engineHP" },
        { name: "Engine", property: "engine" },
        { name: "Exterior Color", property: "exteriorColor" },
        { name: "Differential", property: "differential" },
        { name: "FrontAxel", property: "frontAxel" },
        { name: "RearAxel", property: "realAxel" },
        { name: "Suspension", property: "suspension" },
        { name: "Wheelbase", property: "wheelbase" },
        { name: "Wheels", property: "wheels" },
        { name: "Wheelbase", property: "wheelbase" },
      ],
      []
    );

  const detailsForTruckCategory = () => {
    if (
      (get.ad?.category as Category)?.name.toLowerCase().includes("trucks") ||
      (get.ad?.category as Category)?.name.toLowerCase().includes("trailers")
    ) {
      return TrucksDetails.map((detail, index) => {
        if (get.ad![detail.property]) {
          return (
            <View className={` py-1`} key={detail.property + index}>
              <Text className={themeRenderer("text-white", "text-gray-600")}>
                {detail.name}:
              </Text>
              <Text className={themeRenderer("text-white", "text-black")}>
                {get.ad![detail.property] as string}
              </Text>
            </View>
          );
        } else {
          return null;
        }
      });
    }
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: get.width / 1,
  };

  const handleViewableItemsChanged = useCallback((info: any) => {
    set.setActiveImageIndex(info.changed[0].index + 1);
  }, []);

  return (
    <>
      {/* header */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingHorizontal: 30,
          backgroundColor: Colors.main,
          opacity: get.fadeAnim,
        }}
      >
        <SafeAreaView
          style={{
            paddingVertical: Platform.OS === "ios" ? 0 : 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            // @ts-ignore
            onPress={() => {
              navigation.reset({
                routes: [
                  {
                    name: "Home",
                    state: {
                      routes: [
                        { name: "Categories" },
                        { name: "SingleAd" },
                        { name: "Category" },
                      ],
                    },
                  },
                ],
              });
              //@ts-ignore
              navigation.navigate(route.params.from ?? "Home");
            }}
          >
            <Icon type="evilicon" name="close" size={36} color={"#fff"} />
          </TouchableOpacity>
          {get.ad?.creator._id === user.user.id ? (
            <View className="flex-row justify-center items-center gap-5 z-10">
              <TouchableOpacity>
                <Icon
                  type="feather"
                  name="edit"
                  size={26}
                  color="#fff"
                  onPress={() => {
                    //@ts-ignore
                    navigation.navigate("PostAdTab", {
                      screen: "EditModal",
                      params: {
                        adId: route.params.adId,
                        address: get.ad?.address?.address ?? "",
                        lat: get.ad?.address?.latitude ?? 0,
                        lng: get.ad?.address?.longitude ?? 0,
                      },
                    });
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={on.deleteAdModal}>
                <Icon type="feather" name="trash" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
      </Animated.View>
      {/* main page */}
      <View className={`flex-1 ${themeRenderer("bg-black", "bg-gray-200")}`}>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={(event) => {
            const scrolling = event.nativeEvent.contentOffset.y;
            if (scrolling > 60) {
              set.setHeaderShown(true);
            } else {
              set.setHeaderShown(false);
            }
          }}
          scrollEventThrottle={16}
        >
          {/* image section and header */}
          <View
            style={{
              width: get.width,
              height: get.width / 1,
              position: "relative",
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 10,
              }}
              className="w-1/5 h-8 bg-black rounded-full flex items-center justify-center flex-row"
            >
              <Icon
                type="font-awesome"
                name="picture-o"
                color={"#fff"}
                size={19}
              />
              <Text className="text-white ml-1">
                {get.activeImageIndex}/{get.ad?.adImages.lg.length}
              </Text>
            </View>
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                zIndex: 10,
              }}
            >
              <LinearGradient
                // Background Linear Gradient
                colors={["rgba(0,0,0,0.8)", "transparent"]}
                style={{
                  top: 0,
                  right: 0,
                  left: 0,
                  height: 80,
                  position: "absolute",
                }}
              />
              <SafeAreaView
                style={{
                  paddingVertical: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  paddingHorizontal: 30,
                  alignItems: "center",
                  flexDirection: "row",
                }}
                className="fixed"
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon type="evilicon" name="close" size={36} color={"#fff"} />
                </TouchableOpacity>
                {get.ad?.creator._id === user.user.id ? (
                  <View className="flex-row justify-center items-center gap-5 z-10">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("EditModal", {
                          adId: route.params.adId,
                          address: get.ad?.address?.address ?? "",
                          lat: get.ad?.address?.latitude ?? 0,
                          lng: get.ad?.address?.longitude ?? 0,
                        });
                      }}
                    >
                      <Icon
                        type="feather"
                        name="edit"
                        size={26}
                        color="#fff"
                        onPress={() =>
                          navigation.navigate("EditModal", {
                            adId: route.params.adId,
                            address: get.ad?.address?.address ?? "",
                            lat: get.ad?.address?.latitude ?? 0,
                            lng: get.ad?.address?.longitude ?? 0,
                          })
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={on.deleteAdModal}>
                      <Icon
                        type="feather"
                        name="trash"
                        size={26}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </SafeAreaView>
            </View>
            <FlatList
              data={get.ad?.adImages.lg}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ width: get.width, height: get.width / 1 }}
              pagingEnabled
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={handleViewableItemsChanged}
              renderItem={({ item, index }) => {
                return (
                  <TouchableNativeFeedback
                    onPress={() =>
                      set.setModalVisible({
                        show: true,
                        activeImageIndex: index,
                      })
                    }
                  >
                    <Image
                      style={{ width: get.width, height: get.width / 1 }}
                      source={{ uri: item }}
                    />
                  </TouchableNativeFeedback>
                );
              }}
            />
          </View>

          {/* Content */}
          <View className={`p-4 ${themeRenderer("bg-black", "bg-white")}`}>
            {/* title and fav icon */}
            <View className="flex-1 justify-between items-center flex-row">
              <Text
                className={`text-xl font-bold  ${themeRenderer(
                  "text-white",
                  "text-gray-700"
                )}`}
                style={{ width: "70%" }}
              >
                {get.ad?.title}
              </Text>
              <View className="flex flex-row gap-2">
                <TouchableOpacity
                  className="w-10 h-10 rounded-full justify-center items-center border-gray-400"
                  style={{ borderWidth: 1 }}
                  onPress={on.share}
                >
                  <Icon
                    type="font-awesome"
                    name="share-square-o"
                    color={Colors["gray-500"]}
                  />
                </TouchableOpacity>
                {get.isFeaturedAd ? (
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full justify-center items-center border-gray-400"
                    style={{ borderWidth: 1 }}
                    onPress={on.deleteFeaturedAdHandler}
                  >
                    <Icon
                      type="font-awesome"
                      name="bookmark"
                      color={Colors["gray-500"]}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full justify-center items-center border-gray-400"
                    style={{ borderWidth: 1 }}
                    onPress={on.createFeaturedAdHandler}
                  >
                    <Icon
                      type="font-awesome"
                      name="bookmark-o"
                      color={Colors["gray-500"]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Price */}
            <View
              className="mt-4 flex flex-row "
              style={{ position: "relative" }}
            >
              {get.ad?.price ? (
                <>
                  <View>
                    <Text
                      className={`text-3xl font-bold ${themeRenderer(
                        "text-white",
                        "text-gray-700"
                      )}`}
                    >
                      CA
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 40,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginLeft: 3,
                    }}
                  >
                    <Text className="mb-2" style={{ fontSize: 20 }}>
                      $
                    </Text>
                    <Text
                      className={`text-3xl font-bold ${themeRenderer(
                        "text-white",
                        "text-gray-700"
                      )}`}
                    >
                      {get.ad?.price
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </Text>
                  </View>
                </>
              ) : (
                <Text
                  className={`text-3xl font-bold ${themeRenderer(
                    "text-white",
                    "text-gray-700"
                  )} `}
                >
                  Contact
                </Text>
              )}
            </View>
          </View>
          {/* Content 2 */}
          {get.getSingleAdIsLoading ? (
            <ActivityIndicator />
          ) : (
            <View
              className={`px-4 py-1  ${themeRenderer(
                "bg-black",
                "bg-white"
              )} mt-2`}
            >
              {/* description */}
              <View className={` py-1`}>
                <Text className={themeRenderer("text-white", "text-gray-600")}>
                  Description:
                </Text>
                <Text className={themeRenderer("text-white", "text-black")}>
                  {get.ad?.description}
                </Text>
              </View>
              {/* year */}
              {get.ad?.year ? (
                <View className={` py-1`}>
                  <Text
                    className={themeRenderer("text-white", "text-gray-600")}
                  >
                    Year:
                  </Text>
                  <Text className={themeRenderer("text-white", "text-black")}>
                    {get.ad?.year}
                  </Text>
                </View>
              ) : null}

              {/* condition */}
              {get.ad?.condition ? (
                <View className="py-1">
                  <Text
                    className={themeRenderer("text-white", "text-gray-600")}
                  >
                    Condition:
                  </Text>
                  <Text className={themeRenderer("text-white", "text-black")}>
                    {get.ad?.condition}
                  </Text>
                </View>
              ) : null}
              {/* phone number */}
              <Pressable
                className={` py-1`}
                onPress={() => {
                  if (!get.ad?.phone) return;
                  Linking.openURL(`tel:${get.ad?.phone}`);
                }}
              >
                <Text className={themeRenderer("text-white", "text-gray-600")}>
                  Phone number:
                </Text>
                <Text className={themeRenderer("text-white", "text-black")}>
                  {get.ad?.phone && parseInt(get.ad?.phone?.toString())
                    ? get.ad?.phone
                    : "Please contact"}
                </Text>
              </Pressable>
              {/* trucks category details */}
              {detailsForTruckCategory()}
              {/* MAP */}
              {get.ad?.address?.latitude ? (
                <View className="py-1">
                  <Text
                    className={themeRenderer("text-white", "text-gray-600")}
                  >
                    Address:
                  </Text>
                  <View style={{ width: "100%", height: get.width / 3 }}>
                    <MapView
                      style={{ alignSelf: "stretch", height: "100%", flex: 1 }}
                      provider={PROVIDER_GOOGLE}
                      region={{
                        ...get.ad.address,
                        latitudeDelta: 0.0922 * 0.2,
                        longitudeDelta: 0.0421 * 0.2,
                      }}
                    >
                      {get.ad?.address?.latitude && (
                        <Circle
                          center={get.ad.address}
                          radius={999}
                          fillColor="rgba(255, 81, 1, 0.5)"
                          strokeColor="rgba(255, 0, 0, 0.8)"
                        />
                      )}
                    </MapView>
                    <Text className={themeRenderer("text-white", "text-black")}>
                      {get.ad.address.address}
                    </Text>
                  </View>
                </View>
              ) : null}
              {get.ad?.socialMedia ? (
                <>
                  {Object.keys(get.ad.socialMedia).map(
                    (socialMedia: string) => {
                      if (!get.ad?.socialMedia[socialMedia]) return;
                      return (
                        <View className="py-1">
                          <Text
                            className={themeRenderer(
                              "text-white",
                              "text-gray-600"
                            )}
                          >
                            {socialMedia}
                          </Text>
                          <Text
                            className={themeRenderer(
                              "text-white",
                              "text-black"
                            )}
                          >
                            {get.ad?.socialMedia[socialMedia]}
                          </Text>
                        </View>
                      );
                    }
                  )}
                </>
              ) : null}
            </View>
          )}
        </ScrollView>

        {get.ad?.creator._id === user?.user.id ||
        get.getSingleAdIsLoading ? null : (
          <View
            style={{
              paddingHorizontal: 5,
            }}
          >
            {/* todo:work on chat screen */}
            <View className={themeRenderer("bg-black", "bg-inherit")}>
              <Button
                title={"Chat"}
                color={Colors.main}
                containerStyle={{ borderRadius: 5 }}
                onPress={async () => {
                  try {
                    const result = await accessChat(
                      get.ad?.creator._id!,
                      get.ad?._id!
                    );

                    navigation.navigate("Chat", {
                      adId: get.ad?._id!,
                      chatId: result._id,
                      users: result.users,
                    });
                  } catch (e) {
                    console.log(e, "error in single in screen");
                  }
                }}
              />
            </View>
          </View>
        )}
      </View>
      <Modal visible={get.modalVisible.show} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <View className="w-full flex items-end p-4">
            <TouchableOpacity
              className="rounded-full w-8 h-8 flex justify-center items-center border-2"
              style={{
                borderColor: Colors.main,
                marginTop: Platform.OS === "ios" ? 30 : 0,
              }}
              onPress={() =>
                set.setModalVisible((perv) => ({ ...perv, show: false }))
              }
            >
              <Text
                className="text-xl"
                style={{
                  color: Colors.main,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={get.ad?.adImages.lg}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{
              width: get.width,
              height: "100%",
              flex: 1,
            }}
            contentContainerStyle={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            pagingEnabled
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={handleViewableItemsChanged}
            renderItem={({ item, index }) => {
              return (
                <TouchableNativeFeedback
                  onPress={() =>
                    set.setModalVisible({
                      show: true,
                      activeImageIndex: index,
                    })
                  }
                >
                  <Image
                    style={{ width: get.width, height: get.width / 1 }}
                    source={{ uri: item }}
                  />
                </TouchableNativeFeedback>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default SingleAdScreen;

const styles = StyleSheet.create({});
