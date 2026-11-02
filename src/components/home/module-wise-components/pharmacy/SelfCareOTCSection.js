import { Box, Skeleton, Stack, styled, Typography } from "@mui/material";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { styled as muiStyled } from "@mui/material/styles";

const SliderWrapper = muiStyled(CustomBoxFullWidth)(() => ({
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
}));

const SelfCareOTCSection = () => {
  const { t } = useTranslation();

  const { data, refetch, isLoading } = useGetMostReviewed({ type: "all" });

  useEffect(() => {
    refetch();
  }, []);

  const products = data?.products ?? [];

  if (!isLoading && !products.length) return null;

  return (
    <Stack gap="16px">
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
                isPharmacy
                cardWidth={{ xs: "150px", md: "170px" }}
              />
            )
          }
          arrowVariant="section"
          title={
            isLoading ? (
              <Box>
                <Skeleton width={240} height={32} />
                <Skeleton width={160} height={18} />
              </Box>
            ) : (
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                >
                  {t("Self-Care Medicines")}
                </Typography>
              </Box>
            )
          }
          stretchItems={false}
          allowOverflowY={false}
          slidesPerView="auto"
          spaceBetween={16}
          breakpoints={{ 901: { spaceBetween: 20 } }}
        />
      </SliderWrapper>
    </Stack>
  );
};

export default SelfCareOTCSection;
