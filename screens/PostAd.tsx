import { Button, Icon } from "@rneui/themed";
import { Formik } from "formik";

import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SocialMediasAccordion from "../components/SocialMedisaAcoordian";
import { TRAILER_BRANDS, TRUCKS_BRANDS } from "../constants/Brands";
import Colors from "../constants/Colors";
import { usePostAd } from "../screenHooks/usePostAd";
import { RootStackScreenProps } from "../types";
import { postAdValidationSchema } from "../utils/yupSchema";
import { themeRenderer } from "../constants/Common";

export default function PostAd({
  navigation,
  route,
}: RootStackScreenProps<"PostAd">) {
  const { get, set, on } = usePostAd(navigation, route);
  const inset = useSafeAreaInsets();

  const trucksCategoryInputs = (
    handleChange: any,
    handleBlur: any,
    values: any,
    errors: any,
    touched: any
  ) => (
    // kilometers
    <View>
      {/* kilometers */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Kilometers</Text>
        <TextInput
          onChangeText={handleChange("kilometers")}
          onBlur={handleBlur("kilometers")}
          value={values.kilometers}
          className="py-1 px-4"
          keyboardType="number-pad"
        />
        {errors.kilometers && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.kilometers}
          </Text>
        )}
      </View>

      {/* transmission */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <RNPickerSelect
          onValueChange={handleChange("transmission")}
          useNativeAndroidPickerStyle={false}
          value={values.transmission}
          style={get.selectPickerStyles}
          placeholder={{
            label: "Select a Transmission",
            value: "",
          }}
          items={[
            { label: "Automatic", value: "automatic" },
            { label: "Manual", value: "manual" },
          ]}
          itemKey={"label"}
          // @ts-ignore
          Icon={() => (
            <Icon
              name="chevron-down"
              type="entypo"
              size={20}
              color={Colors["gray-500"]}
            />
          )}
        />
      </View>

      {/* engineHP */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">EngineHP</Text>
        <TextInput
          onChangeText={handleChange("engineHP")}
          onBlur={handleBlur("engineHP")}
          value={values.engineHP}
          className="py-1 px-4"
        />
        {errors.engineHP && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.engineHP}
          </Text>
        )}
      </View>
      {/* engine */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Engine</Text>
        <TextInput
          onChangeText={handleChange("engine")}
          onBlur={handleBlur("engine")}
          value={values.engine}
          className="py-1 px-4"
        />
        {errors.engine && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.engine}
          </Text>
        )}
      </View>
      {/* exteriorColor */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <RNPickerSelect
          onValueChange={handleChange("exteriorColor")}
          useNativeAndroidPickerStyle={false}
          value={values.exteriorColor}
          style={get.selectPickerStyles}
          placeholder={{
            label: "Select an Exterior Colour",
            value: "",
          }}
          items={get.exteriorColors}
          itemKey={"label"}
          // @ts-ignore
          Icon={() => (
            <Icon
              name="chevron-down"
              type="entypo"
              size={20}
              color={Colors["gray-500"]}
            />
          )}
        />
      </View>
      {/* differential */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Differential</Text>
        <TextInput
          onChangeText={handleChange("differential")}
          onBlur={handleBlur("differential")}
          value={values.differential}
          className="py-1 px-4"
        />
        {errors.differential && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.differential}
          </Text>
        )}
      </View>
      {/* frontAxel */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Front Axel</Text>
        <TextInput
          onChangeText={handleChange("frontAxel")}
          onBlur={handleBlur("frontAxel")}
          value={values.frontAxel}
          className="py-1 px-4"
        />
        {errors.frontAxel && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.frontAxel}
          </Text>
        )}
      </View>
      {/* realAxel */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Rear Axel</Text>
        <TextInput
          onChangeText={handleChange("realAxel")}
          onBlur={handleBlur("realAxel")}
          value={values.realAxel}
          className="py-1 px-4"
        />
        {errors.realAxel && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.realAxel}
          </Text>
        )}
      </View>
      {/* suspension */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Suspension</Text>
        <TextInput
          onChangeText={handleChange("suspension")}
          onBlur={handleBlur("suspension")}
          value={values.suspension}
          className="py-1 px-4"
        />
        {errors.suspension && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.suspension}
          </Text>
        )}
      </View>
      {/* wheelbase */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <Text className="text-gray-500 pt-2 px-4">Wheelbase</Text>
        <TextInput
          onChangeText={handleChange("wheelbase")}
          onBlur={handleBlur("wheelbase")}
          value={values.wheelbase}
          className="py-1 px-4"
        />
        {errors.wheelbase && (
          <Text style={{ fontSize: 10, color: "red" }} className="px-4">
            {errors.wheelbase}
          </Text>
        )}
      </View>
      {/* wheels */}
      <View className={`${themeRenderer("bg-black", "bg-white")} mb-4`}>
        <RNPickerSelect
          onValueChange={handleChange("wheels")}
          useNativeAndroidPickerStyle={false}
          value={values.wheels}
          style={get.selectPickerStyles}
          placeholder={{
            label: "Select Wheels",
            value: "",
          }}
          items={[
            { label: "Aluminum", value: "aluminum" },
            { label: "Steel", value: "steel" },
          ]}
          itemKey={"label"}
          // @ts-ignore
          Icon={() => (
            <Icon
              name="chevron-down"
              type="entypo"
              size={20}
              color={Colors["gray-500"]}
            />
          )}
        />
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${themeRenderer("bg-black", "bg-gray-200")}`}>
      {/* photo upload */}
      <View className="px-4 py-2">
        <ScrollView
          horizontal
          contentContainerStyle={{
            maxHeight: 100,
          }}
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={true}
          bounces={true}
          decelerationRate="fast"
        >
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={on.pickImage}
          >
            <View
              className={`${themeRenderer(
                "bg-stone-900",
                "bg-gray-100"
              )} p-5 rounded-full flex items-center justify-center`}
            >
              {get.uploadPhotoIsLoading ? (
                <ActivityIndicator size="large" color={Colors.main} />
              ) : (
                <Icon
                  type="MaterialIcons"
                  name="add-a-photo"
                  color={Colors.main}
                  size={35}
                />
              )}
            </View>
            <Text style={{ color: Colors.main }} className="pt-1 text-md">
              {get.uiImages.length}/10
            </Text>
          </TouchableOpacity>
          {/* rest of photos goes here */}
          {get.uiImages.map((item, index) => {
            return (
              <View key={item} className="mx-1">
                <Image
                  style={{ width: 100, height: "100%", position: "relative" }}
                  source={{ uri: item }}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => on.handleRemovePhotos(index)}
                >
                  <Icon name="trash" type="feather" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Inputs section */}
      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: inset.bottom }}>
          <Formik
            initialValues={get.formInitialValues.current}
            validationSchema={postAdValidationSchema}
            onSubmit={(values, { resetForm }) => {
              on.createAdHandler(values, resetForm);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              // resetForm,
              values,
              errors,
              touched,
            }) => {
              return (
                <View className="gap-4">
                  {/* title */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <Text className="text-gray-500 pt-2 px-3">Title</Text>
                    <TextInput
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("title")}
                      value={values.title}
                      className={`py-1 px-4 ${themeRenderer(
                        "text-white",
                        "text-black"
                      )}`}
                    />
                    {errors.title ? (
                      <Text
                        style={{ fontSize: 10, color: "red" }}
                        className="px-4"
                      >
                        {errors.title as string}
                      </Text>
                    ) : null}
                  </View>
                  {/* description */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <Text className="text-gray-500 pt-2 px-3">Description</Text>
                    <TextInput
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      value={values.description}
                      className={`py-2 px-4 ${themeRenderer(
                        "text-white",
                        "text-black"
                      )}`}
                      multiline={true}
                    />
                    {errors.description && (
                      <Text
                        style={{ fontSize: 10, color: "red" }}
                        className="px-4"
                      >
                        {errors.description as string}
                      </Text>
                    )}
                  </View>

                  {/* category */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <RNPickerSelect
                      onValueChange={handleChange("category")}
                      useNativeAndroidPickerStyle={false}
                      fixAndroidTouchableBug
                      value={values.category}
                      style={get.selectPickerStyles}
                      placeholder={{
                        label: "Select a Category",
                        value: "",
                      }}
                      items={
                        get.dropdownData?.length
                          ? (get.dropdownData as Item[])
                          : []
                      }
                      itemKey={"label"}
                      // @ts-ignore
                      Icon={() => (
                        <Icon
                          name="chevron-down"
                          type="entypo"
                          size={20}
                          color={Colors["gray-500"]}
                        />
                      )}
                    />
                    {errors.category && (
                      <Text
                        style={{ fontSize: 10, color: "red" }}
                        className="px-4"
                      >
                        {errors.category as string}
                      </Text>
                    )}
                  </View>
                  {/* year */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <RNPickerSelect
                      onValueChange={handleChange("year")}
                      useNativeAndroidPickerStyle={false}
                      fixAndroidTouchableBug
                      value={values.year}
                      style={get.selectPickerStyles}
                      placeholder={{
                        label: "Select Year",
                        value: "",
                      }}
                      items={get.years.length ? (get.years as Item[]) : []}
                      itemKey={"label"}
                      // @ts-ignore
                      Icon={() => (
                        <Icon
                          name="chevron-down"
                          type="entypo"
                          size={20}
                          color={Colors["gray-500"]}
                        />
                      )}
                    />
                    {errors.year && (
                      <Text
                        style={{ fontSize: 10, color: "red" }}
                        className="px-4"
                      >
                        {errors.year as string}
                      </Text>
                    )}
                  </View>
                  {/* condition */}
                  {on.findParent(values.category)?.name.toLowerCase() ===
                    "trailers" ||
                  on.findParent(values.category)?.name.toLowerCase() ===
                    "trucks" ? (
                    <View className={themeRenderer("bg-stone-900", "bg-white")}>
                      <RNPickerSelect
                        onValueChange={handleChange("condition")}
                        useNativeAndroidPickerStyle={false}
                        value={values.condition}
                        style={get.selectPickerStyles}
                        placeholder={{
                          label: "Select a Condition",
                          value: "",
                        }}
                        items={[
                          { label: "New", value: "new" },
                          { label: "Used", value: "used" },
                        ]}
                        itemKey={"label"}
                        // @ts-ignore
                        Icon={() => (
                          <Icon
                            name="chevron-down"
                            type="entypo"
                            size={20}
                            color={Colors["gray-500"]}
                          />
                        )}
                      />
                      {errors.condition && (
                        <Text
                          style={{ fontSize: 10, color: "red" }}
                          className="px-4"
                        >
                          {errors.condition as string}
                        </Text>
                      )}
                    </View>
                  ) : null}
                  {/* brand */}
                  {on.findParent(values.category)?.name.toLowerCase() ===
                    "trailers" ||
                  on.findParent(values.category)?.name.toLowerCase() ===
                    "trucks" ? (
                    <View className={themeRenderer("bg-stone-900", "bg-white")}>
                      <RNPickerSelect
                        onValueChange={handleChange("brand")}
                        useNativeAndroidPickerStyle={false}
                        value={values.brand}
                        style={get.selectPickerStyles}
                        placeholder={{
                          label: "Select a Brand",
                          value: "",
                        }}
                        items={
                          on.findParent(values.category)?.name.toLowerCase() ===
                          "trucks"
                            ? TRUCKS_BRANDS
                            : TRAILER_BRANDS
                        }
                        itemKey={"label"}
                        // @ts-ignore
                        Icon={() => (
                          <Icon
                            name="chevron-down"
                            type="entypo"
                            size={20}
                            color={Colors["gray-500"]}
                          />
                        )}
                      />
                      {errors.brand && (
                        <Text
                          style={{ fontSize: 10, color: "red" }}
                          className="px-4"
                        >
                          {errors.brand as string}
                        </Text>
                      )}
                    </View>
                  ) : null}
                  {/* specs */}
                  {on.findParent(values.category)?.name.toLowerCase() ===
                  "trucks" ? (
                    <TouchableOpacity
                      className={`${themeRenderer(
                        "bg-stone-900",
                        "bg-white"
                      )} py-4 d-flex flex-row items-center justify-between px-4`}
                      onPress={on.toggleOpenSpecs}
                    >
                      <Text className="text-gray-500 ">Specs (Optional)</Text>
                      <Icon
                        name={`chevron-${!get.openSpecs ? "down" : "up"}`}
                        type="entypo"
                        size={20}
                        color={Colors["gray-500"]}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {/* trucks special inputs */}
                  {values.category &&
                  get.openSpecs &&
                  on.findParent(values.category)?.name.toLowerCase() ===
                    "trucks"
                    ? trucksCategoryInputs(
                        handleChange,
                        handleBlur,
                        values,
                        errors,
                        touched
                      )
                    : null}
                  {/* price */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <Text className="text-gray-500 pt-2 px-4">
                      Price (Optional)
                    </Text>
                    <View className="flex flex-row">
                      <Text className="text-gray-500 pt-2 pl-3">$</Text>
                      <TextInput
                        style={{ width: "100%" }}
                        onChangeText={handleChange("price")}
                        onBlur={handleBlur("price")}
                        value={
                          typeof values.price === "undefined"
                            ? ""
                            : values.price?.toString()
                        }
                        keyboardType="number-pad"
                        className={`py-1 px-4 w-100 ${themeRenderer(
                          "text-white",
                          "text-black"
                        )}`}
                      />
                    </View>
                    {errors.price && (
                      <Text
                        style={{ fontSize: 10, color: "red" }}
                        className="px-4"
                      >
                        {errors.price as string}
                      </Text>
                    )}
                  </View>
                  {/* Address */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <Text className="text-gray-500 pt-2 px-4">Address</Text>

                    <Button
                      buttonStyle={{ backgroundColor: Colors.main }}
                      onPress={() => {
                        navigation.navigate("PickPlace", {
                          address: route?.params?.address!,
                          lat: route?.params?.lat!,
                          lng: route?.params?.lng!,
                          fromScreen: "create",
                        });
                      }}
                    >
                      {route.params?.address
                        ? route.params?.address
                        : "Open map"}
                    </Button>
                  </View>
                  {/* phone number */}
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <Text className="text-gray-500 pt-2 px-4">
                      Phone Number (Optional)
                    </Text>
                    <TextInput
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      value={
                        typeof values.phone === "undefined"
                          ? ""
                          : // @ts-ignore
                            values.phone?.toString()
                      }
                      className={`py-1 px-4 ${themeRenderer(
                        "text-white",
                        "text-black"
                      )}`}
                      keyboardType="number-pad"
                    />
                    {errors.phone && (
                      <Text
                        style={{ fontSize: 10, color: "red" }}
                        className="px-4"
                      >
                        {errors.phone as string}
                      </Text>
                    )}
                  </View>
                  <View>
                    <SocialMediasAccordion
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      openAccordion={{
                        openAccordionState: get.openSocialMedia,
                        setOpenAccordionState: set.setOpenSocialMedia,
                      }}
                      values={values}
                    />
                  </View>
                  <View
                    className={`flex-row justify-center item-center py-2 px-6  mt-2 ${themeRenderer(
                      "bg-black",
                      "bg-white"
                    )}`}
                  >
                    <Button
                      buttonStyle={{ backgroundColor: Colors.main }}
                      containerStyle={{ width: "40%" }}
                      onPress={() => handleSubmit()}
                      loading={get.createAdIsLoading}
                    >
                      Post Ad
                    </Button>
                  </View>
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
}
