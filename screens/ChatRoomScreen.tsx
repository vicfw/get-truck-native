import { Icon } from "@rneui/themed";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useAppSelector } from "../redux/hooks";
import {
  useDeleteChatMutation,
  useGetChatsQuery,
} from "../redux/services/chatService";
import { RootTabScreenProps } from "../types";

interface ChatRoomScreenProps {}

const ChatRoomScreen: React.FC<
  RootTabScreenProps<"ChatRoomTab"> & ChatRoomScreenProps
> = ({ navigation, route }) => {
  const width = Dimensions.get("window").width;
  const { user } = useAppSelector((state) => state);

  const [deleteChat] = useDeleteChatMutation();
  const { data, isLoading } = useGetChatsQuery();

  const deleteChatHandler = async (chatId: string) => {
    try {
      await deleteChat({ id: chatId });

      return Toast.show({
        type: "success",
        text1: "Chat removed successfully.",
        autoHide: true,
        visibilityTime: 3000,
      });
    } catch (e) {}
  };

  if (!data?.length && !isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../assets/images/chat.png")}
          style={{ width: width / 1, height: width / 2 }}
        />
        <Text className="text-gray-700 mb-3 text-lg">
          You have no messages.
        </Text>
        <Text className="text-gray-500 mb-3 text-sm">
          Next steps and how to manage
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
    );
  }
  console.log(data?.length, "data");

  return (
    <View className="flex-1">
      {isLoading ? (
        <ActivityIndicator color={Colors.main} />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item._id}
              className={`${themeRenderer(
                "bg-stone-900",
                "bg-white"
              )} flex justify-center my-1 py-2 px-2`}
              onPress={() =>
                navigation.navigate("Chat", {
                  adId: item.ad?._id,
                  chatId: item._id,
                  users: item.users,
                })
              }
            >
              <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row gap-3 items-center">
                  <View>
                    {item.users[1].photo.includes("default.jpg") ? (
                      <Icon
                        name="user-circle"
                        type="font-awesome-5"
                        size={50}
                        color={themeRenderer("#fff", "#000")}
                      />
                    ) : (
                      <Image
                        source={{ uri: item.users[1].photo }}
                        style={{ width: 50, height: 50 }}
                      />
                    )}
                  </View>

                  <View>
                    <Text className={themeRenderer("text-white", "text-black")}>
                      {
                        item.users.filter(
                          (users) => users._id !== user.user.id
                        )[0].name
                      }
                    </Text>
                    <Text className={themeRenderer("text-white", "text-black")}>
                      {item.latestMessage?.content ?? "-"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => deleteChatHandler(item._id)}
                  className="flex justify-center items-center w-14 group"
                >
                  <Text
                    className={`${themeRenderer(
                      "text-white",
                      "text-black"
                    )} text-lg`}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ChatRoomScreen;
