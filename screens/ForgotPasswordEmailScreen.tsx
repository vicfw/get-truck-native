import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { Formik } from "formik";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Colors from "../constants/Colors";
import { useForgotPasswordEmailMutation } from "../redux/services/userServices";
import { forgotPasswordEmailValidationSchema } from "../utils/yupSchema";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordEmailScreen = () => {
  const [handleForgotPasswordEmail, { isLoading }] =
    useForgotPasswordEmailMutation();
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;

  const handleSubmit = async (values: { email: string }) => {
    try {
      await handleForgotPasswordEmail({ email: values.email }).unwrap();

      navigation.navigate("ForgotPasswordValidationScreen");
    } catch (e: any) {
      return Toast.show({
        type: "error",
        text1: e.data?.message,
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 py-7 m-5 rounded-xl">
          <View
            className="flex-row items-end px-3"
            style={{ position: "relative", height: width / 1.53 }}
          >
            <Image
              source={require("../assets/images/sign_in_2.png")}
              style={{
                width: "100%",
                height: width / 1.3,
                position: "absolute",
              }}
            />
          </View>

          {/* formik */}
          <View className="pt-5 flex-1 px-3 ">
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={forgotPasswordEmailValidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                return (
                  <View className="gap-7">
                    <View>
                      <TextInput
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        placeholder="Email"
                        className="h-12 px-2 bg-gray-100 rounded-lg"
                      />
                      {errors.email && touched.email && (
                        <Text style={{ fontSize: 10, color: "red" }}>
                          {errors.email}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Button
                        onPress={() => handleSubmit()}
                        color={Colors.main}
                        buttonStyle={{ borderRadius: 30 }}
                        containerStyle={{ width: "100%" }}
                        loading={isLoading}
                      >
                        Send Email
                      </Button>
                    </View>
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordEmailScreen;
