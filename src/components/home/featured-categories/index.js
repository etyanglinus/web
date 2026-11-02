import React from "react";
import { t } from "i18next";
import {
  CustomBoxFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import CustomSlider from "components/common/CustomSlider";
import { useGetFeaturedCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import FoodCategoryCard from "../../cards/FoodCategoryCard";
import { HomeComponentsWrapper } from "../HomePageComponents";

const FEATURED_CATEGORIES_GAP_BREAKPOINTS = {
  901: { spaceBetween: 24 },
};

const FeaturedCategories = () => {
  const { data, isLoading } = useGetFeaturedCategories();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const sliderSx = {
    "& .swiper-slide": {
      paddingBottom: { xs: "5px", sm: "10px" },
    },
  };

  const sectionTitle =
    {
      [ModuleTypes.FOOD]: t("Find Your Flavour"),
      [ModuleTypes.GROCERY]: t("Shop by Categories"),
      [ModuleTypes.PHARMACY]: t("Shop by Categories"),
      [ModuleTypes.ECOMMERCE]: t("Explore Categories"),
      [ModuleTypes.SERVICE]: t("Browse by Categories"),
    }[getCurrentModuleType()] ?? t("Find Your Flavour");

  return (
    <CustomBoxFullWidth>
      {isLoading ? (
        <HomeComponentsWrapper>
          <SliderCustom sx={sliderSx}>
            <CustomSlider
              items={Array.from({ length: 9 })}
              renderItem={() => <FoodCategoryCard onlyshimmer />}
              arrowVariant="none"
              allowOverflowY={false}
              stretchItems={false}
              speed={300}
              slidesPerView="auto"
              spaceBetween={16}
              breakpoints={FEATURED_CATEGORIES_GAP_BREAKPOINTS}
            />
          </SliderCustom>
        </HomeComponentsWrapper>
      ) : (
        data?.data &&
        data?.data.length > 0 && (
          <HomeComponentsWrapper sx={{ gap: "1rem" }}>
            <SliderCustom sx={sliderSx}>
              <CustomSlider
                items={data.data}
                renderItem={(item) => (
                  <FoodCategoryCard
                    id={item?.id}
                    categoryImage={item?.image}
                    name={item?.name}
                    slug={item?.slug}
                    categoryImageUrl={item?.image_full_url}
                    height="40px"
                  />
                )}
                arrowVariant="section"
                title={
                  isXs ? null : (
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "24px" },
                        fontWeight: 700,
                        color: "neutral.1050",
                        lineHeight: 1.1,
                        letterSpacing: "-0.48px",
                      }}
                    >
                      {sectionTitle}
                    </Typography>
                  )
                }
                allowOverflowY={false}
                stretchItems={false}
                speed={300}
                slidesPerView="auto"
                spaceBetween={16}
                breakpoints={FEATURED_CATEGORIES_GAP_BREAKPOINTS}
              />
            </SliderCustom>
          </HomeComponentsWrapper>
        )
      )}
    </CustomBoxFullWidth>
  );
};

export default FeaturedCategories;
