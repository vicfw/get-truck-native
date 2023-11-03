import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Colors from "../constants/Colors";
import CategoriesScreen from "../screens/Categories";
import CategoryScreen from "../screens/CategoryScreen";
import ModalScreen from "../screens/EditModalScreen";
import HomeScreen from "../screens/HomeScreen";
import SingleAdScreen from "../screens/SingleAdScreen";
import { RootStackParamList } from "../types";
import NotificationSender from "../screens/NotificationSender";
import PickPlaceModal from "../screens/PickPlaceModal";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const HomeStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{
            title: "Select Category",
            headerTitleAlign: "center",
            headerTitleStyle: { color: "#fff" },
            headerStyle: { backgroundColor: Colors.main },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="SingleAd"
          component={SingleAdScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({
            title: route.params.categoryName,
            headerTitleAlign: "center",
            headerTitleStyle: { color: "#fff" },
            headerStyle: { backgroundColor: Colors.main },
            headerTintColor: "#fff",
          })}
        />
      </Stack.Group>
      {/* modal */}

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="NotificationSender"
          component={NotificationSender}
          options={{
            headerTitle: "Notification Tracker",
            headerStyle: { backgroundColor: Colors.main },
            headerTitleAlign: "center",
            headerTintColor: "#fff",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
