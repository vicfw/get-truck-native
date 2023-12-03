import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { usePushNotification } from "./hooks/usePushNotification";
import Navigation from "./navigation";
import { store } from "./redux/store";
import { useEffect } from "react";
import { MobileAds } from "react-native-google-mobile-ads";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  usePushNotification();
  // useEffect(() => {
  //   MobileAds()
  //     .initialize()
  //     .then((adapterStatuses) => {
  //       console.log("Initialization complete!");
  //       // Initialization complete!
  //     });
  // }, []);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
          <Toast position="top" topOffset={100} />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
