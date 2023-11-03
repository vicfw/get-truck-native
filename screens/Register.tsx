import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { Formik } from "formik";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import PasswordInput from "../components/UI/PasswordInput";
import Colors from "../constants/Colors";
import {
  handleAddToken,
  handleAddUser,
  handleSignIn,
} from "../redux/features/userSlice";
import { storeData } from "../redux/services/deviceStorage";
import { useSignupUserMutation } from "../redux/services/userServices";
import { registerValidationSchema } from "../utils/yupSchema";

const Register = ({ navigation }: any) => {
  const [createUser, { isLoading, data, error, status }] =
    useSignupUserMutation();
  const dispatch = useDispatch();

  const navigate = useNavigation();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  }) => {
    try {
      const { data, status, token } = await createUser(values).unwrap();

      if (data.user?._id) {
        try {
          const { user } = data;
          await storeData(token, "token");
          await storeData(user, "user");

          dispatch(handleSignIn(true));
          dispatch(handleAddToken(token));
          dispatch(
            handleAddUser({
              id: user._id,
              email: user.email,
              name: user.name,
              photo: user.photo,
              role: user.role,
              notificationToken: user.notificationToken,
            })
          );
        } catch (e) {}
      }
    } catch (e: any) {
      if (e.data.message.includes("Duplicate")) {
        Toast.show({
          type: "error",
          text1: "Email used before,Please use another one.",
          autoHide: true,
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong,Please try again later.",
          autoHide: true,
          visibilityTime: 3000,
        });
      }
    }
  };

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View className="flex-1 py-7 m-5 rounded-xl">
        <Text style={{ color: Colors.main }} className="text-5xl px-2">
          Hi,Welcome
        </Text>
        {/* formik */}
        <View className="pt-5 px-2">
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
              name: "",
            }}
            validationSchema={registerValidationSchema}
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
                    <PasswordInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholder="Password"
                    />

                    <Text className="text-gray-500 text-xs">
                      Please use uppercase lowercase number symbol and at least
                      8 characters
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
                  <View className="">
                    <TextInput
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                      placeholder="Name"
                      className="h-12 px-2 bg-gray-100 rounded-lg"
                    />
                    {errors.name && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.name}
                      </Text>
                    )}
                  </View>
                  {/* forgot password */}
                  <View className="items-end gap-1">
                    <Text style={{ color: Colors.main }} className="text-md">
                      Forgot Password ?
                    </Text>
                    <Text
                      style={{ color: Colors.main }}
                      className="text-md"
                      onPress={() => navigate.navigate("Login")}
                    >
                      Log in
                    </Text>
                  </View>
                  <View>
                    <Button
                      onPress={() => handleSubmit()}
                      color={Colors.main}
                      buttonStyle={{ borderRadius: 30 }}
                      containerStyle={{ width: "100%" }}
                      loading={isLoading}
                    >
                      Continue
                    </Button>
                  </View>
                </View>
              );
            }}
          </Formik>
          <View className="pt-3">
            <Text className="text-center text-xs text-gray-500">
              By clicking 'continue' you acknowledge and agree to our{" "}
              <Text style={{ color: Colors.main }}>Term of Use </Text> and{" "}
              <Text style={{ color: Colors.main }}> Privacy Policy. </Text>.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
