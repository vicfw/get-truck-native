import { Ad } from "../../../globalTypes";
export interface FeaturedAdResponse {}
export interface CreateFeaturedAd {
  ad: string;
}
export interface GetFeaturedAdByUserResponse {
  status: string;
  featureAd: {
    _id: string;
    ad: Ad;
  }[];
  createdAt: string;
  updatedAt: string;
}
