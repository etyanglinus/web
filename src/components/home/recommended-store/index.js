import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Skeleton, Typography, styled } from "@mui/material";
import { t } from "i18next";
import CustomSlider from "components/common/CustomSlider";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import { useGetRecommendStores } from "api-manage/hooks/react-query/store/useGetRecommendStores";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const RECOMMENDED_STORE_BREAKPOINTS = {
  341: { slidesPerView: 1.4 },
  481: { slidesPerView: 2 },
  696: { slidesPerView: 2.8 },
  761: { slidesPerView: 3 },
  901: { slidesPerView: 3, spaceBetween: 20 },
  1025: { slidesPerView: 3.5, spaceBetween: 20 },
};

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "8px 0",
  },
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const RecommendedStore = ({ title }) => {
  const { data: popularData, isLoading: popularIsLoading } =
    useGetRecommendStores();

  const stores = popularData?.stores ?? [];

  if (!popularIsLoading && !stores.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderWrapper>
        <CustomSlider
          items={popularIsLoading ? Array.from({ length: 4 }) : stores}
          renderItem={(item) =>
            popularIsLoading ? (
              <NewStoreCardSkeleton />
            ) : (
              <NewStoreCard
                variant="normal"
                item={item}
                imageUrl={item?.cover_photo_full_url}
              />
            )
          }
          arrowVariant="section"
          title={
            popularIsLoading ? (
              <Skeleton variant="text" width="160px" />
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                }}
              >
                {title || t("Recommended For You")}
              </Typography>
            )
          }
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={RECOMMENDED_STORE_BREAKPOINTS}
        />
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default RecommendedStore;
