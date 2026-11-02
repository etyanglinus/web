import { Box, Skeleton, Stack, styled, Typography } from "@mui/material";
import BundleProductCard from "components/cards/newCard/BundleProductCard";
import useGetBundleHome from "api-manage/hooks/react-query/bundle/useGetBundleHome";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  paddingTop: "24px",
  paddingBottom: "24px",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
    borderRadius: "12px",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  paddingLeft: "32px",
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "24px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  // .slick-list clips flush against the first/last slide's edge, cutting off
  // the card's left/right drop shadow. Give it a small buffer and pull the
  // same amount back with negative margin, so the shadow has room without
  // changing the slider's layout width. Container above still clips the
  // slider's own overflow, so nothing escapes the section.
  "& .slick-list": {
    padding: "0 8px",
    margin: "0 -8px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
    "& .slick-slide": { paddingRight: "16px" },
  },
}));

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const BUNDLE_ITEMS_BREAKPOINTS = {
  341: { slidesPerView: 1.8 },
  361: { slidesPerView: 2 },
  401: { slidesPerView: 2.3 },
  481: { slidesPerView: 2 },
  601: { slidesPerView: 3 },
  761: { slidesPerView: 4 },
  901: { slidesPerView: 4, spaceBetween: 20 },
  1025: { slidesPerView: 5.2, spaceBetween: 20 },
};

const BundleCardShimmer = () => (
  <Stack gap="12px">
    <Skeleton variant="rounded" height={190} sx={{ borderRadius: "12px" }} />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="40%" />
  </Stack>
);

/**
 * Shared "Bundle Items" home section — one horizontal slider of bundle cards,
 * used by every module that sells bundles. GET /bundle/home is public (no
 * token/guest_id) and returns one thumbnail per bundle, not a per-item image
 * set, so every card here renders via BundleProductCard's single-image path.
 */
const BundleItemsSection = ({ title }) => {
  const { t } = useTranslation();

  const { data, isLoading, isFetched } = useGetBundleHome({ limit: 10 });
  const bundles = data?.bundles ?? [];

  if (isFetched && !bundles.length) return null;

  return (
    <Container>
      <Stack gap="16px">
        <SliderWrapper>
          <CustomSlider
            items={isLoading ? Array.from({ length: 5 }) : bundles}
            renderItem={(item) =>
              isLoading ? (
                <BundleCardShimmer />
              ) : (
                <BundleProductCard
                  variant="vertical"
                  item={item}
                  images={item?.items?.map((i) => i?.image_full_url) ?? []}
                  cardWidth="100%"
                />
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
                  {title || t("Bundle Items")}
                </Typography>
              )
            }
            headerSx={{ px: { xs: "16px", sm: "32px" } }}
            slidesPerView={1.7}
            spaceBetween={16}
            breakpoints={BUNDLE_ITEMS_BREAKPOINTS}
          />
        </SliderWrapper>
      </Stack>
    </Container>
  );
};

export default BundleItemsSection;
