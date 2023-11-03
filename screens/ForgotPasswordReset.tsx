import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { Formik } from "formik";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import PasswordInput from "../components/UI/PasswordInput";
import Colors from "../constants/Colors";
import { useForgotPasswordResetMutation } from "../redux/services/userServices";
import { RootStackScreenProps } from "../types";
import { forgotPasswordResetSchema } from "../utils/yupSchema";

const ForgotPasswordReset: React.FC<
  RootStackScreenProps<"ForgotPasswordReset">
> = ({ route, navigation }) => {
  const code = route.params.code;

  const [forgotPasswordReset, { isLoading, isError }] =
    useForgotPasswordResetMutation();
  const dispatch = useDispatch();

  const navigate = useNavigation();

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await forgotPasswordReset({
        confirmPassword: values.confirmPassword,
        password: values.password,
        token: code,
      }).unwrap();
      if (isError) return;
      navigation.navigate("Login");
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Something went wrong,Please try again later.",
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={{ flexGrow: 1 }}>
        <View className="flex-1  m-5  rounded-xl">
          {/* formik */}
          <View className="pt-5 px-2">
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={forgotPasswordResetSchema}
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
                  <View className="gap-3">
                    <View>
                      <PasswordInput
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        placeholder="Password"
                      />

                      <Text className="text-gray-500 text-xs">
                        Please use uppercase lowercase number symbol and at
                        least 8 characters
                      </Text>
                      {errors.password && (
                        <Text style={{ fontSize: 10, color: "red" }}>
                          {errors.password}
                        </Text>
                      )}
                    </View>
                    <View>
                      <PasswordInput
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                        placeholder="Confirm Password"
                      />
                      {errors.confirmPassword && (
                        <Text style={{ fontSize: 10, color: "red" }}>
                          {errors.confirmPassword}
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
                        Change Password
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

export default ForgotPasswordReset;
