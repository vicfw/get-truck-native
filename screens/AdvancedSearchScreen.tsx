import { Button, Icon } from "@rneui/themed";
import { Formik } from "formik";
import React, { FC } from "react";
import { Platform, ScrollView, Text, TextInput, View } from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TRAILER_BRANDS, TRUCKS_BRANDS } from "../constants/Brands";
import Colors from "../constants/Colors";
import { useAdvancedSearch } from "../screenHooks/useAdvancedSearch";
import { RootStackScreenProps } from "../types";
import { adFilterValidationSchema } from "../utils/yupSchema";
import { themeRenderer } from "../constants/Common";

const AdvancedSearchScreen: FC<RootStackScreenProps<"SearchModal">> = ({
  navigation,
}) => {
  const { get, set, on } = useAdvancedSearch();

  const trucksCategoryInputs = (
    handleChange: any,
    handleBlur: any,
    values: any
  ) => (
    // kilometers
    <View>
      {/* kilometers */}
      <View className="bg-white w-100 mb-4">
        <Text className="text-gray-500 pt-2 px-3">Kilometers</Text>
        <View className="flex flex-row">
          <View className="flex flex-row pt-2 px-3 items-center">
            <Text className="text-gray-700">MinKM:</Text>
            <TextInput
              onChangeText={handleChange("minKilometers")}
              onBlur={handleBlur("minKilometers")}
              value={values.minKilometers}
              keyboardType="number-pad"
              className="py-1 px-1"
              placeholder="Any KM"
            />
          </View>
          <View className="flex flex-row pt-2 px-3 items-center">
            <Text className="text-gray-700">MaxKM:</Text>

            <TextInput
              onChangeText={handleChange("maxKilometers")}
              onBlur={handleBlur("maxKilometers")}
              value={values.maxKilometers}
              keyboardType="number-pad"
              className="py-1 px-1"
              placeholder="Any KM"
            />
          </View>
        </View>
      </View>

      {/* transmission */}
      <View className="bg-white mb-4">
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
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">EngineHP</Text>
        <TextInput
          onChangeText={handleChange("engineHP")}
          onBlur={handleBlur("engineHP")}
          value={values.engineHP}
          className="py-1 px-4"
        />
      </View>
      {/* engine */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Engine</Text>
        <TextInput
          onChangeText={handleChange("engine")}
          onBlur={handleBlur("engine")}
          value={values.engine}
          className="py-1 px-4"
        />
      </View>
      {/* exteriorColor */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Exterior Colour</Text>
        <TextInput
          onChangeText={handleChange("exteriorColor")}
          onBlur={handleBlur("exteriorColor")}
          value={values.exteriorColor}
          className="py-1 px-4"
        />
      </View>
      {/* differential */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Differential</Text>
        <TextInput
          onChangeText={handleChange("differential")}
          onBlur={handleBlur("differential")}
          value={values.differential}
          className="py-1 px-4"
        />
      </View>
      {/* frontAxel */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Front Axel</Text>
        <TextInput
          onChangeText={handleChange("frontAxel")}
          onBlur={handleBlur("frontAxel")}
          value={values.frontAxel}
          className="py-1 px-4"
        />
      </View>
      {/* realAxel */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Rear Axel</Text>
        <TextInput
          onChangeText={handleChange("realAxel")}
          onBlur={handleBlur("realAxel")}
          value={values.realAxel}
          className="py-1 px-4"
        />
      </View>
      {/* suspension */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Suspension</Text>
        <TextInput
          onChangeText={handleChange("suspension")}
          onBlur={handleBlur("suspension")}
          value={values.suspension}
          className="py-1 px-4"
        />
      </View>
      {/* wheelbase */}
      <View className="bg-white mb-4">
        <Text className="text-gray-500 pt-2 px-3">Wheelbase</Text>
        <TextInput
          onChangeText={handleChange("wheelbase")}
          onBlur={handleBlur("wheelbase")}
          value={values.wheelbase}
          className="py-1 px-4"
        />
      </View>
      {/* wheels */}
      <View className="bg-white mb-4">
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
    <SafeAreaView className="flex flex-1" style={{ position: "relative" }}>
      <ScrollView>
        <Formik
          initialValues={get.formInitialValues}
          validationSchema={adFilterValidationSchema}
          onSubmit={(values, { resetForm }) => {
            navigation.navigate("Home", {
              filterData: values,
            });
            resetForm();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
            get.handleSubmitRef.current = handleSubmit;
            return (
              <View className="gap-4">
                {/* validation Errors */}
                {Object.entries(errors).map((err) => (
                  <View className="px-3" key={err[0]}>
                    <Text
                      style={{ fontSize: 10, color: "red" }}
                      className="text-center"
                    >
                      {err[1]}
                    </Text>
                  </View>
                ))}
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
                </View>
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
                        values.category.includes(get.trucksCategoryId.current!)
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
                {/* title */}
                <View className={themeRenderer("bg-stone-900", "bg-white")}>
                  <Text
                    className={`${themeRenderer(
                      "text-white",
                      "text-gray-500"
                    )} pt-2 px-3`}
                  >
                    Title
                  </Text>
                  <TextInput
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    className="py-1 px-4"
                  />
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
                      //   value={values.condition}
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
                  </View>
                ) : null}

                {/* price */}
                <View className={themeRenderer("bg-stone-900", "bg-white")}>
                  <Text
                    className={`${themeRenderer(
                      "text-white",
                      "text-gray-500"
                    )} pt-2 px-3`}
                  >
                    Price
                  </Text>
                  <View className="flex flex-row">
                    <View className="flex flex-row pt-2 px-3 items-center">
                      <Text
                        className={themeRenderer("text-white", "text-gray-700")}
                      >
                        MinPrice:
                      </Text>
                      <TextInput
                        onChangeText={handleChange("minPrice")}
                        onBlur={handleBlur("minPrice")}
                        value={!values.minPrice ? "" : values.minPrice}
                        keyboardType="number-pad"
                        className="py-1 px-1"
                        placeholder="$ Any Price"
                        placeholderTextColor={themeRenderer("#fff", "#000")}
                      />
                    </View>
                    <View className="flex flex-row pt-2 px-3 items-center">
                      <Text
                        className={themeRenderer("text-white", "text-gray-700")}
                      >
                        MaxPrice:
                      </Text>

                      <TextInput
                        onChangeText={handleChange("maxPrice")}
                        onBlur={handleBlur("maxPrice")}
                        value={!values.maxPrice ? "" : values.maxPrice}
                        keyboardType="number-pad"
                        className="py-1 px-1"
                        placeholder="$ Any Price"
                        placeholderTextColor={themeRenderer("#fff", "#000")}
                      />
                    </View>
                  </View>
                </View>

                {/* year */}
                <View className={themeRenderer("bg-stone-900", "bg-white")}>
                  <Text
                    className={`${themeRenderer(
                      "text-white",
                      "text-gray-500"
                    )} pt-2 px-3`}
                  >
                    Year of construction
                  </Text>
                  <View className="flex flex-row">
                    <View className="flex flex-1 flex-row pt-2 px-3 items-center">
                      <Text
                        className={themeRenderer("text-white", "text-gray-700")}
                      >
                        MinYear:
                      </Text>
                      <View
                        className={`${themeRenderer(
                          "bg-stone-900",
                          "bg-white"
                        )} flex-1`}
                      >
                        <RNPickerSelect
                          onValueChange={handleChange("minDate")}
                          useNativeAndroidPickerStyle={false}
                          fixAndroidTouchableBug
                          value={values.minDate}
                          style={get.selectPickerStyles}
                          placeholder={{
                            label: "",
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
                    <View className="flex flex-1 flex-row pt-2 px-3 items-center">
                      <Text
                        className={themeRenderer("text-white", "text-gray-700")}
                      >
                        MaxYear:
                      </Text>

                      <View
                        className={`${themeRenderer(
                          "bg-stone-900",
                          "bg-white"
                        )} flex-1`}
                      >
                        <RNPickerSelect
                          onValueChange={handleChange("maxDate")}
                          useNativeAndroidPickerStyle={false}
                          fixAndroidTouchableBug
                          value={values.maxDate}
                          style={get.selectPickerStyles}
                          placeholder={{
                            label: "",
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
                  </View>
                </View>

                {/* trucks special inputs */}
                {values.category &&
                on.findParent(values.category)?.name.toLowerCase() === "trucks"
                  ? trucksCategoryInputs(handleChange, handleBlur, values)
                  : null}
              </View>
            );
          }}
        </Formik>
      </ScrollView>
      <View
        className={`flex-row justify-center item-center py-2 px-6 mt-2 ${themeRenderer(
          "bg-black",
          "bg-white"
        )}`}
        style={{ position: "absolute", bottom: 0, width: "100%" }}
      >
        <Button
          buttonStyle={{ backgroundColor: Colors.main }}
          containerStyle={{
            width: "50%",
            paddingBottom: Platform.OS === "ios" ? 10 : 0,
          }}
          onPress={() => get.handleSubmitRef.current()}
          //   loading={get.createAdIsLoading}
        >
          Filter
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default AdvancedSearchScreen;
