import { Button, Icon } from "@rneui/themed";
import { Formik } from "formik";
import React from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import { TRAILER_BRANDS, TRUCKS_BRANDS } from "../constants/Brands";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";
import { useNotificationSender } from "../screenHooks/useNotificationSender";
import { createNotificationSenderSchema } from "../utils/yupSchema";

const NotificationSenderScreen = () => {
  const { get, set, on } = useNotificationSender();

  if (get.notificationSenderLoading) {
    return <ActivityIndicator color={Colors.main} />;
  }

  return (
    <View className="flex-1">
      <View>
        <Formik
          initialValues={get.formInitialValues}
          enableReinitialize
          validationSchema={createNotificationSenderSchema}
          onSubmit={(values, { resetForm }) => {
            on.onCreateNotificationSender(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
            return (
              <View className="gap-4">
                {/* category */}
                <View className={themeRenderer("bg-stone-900", "bg-white")}>
                  <RNPickerSelect
                    onValueChange={handleChange("category")}
                    useNativeAndroidPickerStyle={false}
                    fixAndroidTouchableBug
                    value={values.category as string}
                    style={get.selectPickerStyles}
                    placeholder={{
                      label: "Select a category",
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
                      className="px-3"
                    >
                      {errors.category as string}
                    </Text>
                  )}
                </View>
                {/* year */}
                <View
                  className={`${themeRenderer(
                    "bg-stone-900",
                    "bg-white"
                  )}} d-flex flex-row justify-between`}
                >
                  <View
                    style={{ width: "50%" }}
                    className={themeRenderer("bg-stone-900", "bg-white")}
                  >
                    <Text
                      className={`${themeRenderer(
                        "text-white",
                        "text-gray-500"
                      )} pt-2 px-3`}
                    >
                      Minimum Year
                    </Text>
                    <RNPickerSelect
                      onValueChange={handleChange("minYear")}
                      useNativeAndroidPickerStyle={false}
                      fixAndroidTouchableBug
                      value={values.minYear.toString()}
                      style={get.selectPickerStyles}
                      placeholder={{
                        label: "Select minimum year",
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
                  </View>
                  <View
                    style={{ width: "50%" }}
                    className={themeRenderer("bg-stone-900", "bg-white")}
                  >
                    <Text
                      className={`${themeRenderer(
                        "text-white",
                        "text-gray-500"
                      )} pt-2 px-3`}
                    >
                      Minimum Year
                    </Text>
                    <RNPickerSelect
                      onValueChange={handleChange("maxYear")}
                      useNativeAndroidPickerStyle={false}
                      fixAndroidTouchableBug
                      value={values.maxYear.toString()}
                      style={get.selectPickerStyles}
                      placeholder={{
                        label: "Select maximum year",
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
                  </View>
                </View>

                {/* brand */}
                {on
                  .findParent(values.category! as string)
                  ?.name.toLowerCase() === "trailers" ||
                on
                  .findParent(values.category! as string)
                  ?.name.toLowerCase() === "trucks" ? (
                  <View className={themeRenderer("bg-stone-900", "bg-white")}>
                    <RNPickerSelect
                      onValueChange={handleChange("brand")}
                      useNativeAndroidPickerStyle={false}
                      value={values.brand}
                      style={get.selectPickerStyles}
                      placeholder={{
                        label: "Select a brand",
                        value: "",
                      }}
                      items={
                        (values.category as string)?.includes(
                          get.trucksCategoryId
                        )
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
                  </View>
                ) : null}
                {/* kilometers */}
                <View
                  className={`${themeRenderer(
                    "bg-stone-900",
                    "bg-white"
                  )} flex flex-row justify-between`}
                >
                  <View>
                    <Text
                      className={`${themeRenderer(
                        "text-white",
                        "text-gray-500"
                      )} pt-2 px-3`}
                    >
                      Minimum kilometers
                    </Text>
                    <TextInput
                      onChangeText={handleChange("minKilometers")}
                      onBlur={handleBlur("minKilometers")}
                      value={
                        !values.minKilometers
                          ? ""
                          : values.minKilometers?.toString()
                      }
                      className={`${themeRenderer(
                        "text-white",
                        "text-black"
                      )} py-1 px-4`}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View>
                    <Text
                      className={`${themeRenderer(
                        "text-white",
                        "text-gray-500"
                      )} pt-2 px-3`}
                    >
                      Maximum kilometers
                    </Text>
                    <TextInput
                      onChangeText={handleChange("maxKilometers")}
                      onBlur={handleBlur("maxKilometers")}
                      value={
                        !values.maxKilometers
                          ? ""
                          : values.maxKilometers?.toString()
                      }
                      className={`${themeRenderer(
                        "text-white",
                        "text-black"
                      )} py-1 px-4`}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                <View>
                  <View className="px-3">
                    {errors.minYear && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.minYear as string}
                      </Text>
                    )}
                  </View>
                  <View className="px-3">
                    {errors.maxYear && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.maxYear as string}
                      </Text>
                    )}
                  </View>
                  <View className="px-3">
                    {errors.minKilometers && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.minKilometers as string}
                      </Text>
                    )}
                  </View>
                  <View className="px-3">
                    {errors.maxKilometers && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.maxKilometers as string}
                      </Text>
                    )}
                  </View>
                  <View className="flex-row justify-around item-center py-2 px-6 bg-transparent">
                    <Button
                      buttonStyle={{ backgroundColor: Colors.main }}
                      containerStyle={{ width: "50%" }}
                      onPress={() => handleSubmit()}
                      loading={
                        get.notificationsToSend?._id
                          ? get.updateNotificationSenderLoading
                          : get.createNotificationSenderLoading
                      }
                    >
                      {get.notificationsToSend?._id ? "Update" : "Create"}{" "}
                      Notification
                    </Button>
                    <Button
                      buttonStyle={{
                        backgroundColor: Colors["gray-500"],
                        marginLeft: 2,
                      }}
                      containerStyle={{ width: "40%" }}
                      onPress={() =>
                        on.deleteNotificationSenderHandler(
                          get.notificationsToSend?._id as string
                        )
                      }
                      loading={get.deleteNotificationSenderLoading}
                    >
                      Remove
                    </Button>
                  </View>
                </View>
              </View>
            );
          }}
        </Formik>
      </View>
    </View>
  );
};

export default NotificationSenderScreen;
