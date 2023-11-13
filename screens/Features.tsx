import { Icon } from "@rneui/themed";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SingleAd from "../components/SingleAd";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useFeatures } from "../screenHooks/useFeatures";
import { RootTabScreenProps } from "../types";

const Features: React.FC<RootTabScreenProps<"Features">> = ({ navigation }) => {
  const { get, set, on } = useFeatures(navigation);
  const width = Dimensions.get("window").width;

  return (
    <View className="flex-1">
      {/* tabs */}
      <View className={themeRenderer("bg-black", "bg-white")}>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className={`p-4 ${get.tab === "favorite" ? "border-b-2" : ""}`}
            style={styles.touchable}
            onPress={() => set.setTab("favorite")}
          >
            <Text
              style={{
                color:
                  get.tab === "favorite"
                    ? Colors.main
                    : themeRenderer("#fff", "#000"),
              }}
            >
              Favorite Ads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-4 ${get.tab === "saved" ? "border-b-2" : ""}`}
            style={styles.touchable}
            onPress={() => set.setTab("saved")}
          >
            <Text
              style={{
                color:
                  get.tab === "saved"
                    ? Colors.main
                    : themeRenderer("#fff", "#000"),
              }}
            >
              Saved Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {get.tab === "favorite" ? (
        <View className="p-2 flex-1">
          {get.getFeatureAdIsLoading || get.getFeaturedAdIsFetching ? (
            <ActivityIndicator />
          ) : get.ads?.length && !get.getFeatureAdIsLoading ? (
            <FlatList
              data={get.ads}
              numColumns={2}
              refreshing={get.getFeatureAdIsLoading}
              onRefresh={on.refetch}
              renderItem={({ item }) => {
                return (
                  <SingleAd
                    image={item.ad?.adImages?.xs[0]}
                    title={item.ad?.title}
                    price={item.ad?.price}
                    _id={item.ad?._id}
                    featuredAdId={item?._id}
                    iconType="delete"
                    from="Features"
                  />
                );
              }}
            />
          ) : (
            // render photo to nothing found
            <View className="d-flex flex-1 justify-center items-center">
              <Image
                source={require("../assets/images/featured.png")}
                style={{ width: width / 0.5, height: width / 1 }}
              />
              <Text style={{ color: Colors.main, marginBottom: 2 }}>
                Add & Save
              </Text>
              <View className="flex-row justify-center items-center gap-2 mt-1">
                <Text className="text-gray-500 text-lg">Features</Text>
                <Icon
                  type="font-awesome"
                  name="bookmark-o"
                  color={Colors.main}
                  size={18}
                />
              </View>
            </View>
          )}
        </View>
      ) : (
        <View>
          <FlatList
            data={get.savedSearchData?.data}
            numColumns={1}
            refreshing={get.savedSearchIsLoading}
            style={{ marginTop: 10 }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            onRefresh={on.savedSearchRefetch}
            renderItem={({ item: saved }) => {
              return (
                <TouchableOpacity
                  onPress={() => on.handleNavigateSearch(saved.searchTerm)}
                >
                  <View className="bg-white p-5 d-flex flex-row justify-between items-center gap-1">
                    <Text>{saved.searchTerm}</Text>
                    <TouchableOpacity
                      onPress={() => on.handleDeleteSavedSearch(saved._id)}
                    >
                      <Icon
                        type="feather"
                        name="trash"
                        size={23}
                        color={Colors["gray-500"]}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  touchable: {
    flexBasis: 200,
    flexShrink: 1,
    flexGrow: 0,
    alignItems: "center",
    borderColor: Colors.main,
  },
});
