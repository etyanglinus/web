/* eslint-disable react-hooks/exhaustive-deps */
import { alpha, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import usePopularProductsInStore from "../../../api-manage/hooks/react-query/product-details/usePopularProductsInStore";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import ProductCard from "../../cards/ProductCard";
import useGetCommonConditionStore from "../../../api-manage/hooks/react-query/common-conditions/useGetCommonConditionStore";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const POPULAR_BREAKPOINTS = {
  271: { slidesPerView: 1.2 },
  351: { slidesPerView: 1.6 },
  381: { slidesPerView: 1.8 },
  421: { slidesPerView: 1.9 },
  480: { slidesPerView: 2 },
  601: { slidesPerView: 2.5 },
  701: { slidesPerView: 2.8 },
  1001: { slidesPerView: 3 },
  1025: { slidesPerView: 3.3 },
  1251: { slidesPerView: 3.5 },
  1451: { slidesPerView: 4.6 },
  1551: { slidesPerView: 4.9 },
};

const PopularInTheStore = ({ id, storeShare, sortBy, type }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const offset = 1;
  const limit = 10;
  const getBG = () => {
    if (getCurrentModuleType()) {
      switch (getCurrentModuleType()) {
        case ModuleTypes.GROCERY:
          return {
            bgColor: alpha(theme.palette.primary.main, 0.2),
            title: t("Recommended for you"),
          };
        case ModuleTypes.PHARMACY:
          return {
            bgColor: alpha(theme.palette.info.custom1, 0.1),
            title: t("Common Conditions!"),
          };
        case ModuleTypes.ECOMMERCE:
          return {
            bgColor: alpha(theme.palette.info.blue, 0.1),
            title: t("Recommended for you"),
          };
        case ModuleTypes.FOOD:
          return {
            bgColor: alpha(theme.palette.moduleTheme.food, 0.1),
            title: t("Recommended for you"),
          };
      }
    } else {
      switch (storeShare?.moduleType) {
        case ModuleTypes.GROCERY:
          return {
            bgColor: alpha(theme.palette.primary.main, 0.2),
            title: t("Popular in this store!"),
          };
        case ModuleTypes.PHARMACY:
          return {
            bgColor: alpha(theme.palette.info.custom1, 0.2),
            title: t("Common Conditions!"),
          };
        case ModuleTypes.ECOMMERCE:
          return {
            bgColor: alpha(theme.palette.info.blue, 0.1),
            title: t("Popular in this store!"),
          };
        case ModuleTypes.FOOD:
          return {
            bgColor: alpha(theme.palette.moduleTheme.food, 0.1),
            title: t("Popular in this Restaurant!"),
          };
      }
    }
  };

  const { data, refetch, isLoading } = usePopularProductsInStore({
    id,
    sortBy,
    type,
    ...storeShare,
  });
  const {
    data: commonConditionitems,
    refetch: refetchCommonCondition,
    isLoading: isLoddingCondition,
  } = useGetCommonConditionStore({
    id,
    ...storeShare,
    offset,
    limit,
  });

  useEffect(() => {
    refetchCommonCondition();
    refetch();
  }, []);

  // Refetch popular items whenever the active sort/type filter changes
  // so the section reflects the current selection.
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, type]);

  return (
    <CustomBoxFullWidth>
      {getCurrentModuleType() === "pharmacy" ? (
        <>
          {commonConditionitems?.products?.length > 0 && (
            <SliderCustom
              nopadding="true"
              sx={{
                backgroundColor: getBG()?.bgColor,
                padding: "20px 20px 20px 20px",
                borderRadius: "4px",
                marginTop: "12px",
                "& .slick-slide": {
                  paddingRight: "20px",
                  paddingBottom: "10px",
                },
              }}
            >
              <CustomStackFullWidth spacing={2.2}>
                <H1 textAlign="start" text={getBG()?.title} />
                {!isLoading && (
                  <CustomSlider
                    items={commonConditionitems?.products ?? []}
                    renderItem={(item) => (
                      <ProductCard item={item} specialCard="true" />
                    )}
                    arrowVariant="inline"
                    slidesPerView={1}
                    spaceBetween={16}
                    breakpoints={POPULAR_BREAKPOINTS}
                  />
                )}
              </CustomStackFullWidth>
            </SliderCustom>
          )}
        </>
      ) : (
        <>
          {data?.items?.length > 0 && (
            <SliderCustom
              nopadding="true"
              sx={{
                backgroundColor: getBG()?.bgColor,
                padding: "20px 20px 8px 20px",
                borderRadius: "4px",
                marginTop: "12px",
                "& .slick-slide": {
                  paddingRight: "20px",
                },
              }}
            >
              <CustomStackFullWidth spacing={2.2}>
                <H1 textAlign="start" text={getBG()?.title} />
                {!isLoading && (
                  <CustomSlider
                    items={data?.items ?? []}
                    renderItem={(item) => (
                      <ProductCard item={item} specialCard="true" noRecommended />
                    )}
                    arrowVariant="inline"
                    slidesPerView={1}
                    spaceBetween={16}
                    breakpoints={POPULAR_BREAKPOINTS}
                  />
                )}
              </CustomStackFullWidth>
            </SliderCustom>
          )}
        </>
      )}
    </CustomBoxFullWidth>
  );
};

PopularInTheStore.propTypes = {};

export default PopularInTheStore;
