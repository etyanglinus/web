import { useTheme } from "@emotion/react";
import { Box, Grid, Tab, Tabs, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CustomSlider from "components/common/CustomSlider";
import { useGetFeaturedCategories } from "../../../../api-manage/hooks/react-query/all-category/all-categorys";
import useGetFeatureCategoriesProducts from "../../../../api-manage/hooks/react-query/useGetFeatureCategories";
import {
  CustomBoxFullWidth,
  CustomFullDivider,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import ProductCard from "../../../cards/ProductCard";
import DotSpin from "../../../DotSpin";
import EmptySearchResults from "../../../EmptySearchResults";
import H2 from "../../../typographies/H2";
import { HomeComponentsWrapper } from "../../HomePageComponents";
import { useQueryClient } from "react-query";

// react-slick's `rows`/`slidesPerRow` grid mode has no Swiper equivalent, so
// each "slide" here is manually chunked into a CSS grid of
// ROWS_PER_SLIDE × slidesPerRow items (matching the original grid), and
// Swiper only handles the horizontal paging between those chunks.
const ROWS_PER_SLIDE = 3;

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const FEATURED_FILTER_BREAKPOINTS = {
  501: { slidesPerView: 1.5 },
  701: { slidesPerView: 2 },
  751: { slidesPerView: 1 },
  901: { slidesPerView: 2 },
};

const FeaturedCategoriesWithFilter = (props) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  // Columns-per-slide (react-slick's slidesPerRow) follows the same
  // ascending breakpoints, read via useMediaQuery since it drives JS-side
  // chunking of items into slides, not just CSS layout.
  const isMidRange = useMediaQuery("(min-width:501px) and (max-width:1300px)");
  const columnsPerSlide = isMidRange ? 2 : 1;
  const queryClient = useQueryClient();
  const { title } = props;
  const [selected, setSelected] = useState(0);
  const [categoryId, setCategoryId] = useState(null);
  const page_limit = "20";
  const offset = 1;
  const type = "all";
  const { t } = useTranslation();
  const [tempData, setTempData] = useState([]);

  const handleDataSuccess = (res) => {
    setTempData(res);
  };
  const {
    data,
    refetch,
    //isRefetching: itemIsLoading,
    isLoading: itemIsLoading,
  } = useGetFeatureCategoriesProducts(
    {
      categoryId,
      page_limit,
      offset,
      type,
    },
    handleDataSuccess,
  );
  const handleSuccess = (res) => {
    if (res) {
      setCategoryId(res?.data[0]?.id);
    }
  };
  const { data: featureData, refetch: featureRefetch } =
    useGetFeaturedCategories(handleSuccess);

  // useEffect(() => {
  //   if (categoryId) {
  //     refetch();
  //   }
  // }, [categoryId]);
  const featureCategoryData = featureData?.data?.filter(
    (item) => item.featured === 1,
  );
  const handleClick = (index, id) => {
    setSelected(index);
    setCategoryId(id);
  };

  const handleCheckData = useCallback(() => {
    const queryState = queryClient.getQueryState(
      `[categories-details-items-${categoryId}]`,
    );

    if (!queryState || queryState.isStale) {
      refetch();
    } else {
      setTempData(queryState?.data);
    }
  }, [tempData]);

  useEffect(() => {
    handleCheckData();
  }, [categoryId]);

  return (
    <>
      {featureCategoryData?.length > 0 && (
        <HomeComponentsWrapper sx={{ marginTop: "30px", marginBottom: "20px" }}>
          <H2 text={title} textAlign="flex-start" component="h2" />
          <CustomFullDivider sx={{ marginY: "10px" }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={0} md={3}>
              <Tabs
                orientation={isSmall ? "horizontal" : "vertical"}
                variant={isSmall && "scrollable"}
                scrollButtons
              >
                {featureCategoryData?.map((item, index) => {
                  return (
                    <Tab
                      textAlign="flex-start"
                      sx={{
                        alignItems: "flex-start",
                        marginLeft: isSmall
                          ? "24px !important"
                          : "0px !important",
                        fontSize: selected === index ? "700" : "400",
                        color:
                          selected === index
                            ? "primary.main"
                            : "text.secondary",
                        cursor: "pointer",
                      }}
                      // variant={selected === index ? "16px" : "subtitle2"}
                      // lineHeight="16.59px"
                      // fontWeight={selected === index ? "700" : "400"}
                      // sx={{
                      //   color:
                      //     selected === index
                      //       ? "primary.main"
                      //       : "text.secondary",
                      //   cursor: "pointer",
                      // }}
                      key={index}
                      onClick={() => handleClick(index, item?.id)}
                      label={item?.name}
                    />
                  );
                })}
              </Tabs>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              sx={{
                margin: { xs: "-4px", md: "-7.5px" },
                opacity: itemIsLoading ? ".5" : "",
                transition: "all ease .3s",
                position: "relative",
                "&::before": {
                  position: "absolute",
                  inset: "0",
                  content: '""',
                  zIndex: "999",
                  display: itemIsLoading ? "block" : "none",
                },
              }}
            >
              {itemIsLoading ? (
                <CustomStackFullWidth
                  sx={{
                    height: "100%",
                    position: "absolute",
                    inset: "0",
                    zIndex: "9999",
                  }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <DotSpin />
                </CustomStackFullWidth>
              ) : null}
              <CustomBoxFullWidth>
                <SliderCustom nopadding="true">
                  <CustomSlider
                    items={(() => {
                      const products = tempData?.products ?? [];
                      const chunkSize = ROWS_PER_SLIDE * columnsPerSlide;
                      const chunks = [];
                      for (let i = 0; i < products.length; i += chunkSize) {
                        chunks.push(products.slice(i, i + chunkSize));
                      }
                      return chunks;
                    })()}
                    getKey={(chunk, i) => i}
                    renderItem={(chunk) => (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${columnsPerSlide}, 1fr)`,
                          gap: "15px",
                        }}
                      >
                        {chunk.map((item, index) => (
                          <ProductCard
                            key={index}
                            item={item}
                            cardheight="150px"
                            cardWidth="100%"
                            horizontalcard="true"
                            cardFor="popular items"
                          />
                        ))}
                      </Box>
                    )}
                    arrowVariant="inline"
                    autoplay
                    speed={300}
                    slidesPerView={1.2}
                    spaceBetween={16}
                    breakpoints={FEATURED_FILTER_BREAKPOINTS}
                  />
                </SliderCustom>
                {tempData?.products?.length === 0 && (
                  <CustomStackFullWidth
                    sx={{ height: "100%", padding: "2rem" }}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <EmptySearchResults text="Items Not Found!" isItems />
                  </CustomStackFullWidth>
                )}
              </CustomBoxFullWidth>
            </Grid>
          </Grid>
        </HomeComponentsWrapper>
      )}
    </>
  );
};

FeaturedCategoriesWithFilter.propTypes = {};

export default FeaturedCategoriesWithFilter;
