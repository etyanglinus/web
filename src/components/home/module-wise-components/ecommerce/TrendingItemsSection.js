import { Skeleton, styled, Typography } from "@mui/material";
import useGetPopularItemsNearby from "api-manage/hooks/react-query/useGetPopularItemsNearby";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "8px 0",
  },
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const TRENDING_ITEMS_GAP_BREAKPOINTS = {
  901: { spaceBetween: 20 },
};

const TrendingItemsSection = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useGetPopularItemsNearby({
    offset: 1,
    type: "all",
  });
  const products = data?.products ?? [];

  if (!isLoading && !products.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderWrapper>
        <CustomSlider
          items={isLoading ? Array.from({ length: 3 }) : products}
          renderItem={(item) =>
            isLoading ? (
              <ProductCardSimmer variant="horizontal" />
            ) : (
              <NewProductCard variant="horizontal" item={item} />
            )
          }
          arrowVariant="section"
          title={
            isLoading ? (
              <Skeleton variant="text" width="160px" height="32px" />
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "20px", sm: "24px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                }}
              >
                {t("Trending Items")}
              </Typography>
            )
          }
          stretchItems={false}
          slidesPerView="auto"
          spaceBetween={16}
          breakpoints={TRENDING_ITEMS_GAP_BREAKPOINTS}
        />
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default TrendingItemsSection;
