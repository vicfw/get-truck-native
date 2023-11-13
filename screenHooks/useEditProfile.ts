import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as MailComposer from "expo-mail-composer";
import { useFormik } from "formik";
import mime from "mime";
import React from "react";
import { Dimensions, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { handleSignIn } from "../redux/features/userSlice";
import { useUploadProfilePhotoMutation } from "../redux/services/uploadService";
import {
  useMeQuery,
  useUpdateUserMutation,
} from "../redux/services/userServices";
import { RootStackParamList } from "../types";
import { editProfileValidationSchema } from "../utils/yupSchema";
import { clearStorage } from "./../redux/services/deviceStorage";

export function useEditProfile(
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "EditProfile",
    undefined
  >
) {
  const randomId = React.useId();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = React.useState("");
  const [uiProfileImage, setUIProfileImage] = React.useState("");
  const [emailStatus, setEmailStatus] = React.useState("");
  const width = Dimensions.get("window").width;
  const { data, isFetching } = useMeQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [uploadProfilePhoto, { isLoading: profilePhotoLoading }] =
    useUploadProfilePhotoMutation();
  const formInitialValues = {
    name: data?.data.name,
    email: data?.data.email,
  };
  const formik = useFormik({
    initialValues: formInitialValues,
    onSubmit: (values) => {
      updateUserHandler(values);
    },
    validationSchema: editProfileValidationSchema,
  });
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const data = new FormData();
      const photo = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      // @ts-ignore
      data.append("image", {
        // @ts-ignore
        name: photo.fileName + randomId ?? "file" + randomId,
        type: mime.getType(photo.uri)!,
        uri:
          Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
      });
      try {
        const result = await uploadProfilePhoto(data);
        // @ts-ignore
        if (result.data.status === "success") {
          setUIProfileImage(photo.uri);
          // @ts-ignore
          setProfileImage(result.data.data);
        }
      } catch (e) {
        console.log(e, "error");
      }
    }
  };
  const sendEmail = async () => {
    const options = {
      subject: "",
      recipients: ["gettruckgroup@gmail.com"],
      body: "",
    };
    let promise = new Promise((resolve, reject) => {
      MailComposer.composeAsync(options)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
    promise.then(
      (result: any) => {
        setEmailStatus("Status: email " + result.status);
        Toast.show({
          text1: "Email successfully sent.",
          autoHide: true,
          visibilityTime: 5000,
        });
      },
      (error) => setEmailStatus("Status: email " + error.status)
    );
  };
  const handleLogOut = async () => {
    await clearStorage();
    dispatch(handleSignIn(false));
  };
  const updateUserHandler = async (values: typeof formInitialValues) => {
    try {
      await updateUser({
        ...values,
        photo: profileImage.length ? profileImage : undefined,
      });
      Toast.show({
        text1: "Profile successfully updated.",
        autoHide: true,
        visibilityTime: 5000,
      });
      navigation.navigate("Profile");
    } catch (e) {
      console.log(e, "error");
    }
  };
  return {
    get: { profilePhotoLoading, formik, width, data, uiProfileImage },
    set: {},
    on: { pickImage, handleLogOut, sendEmail },
  };
}
