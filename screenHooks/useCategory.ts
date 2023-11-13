import { RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Ad } from "../globalTypes";
import { useGetAllAdsQuery } from "../redux/services/adService";
import { RootStackParamList } from "./../types";

export const useCategory = (
  route: RouteProp<RootStackParamList, "Category">
) => {
  const [adData, setAdData] = useState<Ad[] | []>([]);
  const [pagination, setPagination] = useState<{
    limit: number;
    page: number;
  }>({ limit: 6, page: 0 });
  const {
    data: allAds,
    isLoading: adDataLoading,
    refetch,
    isFetching: adDataFetching,
  } = useGetAllAdsQuery(
    { ...pagination!, category: route.params.categoryId, isApproved: "true" },
    { refetchOnMountOrArgChange: true }
  );
  const onRefresh = () => {
    setPagination((perv) => ({ ...perv, page: 0 }));
    refetch();
    setAdData(allAds?.ads!);
  };
  const handleLoadMore = () => {
    // we return if products end
    if (allAds?.totalCount === adData.length) return;
    if (adDataFetching || adDataLoading) return;
    setPagination((perv) => ({ ...perv, page: perv.page! + 1 }));
  };
  useEffect(() => {
    if (adData?.length && pagination.page > 0) {
      setAdData((perv) => [...perv, ...allAds?.ads!]);
    } else {
      setAdData(allAds?.ads!);
    }
  }, [allAds]);
  return {
    get: { adData, adDataFetching, adDataLoading },
    set: {},
    on: { onRefresh, handleLoadMore },
  };
};
