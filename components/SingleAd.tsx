import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useSingleAd } from "./componentHooks/useSingleAd";
import { User } from "../globalTypes";
import { themeRenderer } from "../constants/Common";

interface SingleAdProps {
  _id: string;
  image: string;
  title: string;
  featuredAdId?: string;
  price?: number;
  rows?: number;
  iconType?: "add" | "delete" | undefined;
  from?: string;
  isRow?: boolean;
  smallImage?: boolean;
  isApproved?: boolean;
  creator?: User;
}

const SingleAd: React.FC<SingleAdProps> = ({
  image,
  price,
  title,
  featuredAdId,
  _id,
  rows,
  iconType,
  from,
  isRow,
  smallImage,
  isApproved,
  creator,
}) => {
  const { get } = useSingleAd(_id, featuredAdId, iconType);
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;

  return (
    <View
      className={`px-2 py-2  ${themeRenderer("bg-stone-900", "bg-white")} m-1 ${
        isRow ? "flex-row items-start" : undefined
      }`}
      style={{
        width: rows === 1 ? width / 1.02 : "48%",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SingleAd", {
            adId: _id,
            from,
          });
        }}
      >
        {smallImage ? (
          <Image
            style={{ width: isRow ? 70 : "100%", height: 70 }}
            source={{ uri: image }}
          />
        ) : (
          <Image
            style={{ width: isRow ? width / 2.4 : "100%", height: 140 }}
            source={{ uri: image }}
          />
        )}
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SingleAd", {
              adId: _id,
              from,
            });
          }}
        >
          <Text
            className={`text-gray-700 font-bold ${themeRenderer(
              "text-white",
              "text-black"
            )}  ${isRow ? "px-2" : "pt-2"}`}
          >
            {title}
          </Text>
        </TouchableOpacity>

        <View
          className={`${
            isRow ? "flex-col items-start" : "flex-row justify-between"
          } pt-2 ${isRow ? "px-2" : undefined}`}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SingleAd", {
                adId: _id,
                from,
              });
            }}
          >
            <Text
              className={`text-gray-700 font-bold  ${themeRenderer(
                "text-white",
                "text-black"
              )} `}
            >
              {price
                ? "$" +
                  price?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                : "Contact"}
            </Text>
          </TouchableOpacity>
          <View>
            {from === "Profile" ? (
              isApproved ? (
                <Text className={`text-green-700 font-bold `}>Approved ad</Text>
              ) : (
                <Text className={`text-red-500 font-bold`}>
                  Pending for approval...
                </Text>
              )
            ) : null}
          </View>
          {get.renderFeaturedIcon()}
        </View>
      </View>
    </View>
  );
};

export default SingleAd;
