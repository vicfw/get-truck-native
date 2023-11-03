import { NotificationSender } from './../../../globalTypes';
import { Ad } from '../../../globalTypes';

export interface CreateOrUpdateAdResponse {
  ad: Ad;
  status: string;
}

export interface CreateOrUpdateAdBody
  extends Omit<
    Ad,
    | 'isApproved'
    | 'isPopular'
    | 'createdAt'
    | 'updatedAt'
    | '_id'
    | 'featuredAd'
    | 'creator'
  > {}

export interface GetAllAdsResponse {
  status: string;
  count: number;
  totalCount: number;
  ads: Ad[];
}

export interface GetSingleAdResponse {
  status: string;
  ad: Ad;
}

export interface DeleteAdResponse {
  status: string;
  data: null;
}

export type AdFilterType =
  | {
      title?: string;
      description?: string;
      category?: string;
      price?: string | null[];
      saleBy?: string;
      condition?: string;
      location?: string;
      address?: string;
      phone?: number | null;
      kilometers?: string | null[];
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
      limit?: number;
      page?: number;
      isApproved?: string;
    }
  | undefined;

export type AdSearchType = {
  query: string;
};
