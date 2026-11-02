import { Box, Skeleton, Stack, styled, Typography } from "@mui/material";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide > div > *": { width: "100% !important" },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const VERIFIED_PHARMACIES_BREAKPOINTS = {
  341: { slidesPerView: 1.4 },
  481: { slidesPerView: 2 },
  696: { slidesPerView: 2.8 },
  761: { slidesPerView: 3 },
  901: { slidesPerView: 3, spaceBetween: 20 },
  1025: { slidesPerView: 3.5, spaceBetween: 20 },
};

const VerifiedPharmacies = ({ title, subtitle }) => {
  const { t } = useTranslation();

  const { data: storesData, isLoading } = useGetSearchPageData(
    // confirm by BE to use combined api
    {
      offset: 1,
      currentTab: 1,
      page_limit: 20,
      quick_action: "verified_seller",
    },
    () => {},
    true,
  );

  const stores = storesData?.pages?.[0]?.stores ?? [];

  if (!isLoading && !stores.length) return null;

  return (
    <Stack gap="16px">
      <SliderWrapper>
        <CustomSlider
          items={isLoading ? Array.from({ length: 4 }) : stores}
          renderItem={(item) =>
            isLoading ? (
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
            isLoading ? (
              <Box>
                <Skeleton width={200} height={32} />
                <Skeleton width={180} height={18} />
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
                  {title ? title : t("Verified Pharmacies")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "neutral.500",
                    lineHeight: 1.3,
                    mt: "4px",
                  }}
                >
                  {subtitle ? subtitle : t("Trust & secure buying experience.")}
                </Typography>
              </Box>
            )
          }
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={VERIFIED_PHARMACIES_BREAKPOINTS}
        />
      </SliderWrapper>
    </Stack>
  );
};

export default VerifiedPharmacies;
