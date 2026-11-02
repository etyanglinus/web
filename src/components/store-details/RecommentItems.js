import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
  SliderCustom,
} from "../../styled-components/CustomStyles.style";
import { Grid, Typography } from "@mui/material";
import H1 from "../typographies/H1";
import { useGetRecommendProducts } from "../../api-manage/hooks/react-query/store/useGetRecommendProducts";
import settings from "../../../pages/settings";
import ProductCard from "../cards/ProductCard";
import CustomSlider from "components/common/CustomSlider";
import { getItemsOrFoods } from "../../helper-functions/getItemsOrFoods";
import { t } from "i18next";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const RECOMMEND_BREAKPOINTS = {
  541: { slidesPerView: 1.5 },
  801: { slidesPerView: 2 },
  1341: { slidesPerView: 2.5 },
  2401: { slidesPerView: 3 },
};

const RecommendItems = ({ store_id }) => {
  const [offset, setOffset] = useState(1);
  const [page_limit, setPageLimit] = useState(3);
  const { data, refetch, isRefetching, isLoading } = useGetRecommendProducts({
    store_id,
    page_limit,
    offset,
  });
  useEffect(() => {
    refetch();
  }, [store_id]);
  const Recommended = t("Recommended");
  return (
    <>
      {data?.items.length > 0 && (
        <CustomStackFullWidth sx={{ padding: "1rem" }}>
          <Grid conatiner>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="h6" textAlign="left">
                {`${Recommended} ${getItemsOrFoods()}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <SliderCustom sx={{ paddingTop: "5px" }} gap="15px">
                <CustomSlider
                  items={data?.items ?? []}
                  renderItem={(item) => (
                    <ProductCard
                      item={item}
                      horizontalcard="true"
                      cardheight="170px"
                    />
                  )}
                  arrowVariant="inline"
                  slidesPerView={1}
                  spaceBetween={16}
                  breakpoints={RECOMMEND_BREAKPOINTS}
                />
              </SliderCustom>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default RecommendItems;
