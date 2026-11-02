import { Skeleton, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import useGetStoresByFiltering from "../../../../../api-manage/hooks/react-query/store/useGetStoresByFiltering";
import useGetTopRatedStores from "../../../../../api-manage/hooks/react-query/store/useGetTopRatedStores";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { HomeComponentsWrapper } from "../../../HomePageComponents";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const FeaturedStores = (props) => {
  const { title, slide } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const isServiceModule = getCurrentModuleType() === "service";

  const filterParams = {
    type: "all",
    limit: 20,
    enabled: !isServiceModule,
  };
  const topRatedParams = {
    type: "all",
    limit: 20,
    enabled: isServiceModule,
  };

  const { data: filterData, isLoading: filterLoading } = useGetStoresByFiltering(filterParams);
  const { data: topRatedData, isLoading: topRatedLoading } = useGetTopRatedStores({pageParams: topRatedParams, enabled: isServiceModule});

  const data = isServiceModule ? topRatedData : filterData;
  const isLoading = isServiceModule ? topRatedLoading : filterLoading;

  let featuredStores = [];
  if (isServiceModule) {
    featuredStores = data?.pages?.[0]?.providers ?? data?.pages?.[0]?.stores ?? [];
  } else if (data?.pages?.[0]?.stores?.length > 0) {
    data.pages[0].stores.forEach(
      (item) => item?.featured === 1 && featuredStores.push(item)
    );
  }

  // react-slick breakpoint:X meant "apply for width <= X" (descending); these
  // Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
  const featuredStoresBreakpoints = {
    421: { slidesPerView: 1.7 },
    480: { slidesPerView: 2 },
    481: { slidesPerView: 2.5 },
    701: { slidesPerView: 3 },
    901: { slidesPerView: 3, spaceBetween: 20 },
    1025: { slidesPerView: 3.5, spaceBetween: 20 },
    1251: { slidesPerView: slide ?? 4, spaceBetween: 20 },
  };

  return (
    <HomeComponentsWrapper>
      {isLoading ? (
        <CustomStackFullWidth spacing={1}>
          <Skeleton width="200px" />
          <CustomSlider
            items={Array.from({ length: 6 })}
            renderItem={() => <NewStoreCardSkeleton />}
            arrowVariant="none"
            slidesPerView={1.3}
            spaceBetween={16}
            breakpoints={featuredStoresBreakpoints}
          />
        </CustomStackFullWidth>
      ) : (
        <>
          {data?.pages?.length > 0 && featuredStores?.length > 0 && (
            <CustomStackFullWidth
              alignItems="flex-start"
              justifyContent="flex-start"
              spacing={1.25}
            >
              <Typography
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: isServiceModule ? { xs: "18px", md: "24px" } : { xs: "16px", md: "18px" },
                  color: theme.palette.text.primary,
                }}
              >
                {t(title)}
              </Typography>
              <SliderCustom
                nopadding="true"
                sx={{
                  width: "100%",
                  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
                  "& .slick-slide": { paddingRight: "16px" },
                  "& .slick-slide:last-child": { paddingRight: 0 },
                  "& .slick-slide > div": { width: "100%" },
                  "& .slick-slide > div > *": { width: "100% !important" },
                }}
              >
                <CustomSlider
                  items={featuredStores}
                  getKey={(item, index) => item?.id ?? index}
                  renderItem={(item) => (
                    <NewStoreCard
                      variant="normal"
                      item={item}
                      imageUrl={item?.cover_photo_full_url}
                    />
                  )}
                  arrowVariant="inline"
                  slidesPerView={1.3}
                  spaceBetween={16}
                  breakpoints={featuredStoresBreakpoints}
                />
              </SliderCustom>
            </CustomStackFullWidth>
          )}
        </>
      )}
    </HomeComponentsWrapper>
  );
};

FeaturedStores.propTypes = {};

export default FeaturedStores;