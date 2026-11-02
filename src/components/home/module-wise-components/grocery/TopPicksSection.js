import { Box, Skeleton, styled, Typography } from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";

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
    paddingRight: "24px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

const TOP_PICKS_GAP_BREAKPOINTS = {
  901: { spaceBetween: 20 },
};

const TopPicksSection = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useGetMostReviewed({ type: "all" });
  const products = data?.products ?? [];

  if (!isLoading && !products.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderWrapper>
        <CustomSlider
          items={isLoading ? Array.from({ length: 5 }) : products}
          renderItem={(item) =>
            isLoading ? (
              <ProductCardSimmer />
            ) : (
              <NewProductCard
                variant="vertical"
                item={item}
                cardWidth={{ xs: "150px", md: "170px" }}
              />
            )
          }
          arrowVariant="section"
          title={
            isLoading ? (
              <Skeleton variant="text" width="140px" height="32px" />
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
                {t("Top Picks")}
              </Typography>
            )
          }
          stretchItems={false}
          slidesPerView="auto"
          spaceBetween={16}
          breakpoints={TOP_PICKS_GAP_BREAKPOINTS}
        />
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default TopPicksSection;
