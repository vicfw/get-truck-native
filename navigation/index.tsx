import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "@rneui/themed";
import * as React from "react";
import { ColorSchemeName, View } from "react-native";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import Colors from "../constants/Colors";
import {
  handleAddToken,
  handleAddUser,
  handleSignIn,
} from "../redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getLocalStorageData } from "../redux/services/deviceStorage";
import AdvancedSearchScreen from "../screens/AdvancedSearchScreen";
import Chat from "../screens/Chat";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import Features from "../screens/Features";
import ForgotPasswordEmailScreen from "../screens/ForgotPasswordEmailScreen";
import ForgotPasswordReset from "../screens/ForgotPasswordReset";
import ForgotPasswordValidationScreen from "../screens/ForgotPasswordValidationScreen";
import Login from "../screens/Login";
import NotFoundScreen from "../screens/NotFoundScreen";
import Register from "../screens/Register";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import { HomeStackScreen } from "./HomeStack";
import { PostAdStackScreen } from "./PostAdStack";
import { ProfileStackScreen } from "./ProfileStack";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const dispatch = useAppDispatch();
  const { isSignedIn, token: tokenInState } = useAppSelector(
    (state) => state.user
  );
  React.useEffect(() => {
    (async () => {
      try {
        const token = await getLocalStorageData("token");
        const user = await getLocalStorageData("user");
        // await clearStorage();
        if (token || tokenInState) {
          dispatch(handleAddToken(token));
          dispatch(handleSignIn(true));
          dispatch(
            handleAddUser({
              id: user._id,
              email: user.email,
              name: user.name,
              photo: user.photo,
              role: user.role,
              notificationToken: "",
            })
          );
        }
      } catch (e) {
        dispatch(handleSignIn(false));
      }
    })();
  }, []);

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <OverflowMenuProvider>
        {isSignedIn ? (
          <RootNavigator />
        ) : (
          <View
            style={{
              flex: 0,
              height: 0,
            }}
          />
        )}
      </OverflowMenuProvider>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator() {
  const { isSignedIn } = useAppSelector((state) => state.user);
  return (
    <Stack.Navigator initialRouteName="Login">
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
              name="SearchModal"
              component={AdvancedSearchScreen}
              options={{
                headerTitle: "Advanced Search",
                headerStyle: { backgroundColor: Colors.main },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
              }}
            />
          </Stack.Group>
        </>
      ) : (
        <>
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: "Register",
              headerStyle: { backgroundColor: Colors.main },
              headerTitleAlign: "center",
              headerTintColor: "#fff",
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
              headerStyle: { backgroundColor: Colors.main },
              headerTitleAlign: "center",
              headerTintColor: "#fff",
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="ForgotPasswordEmailScreen"
            component={ForgotPasswordEmailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPasswordValidationScreen"
            component={ForgotPasswordValidationScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPasswordReset"
            component={ForgotPasswordReset}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="HomeTab">
      <BottomTab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon type="ionicon" name="home" color={Colors.main} size={26} />
            ) : (
              <Icon
                type="ionicon"
                name="home-outline"
                color={Colors.main}
                size={26}
              />
            ),
        }}
      />
      <BottomTab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={({ navigation }: RootTabScreenProps<"ProfileTab">) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon
                type="font-awesome"
                name="user"
                color={Colors.main}
                size={26}
              />
            ) : (
              <Icon
                type="font-awesome"
                name="user-o"
                color={Colors.main}
                size={26}
              />
            ),
        })}
      />
      <BottomTab.Screen
        name="PostAdTab"
        component={PostAdStackScreen}
        options={({ navigation }: RootTabScreenProps<"PostAdTab">) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            !focused ? (
              <Icon
                name="plus-square-o"
                type="font-awesome"
                color={Colors.main}
                size={30}
              />
            ) : (
              <Icon
                name="plus-square"
                type="font-awesome"
                color={Colors.main}
                size={30}
              />
            ),
        })}
      />
      <BottomTab.Screen
        name="Features"
        component={Features}
        options={{
          tabBarShowLabel: false,
          headerStyle: { backgroundColor: Colors.main },
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon
                type="font-awesome"
                name="bookmark"
                color={Colors.main}
                size={26}
              />
            ) : (
              <Icon
                type="font-awesome"
                name="bookmark-o"
                color={Colors.main}
                size={26}
              />
            ),
        }}
      />
      <BottomTab.Screen
        name="ChatRoomTab"
        component={ChatRoomScreen}
        options={{
          tabBarShowLabel: false,
          title: "My Messages",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: { fontSize: 20 },
          headerStyle: { backgroundColor: Colors.main },
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon
                type="ionicon"
                name="ios-chatbubble-sharp"
                color={Colors.main}
                size={26}
              />
            ) : (
              <Icon
                type="ionicon"
                name="ios-chatbubble-outline"
                color={Colors.main}
                size={26}
              />
            ),
        }}
      />
    </BottomTab.Navigator>
  );
}
