export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  active: boolean;
  notificationToken: string;
  featuredAds: FeatureAd[] | [];
  ads: Ad[] | [];
}

export interface Category {
  _id: string;
  children: Category[];
  name: string;
  categoryImage: string;
  parentId: string | null;
  ads?: Ad[];
}

export interface SocialMedia {
  [key: string]: string | undefined;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
  linkedin?: string;
}

export interface Ad {
  _id: string;
  title: string;
  adImages: {
    xs: string[];
    md: string[];
    lg: string[];
  };
  description: string;
  featuredAd: FeatureAd | undefined;
  category: Category | string;
  year: string | undefined;
  address?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  price: number | undefined;
  socialMedia: SocialMedia;
  phone?: number;
  condition: string;
  saleBy: string;
  isApproved: boolean;
  isPopular: boolean;
  brand?: string;
  kilometers?: number;
  transmission?: string;
  engineHP?: string;
  engine?: string;
  exteriorColor?: string;
  differential?: string;
  frontAxel?: string;
  realAxel?: string;
  suspension?: string;
  wheelbase?: string;
  wheels?: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
}

export interface FeatureAd {
  _id: string;
  ad: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
  ad: Ad;
  latestMessage: {
    _id: string;
    sender: User;
    content: string;
    chat: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface NotificationSender {
  _id: string;
  user: User;
  categoryId: string | Category;
  minYear: number;
  maxYear: number;
  minKilometers: number;
  maxKilometers: number;
  brand: string;
}

export interface Message {
  readBy: User[];
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  _id: string;
  searchTerm: string;
  user: User;
}
