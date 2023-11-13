import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value: any, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {}
};
export const getLocalStorageData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {}
};
