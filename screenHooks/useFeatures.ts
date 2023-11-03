import { useState, useEffect } from 'react';
import {
  useDeleteFeaturedAdMutation,
  useGetFeaturedAdsByCurrentUserQuery,
} from '../redux/services/featuredAdService';
import {
  useDeleteSavedSearchMutation,
  useGetSavedSearchQuery,
} from '../redux/services/savedSearch';

export const useFeatures = (navigation: any) => {
  const [tab, setTab] = useState<'favorite' | 'saved'>('favorite');

  const {
    data,
    isLoading: getFeatureAdIsLoading,
    isFetching: getFeaturedAdIsFetching,
    refetch,
  } = useGetFeaturedAdsByCurrentUserQuery();

  const {
    data: savedSearchData,
    isLoading: savedSearchIsLoading,
    refetch: savedSearchRefetch,
  } = useGetSavedSearchQuery({});

  const [deleteSavedSearch] = useDeleteSavedSearchMutation();

  const [deleteFeaturedAd, { isLoading }] = useDeleteFeaturedAdMutation();
  // todo : delete feature add from featured add page

  const handleNavigateSearch = (searchTerm: string) => {
    navigation.navigate('Home', { filterData: undefined, searchTerm });
  };

  const handleDeleteSavedSearch = (savedSearchId: string) => {
    deleteSavedSearch({ savedSearchId });
  };

  useEffect(() => {
    setTab('favorite');
  }, []);

  return {
    get: {
      tab,
      ads: data?.featureAd,
      getFeatureAdIsLoading,
      getFeaturedAdIsFetching,
      savedSearchData,
      savedSearchIsLoading,
    },
    set: { setTab },
    on: {
      refetch,
      savedSearchRefetch,
      handleNavigateSearch,
      handleDeleteSavedSearch,
    },
  };
};
