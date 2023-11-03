import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import Colors from "../constants/Colors";
import { Button } from "@rneui/themed";
import { Formik } from "formik";
import { loginValidationSchema } from "../utils/yupSchema";
import { useLoginUserMutation } from "../redux/services/userServices";
import { storeData } from "../redux/services/deviceStorage";
import PasswordInput from "../components/UI/PasswordInput";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "../redux/hooks";
import {
  handleAddToken,
  handleAddUser,
  handleSignIn,
} from "../redux/features/userSlice";

const Login = () => {
  const [handleLoginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigation();

  const width = Dimensions.get("window").width;

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const { data, status, token } = await handleLoginUser(values).unwrap();

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
              notificationToken: "",
            })
          );
        } catch (e) {}
      }
    } catch (e: any) {
      if (e.data?.message?.includes("Incorrect")) {
        return Toast.show({
          type: "error",
          text1: e.data?.message?.concat("."),
          autoHide: true,
          visibilityTime: 3000,
        });
      }
      return Toast.show({
        type: "error",
        text1: e?.data?.message,
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 py-7 m-5 rounded-xl">
        <View
          className="flex-row items-end px-3"
          style={{ position: "relative", height: width / 1.53 }}
        >
          <Text style={{ color: Colors.main }} className="text-4xl">
            Hi ,
          </Text>
          <Image
            source={require("../assets/images/sign_in_2.png")}
            style={{ width: "100%", height: 300, position: "absolute" }}
          />
        </View>
        <Text style={{ color: Colors.main }} className="text-4xl px-3">
          Welcome back.
        </Text>
        {/* formik */}
        <View className="pt-5 flex-1 px-3 ">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
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

                  <View className="">
                    <PasswordInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholder="Password"
                    />

                    {errors.password && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  {/* forgot password */}
                  <View className="items-end gap-1">
                    <Pressable
                      onPress={() =>
                        navigate.navigate("ForgotPasswordEmailScreen")
                      }
                    >
                      <Text style={{ color: Colors.main }} className="text-md">
                        Forgot Password ?
                      </Text>
                    </Pressable>

                    <Pressable onPress={() => navigate.navigate("Register")}>
                      <Text style={{ color: Colors.main }} className="text-md">
                        Create new account !
                      </Text>
                    </Pressable>
                  </View>
                  <View>
                    <Button
                      onPress={() => handleSubmit()}
                      color={Colors.main}
                      buttonStyle={{ borderRadius: 30 }}
                      containerStyle={{ width: "100%" }}
                      loading={isLoading}
                    >
                      Login
                    </Button>
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
