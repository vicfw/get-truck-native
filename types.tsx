/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "./globalTypes";
import { AdFilterType } from "./redux/services/types/ad.types";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  EditModal: { adId: string; lat: number; lng: number; address: string };
  NotificationSender: undefined;
  PostAd: { lat: number; lng: number; address: string } | undefined;
  Register: undefined;
  Login: undefined;
  NotFound: undefined;
  PickPlace: {
    lat: number;
    lng: number;
    address: string;
    fromScreen: string;
    adId?: string | undefined;
  };
  Home: { filterData: AdFilterType | undefined; searchTerm?: string };
  ForgotPassword: undefined;
  ForgotPasswordEmailScreen: undefined;
  ForgotPasswordValidationScreen: undefined;
  ForgotPasswordReset: { code: string };
  Categories: undefined;
  Features: undefined;
  SingleAd: {
    adId: string;
    from?: string;
  };
  Category: { categoryId: string; categoryName: string };
  Profile: undefined;
  EditProfile: undefined;
  Chat: { adId: string; chatId: string; users: User[] };
  ChatRoom: undefined;
  SearchModal: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  PostAdTab: undefined;
  HomeTab: { filterData: AdFilterType | undefined } | undefined;
  Features: undefined;
  ProfileTab: undefined;
  ChatRoomTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
