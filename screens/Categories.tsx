import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FC, useState } from "react";
import { Avatar, Icon, ListItem } from "@rneui/themed";
import { useGetAllCategoriesQuery } from "../redux/services/categoryService";
import Colors from "../constants/Colors";
import { RootStackScreenProps } from "../types";
import { themeRenderer } from "../constants/Common";

const CategoriesScreen: FC<RootStackScreenProps<"Categories">> = ({
  navigation,
}) => {
  const [parentExpanded, setParentExpanded] = useState({
    index: 0,
    isExpanded: false,
  });
  const [childIsExpanded, setChildIsExpanded] = useState({
    index: 0,
    isExpanded: false,
  });

  const { isLoading, data, refetch } = useGetAllCategoriesQuery();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={Colors.main} />
      </View>
    );
  }

  return (
    <ScrollView
      className={themeRenderer("bg-black", "bg-white")}
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={isLoading} />
      }
    >
      {data?.map((category, index) => {
        return (
          <ListItem.Accordion
            key={category._id}
            containerStyle={{
              backgroundColor: themeRenderer("#1c1917", "fff"),
            }}
            style={{
              borderStyle: "solid",
              borderBottomWidth: 1,
            }}
            icon={
              <TouchableOpacity
                onPress={() => {
                  if (!category.ads?.length) return;
                  navigation.navigate("Category", {
                    categoryId: category._id,
                    categoryName: category.name,
                  });
                }}
              >
                <View className="d-flex flex-col">
                  <Text
                    style={{
                      color: Colors.main,
                      fontSize: 14,
                    }}
                  >
                    {category.ads?.length} Ad's
                  </Text>
                  <Text
                    className={`text-xs ${themeRenderer(
                      "text-white",
                      "text-black"
                    )}`}
                  >
                    Tap to see
                  </Text>
                </View>
              </TouchableOpacity>
            }
            noRotation
            // noIcon={!item.children.length}
            content={
              <View className="justify-center flex-1 ">
                <Pressable
                  className="flex-row items-center w-1/2"
                  onPress={() => {
                    if (category.children.length) {
                      setParentExpanded({
                        index,
                        isExpanded: !parentExpanded.isExpanded,
                      });
                    }
                  }}
                >
                  <Image
                    style={{ width: 60, height: 60 }}
                    source={{ uri: category.categoryImage }}
                  />
                  <ListItem.Content className="pl-2" onPress={() => {}}>
                    <ListItem.Title>
                      <View className="d-flex flex-row items-center">
                        <Text
                          className={`text-md ${themeRenderer(
                            "text-white",
                            "text-black"
                          )}`}
                        >
                          {category.name}
                        </Text>
                        {!category.children.length ? null : (
                          <View className="ml-1">
                            {parentExpanded.isExpanded &&
                            parentExpanded.index === index ? (
                              <Icon
                                type="antdesign"
                                name="caretup"
                                size={15}
                                color={Colors.main}
                              />
                            ) : (
                              <Icon
                                type="antdesign"
                                name="caretdown"
                                size={15}
                                color={Colors.main}
                              />
                            )}
                          </View>
                        )}
                      </View>
                    </ListItem.Title>
                  </ListItem.Content>
                </Pressable>
              </View>
            }
            isExpanded={
              parentExpanded.index === index ? parentExpanded.isExpanded : false
            }
          >
            {category.children.map((child, index) => (
              <ListItem.Accordion
                style={{
                  borderStyle: "solid",
                  borderBottomWidth: 1,
                  paddingLeft: 10,
                }}
                key={child._id}
                icon={
                  <TouchableOpacity
                    onPress={() => {
                      if (!child.ads?.length) return;
                      navigation.navigate("Category", {
                        categoryId: child._id,
                        categoryName: child.name,
                      });
                    }}
                  >
                    <View className="d-flex flex-col">
                      <Text
                        style={{
                          color: Colors.main,
                          fontSize: 14,
                        }}
                      >
                        {child.ads?.length} Ad's
                      </Text>
                      <Text className="text-xs">Tap to see</Text>
                    </View>
                  </TouchableOpacity>
                }
                noRotation
                content={
                  <View className="flex-1 justify-center">
                    <Pressable
                      className="flex-row items-center"
                      onPress={(e) => {
                        if (child.children.length) {
                          setChildIsExpanded({
                            index,
                            isExpanded: !childIsExpanded.isExpanded,
                          });
                        }
                      }}
                    >
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={{ uri: child.categoryImage }}
                      />
                      <ListItem.Content className="pl-2">
                        <ListItem.Title>
                          <View className="d-flex flex-row items-center">
                            <Text>{child.name}</Text>
                            {!child.children.length ? null : (
                              <View className="ml-1">
                                {childIsExpanded.isExpanded &&
                                childIsExpanded.index === index ? (
                                  <Icon
                                    type="antdesign"
                                    name="caretup"
                                    size={15}
                                    color={Colors.main}
                                  />
                                ) : (
                                  <Icon
                                    type="antdesign"
                                    name="caretdown"
                                    size={15}
                                    color={Colors.main}
                                  />
                                )}
                              </View>
                            )}
                          </View>
                        </ListItem.Title>
                      </ListItem.Content>
                    </Pressable>
                  </View>
                }
                isExpanded={
                  childIsExpanded.index === index
                    ? childIsExpanded.isExpanded
                    : false
                }
              >
                {/* SubChild */}
                {child.children.map((subChild, i: React.Key) => (
                  <ListItem.Accordion
                    style={{
                      borderStyle: "solid",
                      borderBottomWidth: 1,
                      paddingLeft: 10,
                    }}
                    key={subChild._id}
                    icon={
                      <TouchableOpacity
                        onPress={() => {
                          if (!subChild.ads?.length) return;
                          navigation.navigate("Category", {
                            categoryId: subChild._id,
                            categoryName: subChild.name,
                          });
                        }}
                      >
                        <View className="d-flex flex-col">
                          <Text
                            style={{
                              color: Colors.main,
                              fontSize: 14,
                            }}
                          >
                            {subChild.ads?.length} Ad's
                          </Text>
                          <Text className="text-xs">Tap to see</Text>
                        </View>
                      </TouchableOpacity>
                    }
                    noRotation
                    content={
                      <View className="flex-1 justify-center">
                        <Pressable className="flex-row items-center">
                          <Image
                            style={{ width: 20, height: 20 }}
                            source={{ uri: subChild.categoryImage }}
                          />
                          <ListItem.Content>
                            <ListItem.Title style={{ marginLeft: 8 }}>
                              {subChild.name}
                            </ListItem.Title>
                          </ListItem.Content>
                        </Pressable>
                      </View>
                    }
                  ></ListItem.Accordion>
                ))}
              </ListItem.Accordion>
            ))}
          </ListItem.Accordion>
        );
      })}
    </ScrollView>
  );
};

export default CategoriesScreen;
