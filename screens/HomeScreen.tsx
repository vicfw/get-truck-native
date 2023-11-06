import { Button, Icon } from "@rneui/themed";
import {
  ActivityIndicator,
  Appearance,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SingleAd from "../components/SingleAd";
import Colors from "../constants/Colors";
import { useHome } from "../screenHooks/useHome";
import { RootStackScreenProps } from "../types";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { themeRenderer } from "../constants/Common";

export default function HomeScreen({
  navigation,
  route,
}: RootStackScreenProps<"Home">) {
  const { get, set, on } = useHome(navigation, route);
  const inset = useSafeAreaInsets();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const theme = Appearance.getColorScheme();

  return (
    <View
      className="flex-1"
      style={{ paddingTop: inset.top, position: "relative" }}
    >
      {!get.query.length ? null : (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            width: "100%",
            bottom: 0,
            top: Platform.OS === "ios" ? 100 : 72,
            height: height / 2.2,
            zIndex: 11000,
          }}
          className="bg-gray-100"
        >
          {get.searchIsLoading ? (
            <View
              style={{ height: "100%" }}
              className="d-flex justify-center items-center"
            >
              <ActivityIndicator />
            </View>
          ) : (
            <View className="flex-1">
              <FlatList
                style={{ flex: 1, height: "100%", zIndex: 2000 }}
                ListEmptyComponent={() => {
                  return (
                    <View
                      className="d-flex justify-center items-center"
                      style={{ height: height / 2.2 }}
                    >
                      <Text>There is no ad!</Text>
                    </View>
                  );
                }}
                data={get.searchData?.ads}
                numColumns={1}
                contentContainerStyle={{
                  justifyContent: "space-between",
                }}
                renderItem={({ item }) => {
                  return (
                    <SingleAd
                      image={item?.adImages?.lg[0]}
                      {...item}
                      featuredAdId={
                        item.creator.featuredAds?.find(
                          (ad) => ad.ad === item._id
                        )?._id
                      }
                      rows={1}
                      smallImage
                      from="Home"
                      isRow
                    />
                  );
                }}
              />
            </View>
          )}
          {get.savedSearchTerms.current?.includes(get.query) ? null : (
            <Button
              title={"Save search for later"}
              titleStyle={{ fontSize: 12, borderRadius: 0 }}
              color={"#000f"}
              onPress={on.handleCreateSavedSearch}
            />
          )}
        </View>
      )}
      {/* Header */}
      <View
        className="flex flex-row w-100 items-center gap-5 px-3 pb-1 fixed"
        style={{ zIndex: 1000 }}
      >
        <View className="flex-1">
          <View className="flex-row  border-2 border-gray-300 rounded-full p-2 items-center">
            <Icon type="evilIcons" name="search" color={Colors["gray-500"]} />

            <TextInput
              className={`flex-1 pl-2 ${themeRenderer(
                "text-white",
                "text-black"
              )}`}
              placeholder="Search for anything..."
              placeholderTextColor={themeRenderer("#fff", "#000")}
              onChangeText={on.handleSearch}
              value={get.query}
            />
          </View>
        </View>
        <Icon
          type="antdesign"
          name="notification"
          color={Colors.main}
          size={25}
          onPress={() => navigation.navigate("NotificationSender")}
        />
        <Icon
          type="entypo"
          name="flow-tree"
          color={Colors.main}
          size={26}
          onPress={() => {
            set.setPagination({ limit: 6, page: 0 });
            set.setAdData([]);
            navigation.navigate("SearchModal");
          }}
        />
      </View>

      {/* Ads Section */}
      <FlatList
        onTouchStart={() => set.setQuery("")}
        style={{ flex: 1, height: "100%" }}
        refreshing={get.adDataLoading}
        onRefresh={on.onRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View className="px-4 pt-1">
              <View className="flex flex-row gap-1">
                <Text
                  className="text-2xl"
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                >
                  {get.timeOfDay}
                </Text>
                <Text
                  className="text-2xl"
                  style={{
                    color: Colors.main,
                  }}
                >
                  {get.userData?.data?.name}
                </Text>
              </View>
            </View>
            {/* Categories */}
            <View className="flex flex-row justify-between pt-5 px-4">
              {get.lastFourCategoryData?.map((category) => {
                return (
                  <TouchableOpacity
                    className="flex items-center"
                    key={category._id}
                    onPress={() =>
                      navigation.navigate("Category", {
                        categoryId: category._id,
                        categoryName: category.name,
                      })
                    }
                  >
                    <View
                      className="bg-orange-200 rounded-full flex items-center justify-center"
                      style={{
                        minWidth: 60,
                        minHeight: 60,
                        maxWidth: 60,
                        maxHeight: 60,
                      }}
                    >
                      <Image
                        style={{ width: 60, height: 60 }}
                        source={{
                          uri: category.categoryImage,
                        }}
                      />
                    </View>
                    <Text style={{ color: Colors.main, fontWeight: "bold" }}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                className="flex items-center"
                onPress={() => navigation.navigate("Categories")}
              >
                <View
                  className="bg-orange-200 rounded-full items-center justify-center "
                  style={{
                    minWidth: 60,
                    minHeight: 60,
                    maxWidth: 70,
                    maxHeight: 70,
                  }}
                >
                  <Icon
                    type="feather"
                    name="grid"
                    size={30}
                    color={Colors.main}
                  />
                </View>
                <Text style={{ color: Colors.main, fontWeight: "bold" }}>
                  Categories
                </Text>
              </TouchableOpacity>
            </View>
            {/* Saved Searches */}
            <View className="pt-5 px-3">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {get.savedSearchData?.data.map((saved, index) => (
                  <TouchableOpacity
                    key={saved._id + index}
                    className={`${themeRenderer(
                      "bg-stone-900",
                      "bg-white"
                    )} p-2 rounded-lg ml-2 d-flex flex-row justify-between items-center w-24`}
                    onPress={() => on.handleClickSearchTerm(saved.searchTerm)}
                  >
                    <Text className={themeRenderer("text-white", "text-black")}>
                      {saved.searchTerm}
                    </Text>
                    <TouchableOpacity
                      onPress={() => on.handleDeleteSavedSearch(saved._id)}
                    >
                      <Icon
                        type="antdesign"
                        name="close"
                        size={17}
                        color={themeRenderer("#fff", "#000")}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Ad */}
            <View className="pt-5 justify-center items-center">
              {get.bannerData?.status === "success" ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(get.bannerData?.data?.mobileBannerLink!)
                  }
                >
                  <Image
                    source={{ uri: get.bannerData?.data?.mobileBanner! }}
                    style={{ width: width, height: width / 1.6 }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {/* Hero Section */}
            <View className="d-flex justify-center items-center py-2">
              <BannerAd
                unitId={
                  Platform.OS === "android"
                    ? "ca-app-pub-5191028754472941/3312863357"
                    : "ca-app-pub-5191028754472941/2058515060"
                }
                size={BannerAdSize.LARGE_BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
              />
            </View>
            <View
              className={`justify-center items-center py-4 px-4 mx-1 rounded-md ${themeRenderer(
                "bg-stone-900",
                "bg-white"
              )}`}
            >
              <View className="d-flex flex-row border justify-center items-center rounded-lg border-gray-600">
                <TouchableOpacity
                  className={`px-2 border-gray-600  ${
                    get.numColumns === 2 ? "bg-gray-200" : "#fff"
                  }`}
                  style={{
                    borderRightWidth: 1,
                    borderTopLeftRadius: 7,
                    borderBottomLeftRadius: 7,
                  }}
                  onPress={() => on.changeColumns(2)}
                >
                  <Icon
                    name="grid"
                    type="feather"
                    size={25}
                    color={Colors["gray-500"]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-2 border-gray-600 ${
                    get.numColumns === 1 ? "bg-gray-200" : "#fff"
                  }`}
                  style={{
                    borderLeftWidth: 1,
                    borderTopRightRadius: 7,
                    borderBottomRightRadius: 7,
                  }}
                  onPress={() => on.changeColumns(1)}
                >
                  <Icon
                    name="list"
                    type="feather"
                    size={25}
                    color={Colors["gray-500"]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        data={get.adData}
        ListFooterComponent={
          get.adDataLoading || get.adDataFetching ? (
            <>
              <ActivityIndicator />
            </>
          ) : null
        }
        numColumns={get.numColumns}
        key={get.numColumns}
        keyExtractor={(item) => item._id + get.numColumns}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ justifyContent: "space-between" }}
        onEndReached={() => {
          set.setIsReachEnd(true);
        }}
        onMomentumScrollEnd={() => {
          get.isReachEnd && on.handleLoadMore();
          set.setIsReachEnd(false);
        }}
        renderItem={({ item }) => {
          return (
            <SingleAd
              image={item?.adImages?.xs[0]}
              {...item}
              featuredAdId={
                item.creator.featuredAds?.find((ad) => ad.ad === item._id)?._id
              }
              iconType="add"
              isRow={get.numColumns === 1}
              rows={get.numColumns}
              key={item._id + get.numColumns}
            />
          );
        }}
      />
    </View>
  );
}
