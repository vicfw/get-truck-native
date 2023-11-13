import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Colors from "../constants/Colors";
import { useForgotPasswordValidationMutation } from "../redux/services/userServices";

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from "../styles/ForgotPasswordValidationStyle";

const ForgotPasswordValidationScreen = () => {
  const { Value, Text: AnimatedText } = Animated;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 4 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [handleForgotPasswordValidation, { isLoading }] =
    useForgotPasswordValidationMutation();
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;

  const handleSubmit = async () => {
    try {
      const result = await handleForgotPasswordValidation({
        code: value,
      }).unwrap();

      navigation.navigate("ForgotPasswordReset", { code: value });
    } catch (e: any) {
      return Toast.show({
        type: "error",
        text1: e.data?.message,
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  };

  const animationsColor = [...new Array(4)].map(() => new Value(0));
  const animationsScale = [...new Array(4)].map(() => new Value(1));
  const animateCell = ({
    hasValue,
    index,
    isFocused,
  }: {
    hasValue: boolean;
    index: number;
    isFocused: boolean;
  }) => {
    Animated.parallel([
      Animated.timing(animationsColor[index], {
        useNativeDriver: false,
        toValue: isFocused ? 1 : 0,
        duration: 250,
      }),
      Animated.spring(animationsScale[index], {
        useNativeDriver: false,
        toValue: hasValue ? 0 : 1,
        // @ts-ignore
        duration: hasValue ? 300 : 250,
      }),
    ]).start();
  };

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  useEffect(() => {
    if (value.length === 4) {
      handleSubmit();
    }
  }, [value]);

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

          <View className="pt-5 flex-1 px-3 ">
            <View className="gap-7">
              <Text style={styles.subTitle}>
                Please enter the verification code{"\n"}
                we send to your email address
              </Text>
              <View>
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={4}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={renderCell}
                />
              </View>

              <View>
                <Button
                  onPress={handleSubmit}
                  color={Colors.main}
                  buttonStyle={{ borderRadius: 30 }}
                  containerStyle={{ width: "100%" }}
                  loading={isLoading}
                >
                  Check
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordValidationScreen;
