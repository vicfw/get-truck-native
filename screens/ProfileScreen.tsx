import { Icon } from "@rneui/themed";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SingleAd from "../components/SingleAd";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useProfile } from "../screenHooks/useProfile";
import { RootTabScreenProps } from "../types";

const ProfileScreen: React.FC<RootTabScreenProps<"ProfileTab">> = ({
  navigation,
}) => {
  const { get, set, on } = useProfile();
  const width = Dimensions.get("window").width;

  return (
    <View className="flex-1">
      {/* top Header */}
      <View
        style={{
          alignSelf: "center",
          width: get.width,
          overflow: "hidden",
          height: get.width / 3,
        }}
      >
        <View
          style={{
            borderRadius: get.width,
            backgroundColor: Colors.main,
            width: get.width * 2,
            height: get.width * 2,
            marginLeft: -(get.width / 2),
            position: "absolute",
            bottom: 0,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 15,
              zIndex: 10,
              marginLeft: get.width / 2,
            }}
          >
            {!get.isFetching || !get.isLoading ? (
              get.me?.photo?.includes("default.jpg") ? (
                <Icon
                  name="user-circle"
                  type="font-awesome-5"
                  size={100}
                  color="#fff"
                />
              ) : (
                <Image
                  source={{ uri: get.me?.photo }}
                  style={{ width: get.width / 3.4, height: get.width / 3.4 }}
                  className="rounded-full"
                />
              )
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </View>
      </View>
      {/* Name */}
      <View className="items-center pt-3 ">
        <Text
          className={`${themeRenderer("text-white", "text-black")} text-2xl`}
        >
          {get.me?.name}
        </Text>
      </View>
      {/* List View */}

      {get.isLoading || get.isFetching ? (
        <ActivityIndicator />
      ) : !get.me?.ads.length ? (
        <View
          className={`flex-1 justify-start items-center ${themeRenderer(
            "bg-black",
            "bg-gray-200"
          )}`}
        >
          <Image
            source={require("../assets/images/profile_2.png")}
            style={{
              width: width / 0.7,
              height: "80%",
            }}
          />
          <Text className="text-gray-500 mb-3 text-sm">
            Have something to sell ?
          </Text>
          <TouchableOpacity
            className="flex flex-row items-center gap-2"
            onPress={() => navigation.navigate("PostAdTab")}
          >
            <Text style={{ color: Colors.main, marginBottom: 2 }}>
              Post an Ad
            </Text>
            <Icon
              name="plus-square-o"
              type="font-awesome"
              color={Colors.main}
              size={25}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1, height: "100%" }}
          showsVerticalScrollIndicator={false}
          data={get.me?.ads}
          numColumns={1}
          onEndReachedThreshold={0.2}
          onRefresh={() => on.refetch()}
          refreshing={get.isLoading}
          contentContainerStyle={{ justifyContent: "space-between" }}
          // onEndReached={on.handleLoadMore}
          renderItem={({ item }) => {
            return (
              <SingleAd
                image={item?.adImages?.lg[0]}
                {...item}
                featuredAdId={
                  item.creator.featuredAds?.find((ad) => ad.ad === item._id)
                    ?._id
                }
                rows={1}
                from="Profile"
                isRow
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default ProfileScreen;
