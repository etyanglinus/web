import React, { useEffect } from "react";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "../../styled-components/CustomStyles.style";
import { Grid, Typography } from "@mui/material";
import { t } from "i18next";
import { Stack } from "@mui/system";
import CustomSlider from "components/common/CustomSlider";
import { ProductsReviewSettings } from "./ProductsReviewSettings";
import ProductReviewCard from "./product-details-section/ProductReviewCard";
import ProductCard, { CardWrapper } from "../cards/ProductCard";

import useGetSimilarProduct from "../../api-manage/hooks/react-query/product-details/useGetSimilarProduct";
import { Skeleton } from "@mui/material";
import ProductCardShimmer from "../search/ProductCardShimmer";
const Shimmer = () => {
  return (
    <CardWrapper>
      <Skeleton variant="rectangle" height="100%" width="100%" />
    </CardWrapper>
  );
};
const SimilarProducts = ({ productId }) => {
  const { refetch, data, isFetching, isLoading, isRefetching } =
    useGetSimilarProduct(productId);
  useEffect(() => {
    refetch();
  }, [productId]);

  return (
    <>
      {data?.length > 0 && (
        <CustomStackFullWidth>
          <Typography fontWeight="600" variant="h5">
            {t("Similar Products")}
          </Typography>
          <SliderCustom>
            <CustomSlider
              items={data ?? []}
              renderItem={(item) => (
                <ProductCard
                  item={item}
                  changed_bg="true"
                  horizontalcard="false"
                />
              )}
              arrowVariant="inline"
              slidesPerView={1}
              spaceBetween={16}
            />
          </SliderCustom>
          {isFetching && (
            <Grid container>
              <ProductCardShimmer />
            </Grid>
          )}
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default SimilarProducts;
