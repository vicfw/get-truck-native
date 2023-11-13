import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useTogglePasswordVisibility } from "../../hooks/useToggleShowPassword";

interface PasswordInputProps extends TextInputProps {}
const PasswordInput: FC<PasswordInputProps> = (props) => {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          secureTextEntry={passwordVisibility}
          {...props}
          enablesReturnKeyAutomatically
        />
        <Pressable onPress={handlePasswordVisibility}>
          <MaterialCommunityIcons name={rightIcon} size={22} color="#696666" />
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    backgroundColor: "#F3F4F6",
    width: "100%",
    borderRadius: 7,
    justifyContent: "space-between",
    paddingRight: 10,
    paddingStart: 9,
    flexDirection: "row",
    alignItems: "center",
    height: 47,
  },
  inputField: {
    fontSize: 15,
    width: "90%",
  },
});
export default PasswordInput;
