import React, { FC, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  LatLng,
  Marker,
  Region,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { Button } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface MapModalIProps {
  showMap: {
    showMap: boolean;
    setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  };
  mapRegion?: Region | undefined;
  location: {
    location: LatLng;
    setLocation: (value: React.SetStateAction<LatLng>) => void;
  };
}

const MapModal: FC<MapModalIProps> = ({ location, mapRegion, showMap }) => {
  const { location: loc, setLocation } = location;
  const navigation = useNavigation();
  const WIDTH = Dimensions.get("window").width;
  const [showPlacesModal, setShowPlacesModal] = useState(false);

  const mapRef = React.useRef<MapView | null>(null);

  const [placeData, setPlaceData] = useState<GooglePlaceData>();

  return <Text>g</Text>;
};

export default MapModal;
