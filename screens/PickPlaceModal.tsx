import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "@rneui/themed";
import React, { FC, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { GOOGLE_API_KEY } from "@env";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Toast from "react-native-toast-message";
import Colors from "../constants/Colors";
import { RootStackScreenProps } from "../types";

const PickPlaceModal: FC<RootStackScreenProps<"PickPlace">> = ({ route }) => {
  const navigation = useNavigation();
  const [showPlaceFinderModal, setShowPlaceFinderModal] = useState(false);

  const WIDTH = Dimensions.get("window").width;

  const mapRef = React.useRef<MapView | null>(null);

  const [location, setLocation] = useState(route.params.address ?? "");
  const [convertCoorsLoading, setConvertCoorsLoading] = useState(false);

  const [mapRegion, setMapRegion] = useState({
    latitude: route.params.lat ?? 43.6532,
    longitude: route.params.lng ?? -79.3832,
    latitudeDelta: 0.0922 * 2,
    longitudeDelta: 0.0421 * 2,
  });

  const convertCoordinatesToAddress = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const apiKey = GOOGLE_API_KEY;

      setConvertCoorsLoading(true);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setLocation(address);
          setConvertCoorsLoading(false);
        } else {
          setConvertCoorsLoading(false);

          return Toast.show({
            type: "error",
            text1: "Something went wrong.",
            autoHide: true,
            visibilityTime: 5000,
          });
        }
      } else {
        setConvertCoorsLoading(false);

        return Toast.show({
          type: "error",
          text1: "Network error.",
          autoHide: true,
          visibilityTime: 5000,
        });
      }
    } catch (error) {
      setConvertCoorsLoading(false);

      return Toast.show({
        type: "error",
        text1: "Something went wrong.",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return Toast.show({
        type: "error",
        text1: "Please grant gps access to continue",
        autoHide: true,
        visibilityTime: 5000,
      });
    }
    setConvertCoorsLoading(true);
    let { coords } = await Location.getCurrentPositionAsync({});

    setMapRegion((perv) => ({
      ...perv,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));

    await convertCoordinatesToAddress(coords.latitude, coords.longitude);

    setShowPlaceFinderModal(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <TouchableOpacity
          style={{
            position: "absolute",
            width: WIDTH / 1.2,

            backgroundColor: "#fff",
            top: "20%",
            left: "20%",
            marginLeft: -50,
            marginTop: -50,
            zIndex: 2,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 30,
          }}
          onPress={() => {
            setShowPlaceFinderModal(true);
          }}
        >
          <View
            className="d-flex flex-row gap-5 items-center"
            style={{ width: "100%" }}
          >
            <Icon type="ant-design" name="search1" />
            <View>
              <Text className="text-gray-400">
                Search address,city,postal code
              </Text>
              <Text style={{ width: "70%" }}>{location ?? "Torento"}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <MapView
          style={{ alignSelf: "stretch", height: "100%" }}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
          onPress={async (e) => {
            e.persist();
            setMapRegion((perv) => ({
              ...perv,
              latitude: e.nativeEvent?.coordinate?.latitude,
              longitude: e.nativeEvent?.coordinate?.longitude,
            }));
            await convertCoordinatesToAddress(
              e.nativeEvent?.coordinate?.latitude,
              e.nativeEvent?.coordinate?.longitude
            );
          }}
        >
          {mapRegion && <Marker coordinate={mapRegion} />}
        </MapView>
        <View
          style={{
            position: "absolute",
            width: WIDTH / 2,
            height: 100,
            bottom: "10%",
            left: "40%",
            marginLeft: -60,
            marginBottom: -50,
            zIndex: 2,
          }}
        >
          <Button
            title={"Apply"}
            color={Colors.main}
            loading={convertCoorsLoading}
            disabled={!!!location}
            containerStyle={{ borderRadius: 5 }}
            onPress={() => {
              route.params.fromScreen === "create"
                ? navigation.navigate("PostAd", {
                    address: location,
                    lat: mapRegion.latitude,
                    lng: mapRegion.longitude,
                  })
                : navigation.navigate("EditModal", {
                    address: location,
                    lat: mapRegion.latitude,
                    lng: mapRegion.longitude,
                    adId: route.params.adId!,
                  });
            }}
          />
        </View>
      </View>
      <Modal visible={showPlaceFinderModal} animationType="fade">
        <View className="flex-1 px-2 pt-2">
          <View className="flex items-start mb-5">
            <Icon
              type="ant-design"
              name="back"
              onPress={() => setShowPlaceFinderModal(false)}
            />
          </View>
          <TouchableOpacity
            onPress={handleGetLocation}
            className="flex flex-row gap-2 items-center mb-4"
          >
            {convertCoorsLoading ? (
              <ActivityIndicator color={Colors.main} />
            ) : (
              <Icon type="material" name="gps-fixed" color={Colors.main} />
            )}
            <Text>Get my current location</Text>
          </TouchableOpacity>
          <GooglePlacesAutocomplete
            placeholder="Type a place"
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
            }}
            fetchDetails={true}
            onPress={(data, details) => {
              setMapRegion((perv) => ({
                ...perv,
                latitude: details?.geometry.location.lat ?? 0,
                longitude: details?.geometry.location.lng ?? 0,
              }));
              setLocation(details?.name as string);
              setShowPlaceFinderModal(false);
            }}
            onFail={(error) => console.log(error)}
            keyboardShouldPersistTaps="handled"
            listViewDisplayed={false}
            onNotFound={() => console.log("no results")}
            styles={{
              container: { width: "100%", zIndex: 1000 },
              textInput: {
                borderWidth: 1,
                borderRadius: 30,
                zIndex: 1000,
              },
            }}
          />

          <View className="flex-1"></View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PickPlaceModal;
