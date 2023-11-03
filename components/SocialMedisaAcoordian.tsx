import { View, Text, TextInput } from "react-native";
import React, { Dispatch, FC, SetStateAction } from "react";
import { ListItem, Icon } from "@rneui/base";
import Colors from "../constants/Colors";
import { themeRenderer } from "../constants/Common";

const socialMedias = [
  {
    name: "facebook",
    iconType: "entypo",
    iconName: "facebook-with-circle",
    placeholder: "Facebook",
  },
  {
    name: "instagram",
    iconType: "entypo",
    iconName: "instagram-with-circle",
    placeholder: "Instagram",
  },
  {
    name: "twitter",
    iconType: "entypo",
    iconName: "twitter-with-circle",
    placeholder: "Twitter",
  },
  {
    name: "youtube",
    iconType: "entypo",
    iconName: "youtube-with-circle",
    placeholder: "YouTube",
  },
  {
    name: "tiktok",
    iconType: "font-awesome-5",
    iconName: "tiktok",
    placeholder: "TikTok",
  },
  {
    name: "pinterest",
    iconType: "entypo",
    iconName: "pinterest-with-circle",
    placeholder: "Pinterest",
  },
  {
    name: "linkedin",
    iconType: "entypo",
    iconName: "linkedin-with-circle",
    placeholder: "LinkedIn",
  },
];

interface SocialMediasAccordionIProps {
  openAccordion: {
    openAccordionState: boolean;
    setOpenAccordionState: Dispatch<SetStateAction<boolean>>;
  };
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  values: any;
}

const SocialMediasAccordion: FC<SocialMediasAccordionIProps> = ({
  openAccordion,
  handleBlur,
  handleChange,
  values,
}) => {
  const { openAccordionState, setOpenAccordionState } = openAccordion;
  return (
    <ListItem.Accordion
      containerStyle={{ backgroundColor: themeRenderer("#1c1917", "#fff") }}
      icon={
        <Icon
          name="chevron-down"
          type="entypo"
          size={20}
          color={Colors["gray-500"]}
        />
      }
      content={
        <>
          <ListItem.Content>
            <ListItem.Title style={{ color: Colors["gray-500"], fontSize: 14 }}>
              Social medias (Optional)
            </ListItem.Title>
          </ListItem.Content>
        </>
      }
      isExpanded={openAccordionState}
      onPress={() => {
        setOpenAccordionState((perv) => !perv);
      }}
    >
      {socialMedias.map((socialMedia, i) => (
        <ListItem
          key={i}
          onPress={() => {}}
          bottomDivider
          containerStyle={{ backgroundColor: themeRenderer("#1c1917", "#fff") }}
        >
          <View className="flex flex-row items-center gap-2 ">
            {socialMedia.name === "tiktok" ? (
              <View
                className="w-6 h-6 flex justify-center items-center rounded-full"
                style={{ backgroundColor: Colors.main }}
              >
                <Icon
                  name={socialMedia.iconName}
                  type={socialMedia.iconType}
                  color="#fff"
                  size={13}
                />
              </View>
            ) : (
              <Icon
                name={socialMedia.iconName}
                type={socialMedia.iconType}
                color={Colors.main}
              />
            )}
            <View className="bg-white rounded-md" style={{ width: "90%" }}>
              {/* <Text className="text-gray-500  px-3">Title</Text> */}
              <TextInput
                onChangeText={handleChange(socialMedia.name)}
                onBlur={handleBlur(socialMedia.name)}
                value={values[socialMedia.name]}
                placeholder={socialMedia.placeholder}
                className="py-1 px-4 border rounded-md border-gray-400"
              />
              {/* {errors.title ? (
              <Text
                style={{ fontSize: 10, color: 'red' }}
                className="px-3"
              >
                {errors.title as string}
              </Text>
            ) : null} */}
            </View>
          </View>
        </ListItem>
      ))}
    </ListItem.Accordion>
  );
};

export default SocialMediasAccordion;
