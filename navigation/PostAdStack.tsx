import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Colors from "../constants/Colors";
import ModalScreen from "../screens/EditModalScreen";
import PickPlaceModal from "../screens/PickPlaceModal";
import PostAd from "../screens/PostAd";
import { RootStackParamList, RootStackScreenProps } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PostAdStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="PostAd">
      <Stack.Group>
        <Stack.Screen
          name="PostAd"
          component={PostAd}
          options={({ navigation }: RootStackScreenProps<"PostAd">) => ({
            title: "Post Ad",
            tabBarShowLabel: false,
            headerStyle: { backgroundColor: Colors.main },
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            tabBarStyle: { display: "none" },
            headerLeft: () => (
              <HeaderButtons>
                <Item
                  title="Cancel"
                  color="white"
                  iconName="ios-search"
                  onPress={() => {
                    navigation.navigate("Home", { filterData: undefined });
                  }}
                />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="EditModal"
          component={ModalScreen}
          options={{
            headerTitle: "Edit Ad",
            headerStyle: { backgroundColor: Colors.main },
            headerTitleAlign: "center",
            headerTintColor: "#fff",
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="PickPlace"
          component={PickPlaceModal}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
