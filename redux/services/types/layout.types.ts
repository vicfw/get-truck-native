export type Banner = {
  _id: string;
  mobileBanner: string;
  mobileBannerLink: string;
};
export type GetBannerResponse = {
  status: string;
  data: Banner;
};
