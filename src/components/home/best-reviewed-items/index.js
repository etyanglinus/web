import {
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSlider from "components/common/CustomSlider";
import useGetMostReviewed from "../../../api-manage/hooks/react-query/useGetMostReviewed";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setBestReviewedItems } from "redux/slices/storedData";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import ProductCard from "../../cards/ProductCard";
import CustomImageContainer from "../../CustomImageContainer";
import ProductCardSimmer from "../../Shimmer/ProductCardSimmer";
import H2 from "../../typographies/H2";
import { HomeComponentsWrapper } from "../HomePageComponents";
import Menus from "./Menus";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const FOOD_PAIRS_BREAKPOINTS = {
  601: { slidesPerView: 1.5 },
  901: { slidesPerView: 2 },
};

// NewProductCard variant="horizontal" with no max_width falls back to its
// own default (~398px) — not a fixed px we control here, so the shimmer
// loader below mirrors that with "auto" sizing.
const SHIMMER_BREAKPOINTS = {
  301: { slidesPerView: 1.6 },
  501: { slidesPerView: 2 },
  701: { slidesPerView: 3 },
  751: { slidesPerView: 3.2 },
  901: { slidesPerView: 4 },
  1151: { slidesPerView: 5 },
};

const BestReviewedItems = (props) => {
  const { title, info, bannerIsLoading, isPharmacy } = props;
  const url = info?.best_reviewed_section_banner_full_url;
  const [menu, setMenu] = useState([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const hasBanner = Boolean(info?.best_reviewed_section_banner);
  const bestReviewedBreakpoints = {
    351: { slidesPerView: 1.5 },
    451: { slidesPerView: 1.7 },
    551: { slidesPerView: 2 },
    751: { slidesPerView: hasBanner ? 2.6 : 2.1 },
    1151: { slidesPerView: 3.5 },
    1201: { slidesPerView: hasBanner ? 4 : 5 },
  };
  const {
    data,
    refetch,
    isRefetching: itemIsLoading,
    isLoading,
    isFetching,
  } = useGetMostReviewed({ type: "all" });
  const { bestReviewedItems } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();

  const getCategoryIds = () => {
    const categoryIds = [];
    if (bestReviewedItems && bestReviewedItems.products) {
      bestReviewedItems.products.forEach((product) => {
        if (product?.category_ids) {
          product?.category_ids.forEach((categoryId) => {
            categoryIds.push(categoryId);
          });
        }
      });
    }

    return categoryIds;
  };
  const uniqueCategories = [
    ...new Set(getCategoryIds().map((item) => JSON.stringify(item))),
  ].map(JSON.parse);
  useEffect(() => {
    if (bestReviewedItems.products.length === 0) {
      refetch();
    }
  }, [bestReviewedItems]);
  useEffect(() => {
    if (data) {
      dispatch(setBestReviewedItems(data));
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      if (uniqueCategories?.length > 0) {
        setMenu(["All", ...uniqueCategories?.map((item) => item.name)]);
      }
      setFilteredData(bestReviewedItems.products);
    }
  }, [bestReviewedItems.products]);
  console.log({ uniqueCategories });

  useEffect(() => {
    if (selectedMenuIndex === 0) {
      setFilteredData(bestReviewedItems.products);
      setReRender(true);
    } else {
      const categoryWiseData = bestReviewedItems?.products?.filter((item) => {
        return item?.category_ids?.some((categoryId) => {
          return uniqueCategories[selectedMenuIndex - 1]?.id === categoryId?.id;
        });
      });

      setFilteredData(categoryWiseData);
      setReRender(true);
    }
  }, [selectedMenuIndex]);

  console.log("vvvv", getCategoryIds());

  return (
    <>
      {getCurrentModuleType() === ModuleTypes.FOOD ? (
        <HomeComponentsWrapper>
          {bestReviewedItems && bestReviewedItems?.products?.length > 0 && (
            <>
              <CustomStackFullWidth
                alignItems={isSmall ? "center" : "flex-start"}
                justyfyContent="center"
                spacing={1}
              >
                <H2 text={title} textAlign="left" component="h2" />
                <CustomBoxFullWidth>
                  <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    sx={{
                      "& .MuiGrid-item": {
                        display: "flex",
                        flexDirection: "column",
                      },
                    }}
                  >
                    {/* Banner — 4 col desktop only */}
                    {url && (
                      <Grid
                        item
                        xs={0}
                        md={4}
                        sx={{ display: { xs: "none", md: "block" } }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            "&:hover img": {
                              transform: "scale(1.05)",
                              transition: "transform 0.3s ease",
                            },
                          }}
                        >
                          {bannerIsLoading ? (
                            <Skeleton
                              variant="rectangular"
                              height="100%"
                              width="100%"
                            />
                          ) : (
                            <Box sx={{ position: "absolute", inset: 0 }}>
                              <CustomImageContainer
                                src={url}
                                height="100%"
                                width="100%"
                                borderRadius="12px"
                                objectfit="cover"
                              />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Slider — 8 col desktop, 12 col mobile */}
                    <Grid item xs={12} md={url ? 8 : 12}>
                      <CustomSlider
                        items={(() => {
                          const items = bestReviewedItems?.products ?? [];
                          const pairs = [];
                          for (let i = 0; i < items.length; i += 2) {
                            pairs.push(items.slice(i, i + 2));
                          }
                          return pairs;
                        })()}
                        getKey={(pair, pi) => pi}
                        renderItem={(pair) => (
                          <Stack spacing="20px">
                            {pair.map((item, ii) => (
                              <NewProductCard
                                key={ii}
                                item={item}
                                variant="horizontal"
                              />
                            ))}
                          </Stack>
                        )}
                        arrowVariant="inline"
                        speed={500}
                        slidesPerView={1.1}
                        spaceBetween={16}
                        breakpoints={FOOD_PAIRS_BREAKPOINTS}
                      />
                    </Grid>
                  </Grid>
                </CustomBoxFullWidth>
              </CustomStackFullWidth>
            </>
          )}
        </HomeComponentsWrapper>
      ) : (
        <>
          {isFetching ? (
            <CustomStackFullWidth spacing={1}>
              <Skeleton width="200px" />

              <SliderCustom nopadding="true">
                <CustomSlider
                  items={Array.from({ length: 5 })}
                  renderItem={() => (
                    <ProductCardSimmer variant="horizontal" />
                  )}
                  arrowVariant="none"
                  speed={500}
                  slidesPerView={1.5}
                  spaceBetween={16}
                  breakpoints={SHIMMER_BREAKPOINTS}
                />
              </SliderCustom>
            </CustomStackFullWidth>
          ) : (
            <>
              {bestReviewedItems && filteredData.length > 0 && (
                <HomeComponentsWrapper>
                  <Stack gap="16px">
                    <CustomStackFullWidth
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {isPharmacy ? (
                        <Typography
                          sx={{
                            fontSize: { xs: "18px", md: "24px" },
                            fontWeight: 700,
                            color: "neutral.1050",
                            lineHeight: 1.1,
                            letterSpacing: "-1.2px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {title}
                        </Typography>
                      ) : (
                        <H2 text={title} component="h2" />
                      )}
                      <Stack
                        maxWidth="960px"
                        width={isSmall ? "initial" : "100%"}
                      >
                        {menu?.length > 0 && (
                          <Menus
                            selectedMenuIndex={selectedMenuIndex}
                            setSelectedMenuIndex={setSelectedMenuIndex}
                            menus={menu}
                          />
                        )}
                      </Stack>
                    </CustomStackFullWidth>
                    <Grid container spacing={{ xs: 1, md: 1, lg: 1 }}>
                      {info?.best_reviewed_section_banner && !isSmall && (
                        <Grid item xs={0} sm={0} lg={2.5}>
                          <CustomBoxFullWidth
                            sx={{
                              position: "relative",
                              height: {
                                xs: "200px",
                                sm: "300px",
                                md: "352px",
                              },
                              paddingTop: "8px",
                              display: {
                                xs: "none",
                                sm: "inherit",
                              },
                              "&:hover": {
                                img: {
                                  transform: "scale(1.03)",
                                },
                              },
                            }}
                          >
                            {bannerIsLoading ? (
                              <Skeleton
                                variant="rectangular"
                                height="100%"
                                width="100%"
                              />
                            ) : (
                              <CustomImageContainer
                                src={url}
                                height="100%"
                                width="100%"
                                borderRadius=".7rem"
                                objectfit="cover"
                              />
                            )}
                          </CustomBoxFullWidth>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={info?.best_reviewed_section_banner ? 9.5 : 12}
                      >
                        <Grid item md={12} container position="relative">
                          <CustomStackFullWidth
                            justifyContent="right"
                            key={reRender}
                          >
                            <SliderCustom>
                              <CustomSlider
                                items={filteredData}
                                getKey={(product) => product?.id}
                                renderItem={(product) =>
                                  isPharmacy ? (
                                    <NewProductCard
                                      variant="vertical"
                                      item={product}
                                      isPharmacy
                                      cardWidth={{ xs: "150px", md: "170px" }}
                                    />
                                  ) : (
                                    <ProductCard
                                      item={product}
                                      cardheight="340px"
                                      cardFor="vertical"
                                      cardType="vertical-type"
                                    />
                                  )
                                }
                                arrowVariant="inline"
                                stretchItems={!isPharmacy}
                                speed={500}
                                slidesPerView={isPharmacy ? "auto" : 1.2}
                                spaceBetween={16}
                                breakpoints={
                                  isPharmacy
                                    ? undefined
                                    : bestReviewedBreakpoints
                                }
                              />
                            </SliderCustom>
                          </CustomStackFullWidth>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Stack>
                </HomeComponentsWrapper>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

BestReviewedItems.propTypes = {};

export default BestReviewedItems;
