import React, { FC } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import SingleAd from '../components/SingleAd';
import { Category } from '../globalTypes';
import { useCategory } from '../screenHooks/useCategory';
import { RootStackScreenProps } from '../types';

const CategoryScreen: FC<RootStackScreenProps<'Category'>> = ({ route }) => {
  const { get, set, on } = useCategory(route);

  return (
    <View className="flex-1">
      <FlatList
        // onTouchStart={() => set.setQuery('')}
        style={{ flex: 1, height: '100%' }}
        refreshing={get.adDataLoading}
        onRefresh={on.onRefresh}
        showsVerticalScrollIndicator={false}
        data={get.adData}
        ListFooterComponent={
          (get.adDataLoading || get.adDataFetching) && get.adData?.length ? (
            <>
              <ActivityIndicator />
            </>
          ) : null
        }
        numColumns={2}
        onEndReachedThreshold={0.01}
        contentContainerStyle={{ justifyContent: 'space-between' }}
        onEndReached={on.handleLoadMore}
        renderItem={({ item }) => {
          return (
            <SingleAd
              image={item?.adImages?.xs[0]}
              {...item}
              featuredAdId={
                item.creator.featuredAds?.find((ad) => ad.ad === item._id)?._id
              }
              iconType="add"
            />
          );
        }}
      />
    </View>
  );
};

export default CategoryScreen;
