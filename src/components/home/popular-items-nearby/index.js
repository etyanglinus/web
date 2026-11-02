import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetPopularItemsNearby from "../../../api-manage/hooks/react-query/useGetPopularItemsNearby";

import { Box, Grid, Skeleton, useMediaQuery } from "@mui/material";
import CustomSlider from "components/common/CustomSlider";

import { useTranslation } from "react-i18next";

import { useGetFlashSales } from "api-manage/hooks/react-query/useGetFlashSales";
import { setPopularItemsNearby } from "redux/slices/storedData";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import ProductCard from "../../cards/ProductCard";
import CampaignSimmerTimmer from "../../Shimmer/CampaignSimmerTimmer";
import ProductCardSimmerHorizontal from "../../Shimmer/ProductCardSimmerHorizontal";
import H2 from "../../typographies/H2";
import Subtitle1 from "../../typographies/Subtitle1";
import { HomeComponentsWrapper } from "../HomePageComponents";
import ItemsCampaign from "./items-campaign-slide";

// react-slick's `rows`/`slidesPerRow` grid mode has no Swiper equivalent, so
// each "slide" here is manually chunked into a CSS grid of
// rowsPerSlide × colsPerSlide items (matching the original grid), and Swiper
// only handles the horizontal paging between those chunks.
const POPULAR_NEARBY_BREAKPOINTS = (flashSale) => ({
  321: { slidesPerView: 1.1 },
  376: { slidesPerView: 1.2 },
  451: { slidesPerView: 1.5 },
  751: { slidesPerView: 1.55 },
  831: { slidesPerView: 1.75 },
  901: { slidesPerView: 1.8 },
  1151: { slidesPerView: flashSale ? 2 : 2.5 },
  1301: { slidesPerView: flashSale ? 2 : 2.7 },
});

const PopularItemsNearby = ({ title, subTitle }) => {
  const { popularItemsNearby } = useSelector((state) => state.storedData);
  const { t } = useTranslation();
  const limit = 2;
  const offset = 1;
  const { data, refetch, isLoading, isFetching } = useGetPopularItemsNearby({
    offset: 1,
    type: "all",
  });
  const {
    data: flashSales,
    refetch: flashSalesRefetch,
    isLoading: flashSalesIsLoading,
  } = useGetFlashSales({ limit, offset });
  const dispatch = useDispatch();


  useEffect(() => {
    flashSalesRefetch();
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setPopularItemsNearby(data));
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, []);

  const flashSaleslength = () => {
    if (
      (flashSales &&
        typeof flashSales === "object" &&
        Object.keys(flashSales).length === 0) ||
      flashSales?.active_products?.length < 1
    ) {
      return false;
    } else {
      return true;
    }
  };
  // Columns/rows-per-slide (react-slick's slidesPerRow/rows) follow the same
  // ascending breakpoints, read via useMediaQuery since they drive JS-side
  // chunking of items into slides, not just CSS layout.
  const isAbove901 = useMediaQuery("(min-width:901px)");
  const isAbove451 = useMediaQuery("(min-width:451px)");
  const isAbove751 = useMediaQuery("(min-width:751px)");
  const rowsPerSlide = isAbove901 ? 3 : 2;
  const colsPerSlide = isAbove451 && !isAbove751 ? 2 : 1;

  return (
    <HomeComponentsWrapper>
      {data && data?.products?.length > 0 && (
        <>
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mt={{ xs: "10x", md: "0px" }}
            spacing={1}
          >
            {isLoading ? (
              <Skeleton varient="text" width="110px" />
            ) : (
              <H2 text={title} component="h2" />
            )}
            {isLoading ? (
              <Skeleton varient="text" width="310px" />
            ) : (
              <Subtitle1 text={t(subTitle)} component="p" />
            )}
            <CustomBoxFullWidth>
              <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                {isLoading ? (
                  <Grid item xs={12} sm={12} md={9}>
                    <SliderCustom nopadding="true">
                      <CustomSlider
                        items={(() => {
                          const chunkSize = rowsPerSlide * colsPerSlide;
                          const chunks = [];
                          for (let i = 0; i < 15; i += chunkSize) {
                            chunks.push(
                              Array.from({
                                length: Math.min(chunkSize, 15 - i),
                              }),
                            );
                          }
                          return chunks;
                        })()}
                        getKey={(chunk, i) => i}
                        renderItem={(chunk) => (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: `repeat(${colsPerSlide}, 1fr)`,
                              gap: "15px",
                            }}
                          >
                            {chunk.map((_, index) => (
                              <ProductCardSimmerHorizontal key={index} />
                            ))}
                          </Box>
                        )}
                        arrowVariant="inline"
                        speed={500}
                        slidesPerView={1}
                        spaceBetween={16}
                        breakpoints={POPULAR_NEARBY_BREAKPOINTS(
                          flashSaleslength(),
                        )}
                      />
                    </SliderCustom>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={12} md={flashSaleslength() ? 9 : 12}>
                    <SliderCustom nopadding="true">
                      <CustomSlider
                        items={(() => {
                          const products = data?.products ?? [];
                          const chunkSize = rowsPerSlide * colsPerSlide;
                          const chunks = [];
                          for (
                            let i = 0;
                            i < products.length;
                            i += chunkSize
                          ) {
                            chunks.push(products.slice(i, i + chunkSize));
                          }
                          return chunks;
                        })()}
                        getKey={(chunk, i) => i}
                        renderItem={(chunk) => (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: `repeat(${colsPerSlide}, 1fr)`,
                              gap: "15px",
                            }}
                          >
                            {chunk.map((item, index) => (
                              <ProductCard
                                key={index}
                                item={item}
                                cardheight="160px"
                                horizontalcard="true"
                                cardFor="popular items"
                              />
                            ))}
                          </Box>
                        )}
                        arrowVariant="inline"
                        speed={500}
                        slidesPerView={1}
                        spaceBetween={16}
                        breakpoints={POPULAR_NEARBY_BREAKPOINTS(
                          flashSaleslength(),
                        )}
                      />
                    </SliderCustom>
                  </Grid>
                )}

                {flashSalesIsLoading ? (
                  <Grid item xs={12} sm={5} md={3}>
                    <CampaignSimmerTimmer />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={5} md={3}>
                    {flashSaleslength() && (
                      <ItemsCampaign flashSales={flashSales} />
                    )}
                  </Grid>
                )}
              </Grid>
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </>
      )}
    </HomeComponentsWrapper>
  );
};

export default PopularItemsNearby;
