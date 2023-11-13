import { Icon } from "@rneui/themed";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useEditProfile } from "../screenHooks/useEditProfile";
import { RootStackScreenProps } from "../types";

const EditProfileScreen: React.FC<RootStackScreenProps<"EditProfile">> = ({
  navigation,
}) => {
  const { get, set, on } = useEditProfile(navigation);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="Update"
            color="white"
            buttonStyle={{ fontWeight: "500" }}
            onPress={() => get.formik.handleSubmit()}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  if (get.profilePhotoLoading) {
    return (
      <View
        style={{ backgroundColor: Colors.main }}
        className="flex flex-1 items-center justify-center"
      >
        <Text className="text-white text-xl">Uploading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* profile picture section */}
      <View
        className={themeRenderer("bg-black", "bg-white")}
        style={{ height: get.width / 3 }}
      >
        <View className="items-center justify-center flex-1">
          {get.data?.data.photo.includes("default") ? (
            <TouchableOpacity
              style={{ position: "relative" }}
              onPress={on.pickImage}
            >
              <Icon
                name="user-circle"
                type="font-awesome-5"
                size={100}
                color="#ccc"
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  width: 50,
                  height: 50,
                  right: -12,
                  zIndex: 20,
                }}
              >
                <Icon type="antdesign" name="pluscircle" color="gray" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ position: "relative" }}
              onPress={on.pickImage}
            >
              <Image
                source={{
                  uri: get.uiProfileImage
                    ? get.uiProfileImage
                    : get.data?.data.photo,
                }}
                style={{ width: get.width / 4, height: get.width / 4 }}
                className="rounded-full"
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  width: 50,
                  height: 50,
                  right: -12,
                  zIndex: 30,
                }}
              >
                <Icon
                  type="antdesign"
                  name="pluscircle"
                  color={Colors.main}
                  style={{ zIndex: 30 }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* name and email section */}
      <View
        className={`${themeRenderer("bg-black", "bg-white")} mt-5`}
        style={{ height: get.width / 2.9 }}
      >
        <View className="gap-4">
          {/* title */}
          <View className={themeRenderer("bg-black", "bg-white")}>
            <Text className="text-gray-500 pt-2 px-3">Name</Text>
            <TextInput
              onChangeText={get.formik.handleChange("name")}
              onBlur={get.formik.handleBlur("name")}
              value={get.formik.values.name}
              className={`py-1 px-4 ${themeRenderer(
                "text-white",
                "text-black"
              )}`}
            />
            {get.formik.errors.name && get.formik.touched.name && (
              <Text style={{ fontSize: 10, color: "red" }} className="px-3">
                {get.formik.errors.name}
              </Text>
            )}
          </View>
          {/* email */}
          <View className={themeRenderer("bg-black", "bg-white")}>
            <Text className="text-gray-500 pt-2 px-3">Email</Text>
            <TextInput
              onChangeText={get.formik.handleChange("email")}
              onBlur={get.formik.handleBlur("email")}
              value={get.formik.values.email}
              className={`py-1 px-4 ${themeRenderer(
                "text-white",
                "text-black"
              )}`}
            />
            {get.formik.errors.email && get.formik.touched.email && (
              <Text style={{ fontSize: 10, color: "red" }} className="px-3">
                {get.formik.errors.email}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* contact us */}
      {/* todo:handle email sending after asking mahdi */}
      <View
        className={`${themeRenderer(
          "bg-black",
          "bg-white"
        )} mt-5 h-10 d-flex justify-center`}
      >
        <TouchableOpacity
          className="px-3 d-flex flex-row items-center gap-1"
          onPress={on.sendEmail}
        >
          <Icon
            type="font-awesome"
            name="mail-forward"
            color="#ccc"
            size={18}
          />
          <Text className={themeRenderer("text-white", "text-black")}>
            Contact us
          </Text>
        </TouchableOpacity>
      </View>
      {/* log out */}
      <View
        className={`${themeRenderer(
          "bg-black",
          "bg-white"
        )} mt-5 h-10 d-flex justify-center`}
      >
        <TouchableOpacity
          className="px-3 d-flex flex-row items-center gap-1"
          onPress={on.handleLogOut}
        >
          <Icon type="font-awesome" name="user-times" color="#ccc" size={18} />
          <Text className={themeRenderer("text-white", "text-black")}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      {/* description section */}
      <Text className="p-4 text-center text-gray-500">
        Only your name and profile photo will be displayed on your public
        profile
      </Text>
    </View>
  );
};

export default EditProfileScreen;
