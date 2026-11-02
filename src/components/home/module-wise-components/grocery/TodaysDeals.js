import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useGetDiscountedItems from "api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import useGetPopularItemsNearby from "api-manage/hooks/react-query/useGetPopularItemsNearby";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.warning.lighter,
  borderRadius: "16px",
  paddingTop: "24px",
  paddingBottom: "24px",
  overflow: "hidden",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.05)",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "16px",
    paddingBottom: "16px",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  paddingLeft: "24px",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "16px",
  },
  "& .slick-track": { marginLeft: 0 },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
}));

const TodaysDeals = () => {
  const { t } = useTranslation();

  const { data, isFetched } = useGetPopularItemsNearby({
    offset: 1,
    type: "all",
  });
  const products = data?.products ?? [];

  if (isFetched && !products.length) return null;

  const title = !isFetched ? (
    <Box>
      <Skeleton variant="text" width="160px" height="32px" />
      <Skeleton variant="text" width="220px" height="20px" />
    </Box>
  ) : (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: "20px", sm: "24px" },
          fontWeight: 700,
          color: "warning.secondary",
          lineHeight: 1.1,
          letterSpacing: "-1.2px",
        }}
      >
        {t("Todays Deals")}
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "warning.secondary",
          lineHeight: 1.3,
        }}
      >
        {t("Grab The Offer Before End The Time.")}
      </Typography>
    </Box>
  );

  return (
    <Container>
      <Stack gap="24px">
        <SliderWrapper>
          <CustomSlider
            items={!isFetched ? Array.from({ length: 5 }) : products}
            renderItem={(item) =>
              !isFetched ? (
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
            title={title}
            headerSx={{ px: { xs: "16px", sm: "24px" } }}
            stretchItems={false}
            allowOverflowY={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{ 901: { spaceBetween: 20 } }}
          />
        </SliderWrapper>
      </Stack>
    </Container>
  );
};

export default TodaysDeals;
