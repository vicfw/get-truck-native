import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { useAppSelector } from '../../redux/hooks';
import {
  useCreateFeaturedAdMutation,
  useDeleteFeaturedAdMutation,
} from '../../redux/services/featuredAdService';
import Toast from 'react-native-toast-message';

export const useSingleAd = (
  _id: string,
  featuredAdId?: string,
  iconType?: string | undefined
) => {
  const navigation = useNavigation();

  const [featureAdded, setFeatureAdded] = useState(false);

  const [createFeaturedAd, { isLoading }] = useCreateFeaturedAdMutation();
  const [deleteFeaturedAd, { isLoading: deleteFeaturedLoading }] =
    useDeleteFeaturedAdMutation();

  const createFeaturedAdHandler = async (adId: string) => {
    await createFeaturedAd({
      ad: adId,
    }).unwrap();
  };

  const deleteFeaturedAdHandler = async () => {
    await deleteFeaturedAd({
      featuredAdId: featuredAdId!,
    }).unwrap();
  };

  useEffect(() => {
    setFeatureAdded(!!featuredAdId);
  }, [featuredAdId]);

  const renderFeaturedIcon = useCallback(() => {
    switch (iconType) {
      case 'delete':
        return (
          <TouchableOpacity
            onPress={async () => {
              deleteFeaturedAdHandler();
            }}
          >
            <Icon
              type="feather"
              name="trash"
              size={26}
              color={Colors['gray-500']}
            />
          </TouchableOpacity>
        );
      case 'add':
        return (
          <TouchableOpacity
            onPress={async () => {
              try {
                await createFeaturedAdHandler(_id);
                navigation.navigate('Features');
              } catch (error) {}
            }}
          >
            <Icon
              type="font-awesome"
              name="bookmark-o"
              size={26}
              color={Colors['gray-500']}
            />
          </TouchableOpacity>
        );

      default:
        null;
        break;
    }
  }, [iconType]);

  return {
    get: { renderFeaturedIcon },
  };
};
