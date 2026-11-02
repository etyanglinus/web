import { alpha, Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import useGetDiscountedItems from "../../../api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import { getLanguage } from "helper-functions/getLanguage";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { RTL } from "../../rtl";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { HomeComponentsWrapper } from "../HomePageComponents";

const SpecialFoodOffers = ({ title }) => {
  const { t } = useTranslation();
  const params = { offset: 1, limit: 15 };
  const { data, isLoading, isFetching } = useGetDiscountedItems(params);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const products = data?.products ?? [];

  if (!isFetching && !products.length) return null;

  return (
    <RTL direction={lanDirection}>
      <CustomBoxFullWidth
        sx={{
          padding: { xs: "16px 0px 16px 16px", md: "20px 0px 20px 24px" },
          backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.1),
          borderRadius: { xs: "12px", md: "16px" },
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <CustomBoxFullWidth>
          <CustomSlider
            items={isFetching ? Array.from({ length: 5 }) : products}
            renderItem={(item) =>
              isFetching ? (
                <ProductCardSimmer variant="vertical" />
              ) : (
                <NewProductCard
                  item={item}
                  variant="vertical"
                  cardWidth={{ xs: "150px", md: "170px" }}
                />
              )
            }
            arrowVariant="section"
            title={
              isFetching ? (
                <Skeleton variant="text" width="110px" />
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
                  {t(title ?? "Special Offer")}
                </Typography>
              )
            }
            headerSx={{ pr: { xs: "16px", md: "24px" } }}
            stretchItems={false}
            allowOverflowY={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{ 901: { spaceBetween: 20 } }}
          />
        </CustomBoxFullWidth>
      </CustomBoxFullWidth>
    </RTL>
  );
};

export default SpecialFoodOffers;
