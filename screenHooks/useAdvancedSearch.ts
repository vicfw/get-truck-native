import { useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import Colors from "../constants/Colors";
import { useGetAllCategoriesWithoutChildrenQuery } from "../redux/services/categoryService";
import { CategoriesWithoutChildrenResponse } from "../redux/services/types/category.types";
import { themeRenderer } from "../constants/Common";
import { getYearsArray } from "../utils/getAllYears";

export const useAdvancedSearch = () => {
  // states
  const [dropdownData, setDropdownData] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const trucksCategoryId = useRef<string | null>();
  const handleSubmitRef = useRef<any>(null);

  //queries or mutations
  const { data: categoriesData } = useGetAllCategoriesWithoutChildrenQuery();

  const selectPickerStyles = useMemo(() => {
    return {
      placeholder: {
        color: themeRenderer("#fff", Colors["gray-500"]),
        fontSize: 14,
      },
      iconContainer: {
        top: Platform.OS === "android" ? 14 : 17,
        right: 10,
      },
      inputAndroid: {
        color: themeRenderer("#fff", Colors["gray-500"]),
        fontSize: 14,
        paddingHorizontal: 13,
        paddingVertical: 10,
      },
      inputIOS: {
        color: themeRenderer("#fff", Colors["gray-500"]),
        fontSize: 14,
        paddingVertical: 18,
        paddingHorizontal: 13,
      },
    };
  }, []);
  const formInitialValues = useMemo(() => {
    return {
      title: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      saleBy: "",
      condition: "",
      location: "",
      address: "",
      minKilometers: "",
      maxKilometers: "",
      transmission: "",
      engineHP: "",
      engine: "",
      exteriorColor: "",
      differential: "",
      frontAxel: "",
      realAxel: "",
      suspension: "",
      wheelbase: "",
      wheels: "",
      maxDate: "",
      minDate: "",
    };
  }, []);

  const years = getYearsArray();

  useEffect(() => {
    const mappedData = categoriesData?.map((dt) => {
      return { label: dt.name, value: dt._id };
    });
    const filteredData = categoriesData?.find(
      (dt) => dt.name.toLowerCase() === "trucks"
    );
    trucksCategoryId.current = filteredData?._id;
    setDropdownData(mappedData);
  }, [categoriesData]);

  const findParent = (
    selectedCategoryId: string
  ): CategoriesWithoutChildrenResponse | undefined => {
    let category = categoriesData?.find(
      (cat) => cat._id === selectedCategoryId
    );
    if (category?.parentId) {
      const parent = categoriesData?.find(
        (cat) => cat._id === category?.parentId
      );
      if (parent?._id) {
        category = findParent(parent?._id);
      }
    }
    return category;
  };
  return {
    get: {
      selectPickerStyles,
      dropdownData,
      trucksCategoryId,
      formInitialValues,
      handleSubmitRef,
      years,
    },
    set: {},
    on: { findParent },
  };
};
