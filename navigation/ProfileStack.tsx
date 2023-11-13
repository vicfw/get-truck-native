import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "@rneui/base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Colors from "../constants/Colors";
import EditProfileScreen from "../screens/EditProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();
export const ProfileStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        // @ts-ignore
        component={ProfileScreen}
        options={({ navigation }) => {
          return {
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: Colors.main,
              shadowColor: Colors.main,
            },
            headerShadowVisible: false,
            headerRight: () => (
              <HeaderButtons>
                <Item
                  IconComponent={() => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("EditProfile")}
                    >
                      <Icon
                        type="ionicon"
                        name="settings-outline"
                        size={30}
                        style={{ paddingHorizontal: 10 }}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  )}
                  title=""
                  color="white"
                  iconName="ios-search"
                  onPress={() => navigation.navigate("EditProfile")}
                ></Item>
              </HeaderButtons>
            ),
          };
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: Colors.main },
          headerRight: () => (
            <HeaderButtons>
              <Item
                title="Update"
                color="white"
                buttonStyle={{ fontWeight: "500" }}
              />
            </HeaderButtons>
          ),
        }}
      />
    </Stack.Navigator>
  );
};
