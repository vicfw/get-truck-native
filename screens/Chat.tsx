import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Appearance,
} from "react-native";
import React, { useEffect } from "react";
import { Icon } from "@rneui/themed";
import { useGetSingleAdQuery } from "../redux/services/adService";
import { RootStackScreenProps } from "../types";
import {
  useCreateOrAccessChatMutation,
  useGetAllMessagesQuery,
  useSendMessageMutation,
} from "../redux/services/chatService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "../redux/hooks";
import dayjs from "dayjs";
import Colors from "../constants/Colors";
import io from "socket.io-client";
import { URL } from "../constants/Api";
import Toast from "react-native-toast-message";
import {
  hidePushNotifications,
  unhidePushNotifications,
} from "../hooks/usePushNotification";
import { themeRenderer } from "../constants/Common";

const Chat: React.FC<RootStackScreenProps<"Chat">> = ({
  route,
  navigation,
}) => {
  const socketRef = React.useRef<any>();
  const theme = Appearance.getColorScheme();

  const inset = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.user);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [socketConnected, setSocketConnected] = React.useState(false);
  var relativeTime = require("dayjs/plugin/relativeTime");
  dayjs.extend(relativeTime);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const { data: messagesData, isLoading: fetchMessagesLoading } =
    useGetAllMessagesQuery(
      {
        chatId: route.params.chatId,
      },
      { refetchOnMountOrArgChange: true }
    );

  const { data: adData } = useGetSingleAdQuery({ adId: route.params.adId });
  const [message, setMessage] = React.useState("");

  const [messages, setMessages] = React.useState<
    { senderId: string; _id: string; content: string; createdAt: string }[] | []
  >([]);
  const [createMessage] = useSendMessageMutation();

  const typingHandler = (text: string) => {
    setMessage(text);
    // typing Indicator logic
  };

  const sendMessage = async (text?: string) => {
    if (text?.length || message.length) {
      setMessage("");

      // send message to api

      socketRef.current?.emit(
        "new message",
        {
          chatId: route.params.chatId,
          content: text ?? message,
          senderId: user.id,
          createdAt: Date.now(),
          _id: Date.now(),
        },
        async (cb: any) => {
          if (cb === "error") {
            return Toast.show({
              text1: "Something went wrong!!!!",
              autoHide: true,
              visibilityTime: 5000,
            });
          }
          scrollViewRef?.current?.scrollToEnd({ animated: true });
          try {
            const result = await createMessage({
              content: text ?? message,
              chatId: route.params.chatId,
            });

            const receiverUserToken = route.params.users.find(
              (usr) => usr._id === user.id
            );

            const body = {
              to: route.params.users[0].notificationToken,
              title: user.name
                ? `Message form ${user.name}`
                : "You Have new Message",
              body: text ?? message,
            };

            const response = await fetch(
              "https://exp.host/--/api/v2/push/send",
              {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                  Accept: "application/json",
                  "Accept-Encoding": "gzip,deflate",
                  "Content-Type": "application/json",
                },
              }
            );

            const res = await response.json();
          } catch (e) {
            Toast.show({
              text1: "Something went wrong!",
              autoHide: true,
              visibilityTime: 5000,
            });
          }
        }
      );
    }
  };

  const handleSuggestionPress = () => {
    sendMessage("Hi, is this available ?");
  };

  useEffect(() => {
    socketRef.current?.on(
      "receivedMessage",
      (newMessage: {
        senderId: string;
        _id: string;
        content: string;
        createdAt: string;
      }) => {
        setMessages((perv) => {
          return [...perv, newMessage];
        });
        scrollViewRef?.current?.scrollToEnd({ animated: true });
      }
    );
  }, [socketRef.current]);

  useEffect(() => {
    socketRef.current?.emit("join chat", route.params.chatId);
  }, [route.params.chatId, socketRef.current]);

  useEffect(() => {
    hidePushNotifications();

    const socket = io(URL, {
      secure: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketConnected(true);
    });

    return () => {
      socket.disconnect();
      unhidePushNotifications();
    };
  }, []);

  useEffect(() => {
    const data = messagesData?.map((msg) => ({
      senderId: msg.sender._id,
      _id: msg._id,
      createdAt: msg.createdAt,
      content: msg.content,
    }));

    setMessages(data!);
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  }, [messagesData]);

  return (
    <View className="flex-1 relative" style={{ paddingBottom: inset.bottom }}>
      {/* ad information */}
      <Pressable
        onPress={() =>
          navigation.navigate("SingleAd", {
            adId: adData?.ad._id!,
          })
        }
      >
        <View
          style={{
            height: width / 5,
            backgroundColor: "#fff",
            paddingHorizontal: 15,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: adData?.ad.adImages.xs[0],
            }}
            style={{ height: 40, width: 40 }}
          />
          <View className="ml-4">
            <Text>{adData?.ad.title}</Text>
            <View className="mt-2">
              <Text className="text-gray-500">CA${adData?.ad.price}</Text>
              {/* <Text className="text-gray-500">{adData?.ad?.address}</Text> */}
            </View>
          </View>
        </View>
      </Pressable>

      {/* chat section */}

      {fetchMessagesLoading ? (
        <View className="flex-1">
          <ActivityIndicator color={Colors.main} />
        </View>
      ) : (
        <ScrollView
          style={{ position: "relative" }}
          className="flex-1 px-2 pt-2"
          ref={scrollViewRef}
        >
          {messages?.map((msg) => {
            return (
              <View
                key={msg._id}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 10,
                  justifyContent:
                    user.id === msg.senderId ? "flex-end" : "flex-start",
                }}
              >
                <View className="flex flex-row-reverse">
                  <View
                    style={{
                      backgroundColor:
                        user.id === msg.senderId ? Colors.main : "#fff",
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: user.id === msg.senderId ? "#fff" : "#000",
                      }}
                    >
                      {msg.content}
                    </Text>
                    <Text
                      className=" text-xs"
                      style={{
                        color: user.id === msg.senderId ? "#fff" : "#000",
                      }}
                    >
                      {/* @ts-ignore */}
                      {dayjs(msg.createdAt).fromNow()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      {/* footer ,input section */}
      <KeyboardAvoidingView
        // keyboardVerticalOffset={90}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <View
          style={{
            height: width / 8,
            borderTopColor: "#ccc",
            borderTopWidth: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          className={themeRenderer("bg-stone-900", "bg-white")}
        >
          <TextInput
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              width: "86%",
              height: "65%",
              paddingHorizontal: 10,
              color: theme === "dark" ? "#fff" : "#000",
            }}
            onChangeText={typingHandler}
            value={message}
            returnKeyType="send"
            onEndEditing={() => sendMessage()}
          />
          <TouchableOpacity className="ml-3" onPress={() => sendMessage()}>
            <Icon
              type="feather"
              name="send"
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="absolute -top-10 px-3 py-2 rounded-xl mx-2"
          style={{ backgroundColor: Colors.main }}
          onPress={handleSuggestionPress}
        >
          <Text className="text-white">Hi, is this available ?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;
