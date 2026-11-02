import {
  alpha,
  useMediaQuery,
  useTheme,
  Card,
  Skeleton,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import {
  CustomStackFullWidth,
  SliderCustom,
  CustomBoxFullWidth,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import Subtitle1 from "../../typographies/Subtitle1";
import ExpressStoreCard from "components/cards/newCard/ExpressStoreCard";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const VISIT_AGAIN_BREAKPOINTS = {
  341: { slidesPerView: 1.4 },
  481: { slidesPerView: 2 },
  696: { slidesPerView: 2.8 },
  761: { slidesPerView: 3 },
  901: { slidesPerView: 3, spaceBetween: 20 },
  1025: { slidesPerView: 3.5, spaceBetween: 20 },
};

const VisitAgainShimmerCard = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        background: theme.palette.neutral[100],
        padding: "10px",
        width: { xs: "220px", md: "280px" },
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          position: "relative",
          height: { xs: "100px", md: "132px" },
          width: "100%",
        }}
      >
        <Skeleton
          variant="rectangular"
          height="100%"
          width="100%"
          sx={{ borderRadius: "10px" }}
        />
      </Box>
      <CustomBoxFullWidth sx={{ mt: "10px" }}>
        <Grid container spacing={1.5}>
          <Grid item xs={8.5} md={9}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="100%" height={40} />
          </Grid>
          <Grid item xs={3.5} md={3}>
            <Skeleton variant="text" width="100%" height={20} />
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </Card>
  );
};

const VisitAgain = ({ configData, visitedStores, isVisited, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const token = getToken();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getModuleWiseData = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? t("Visit Again!") : t("Whats New"),
          subHeading: t(
            "Get your recent purchase from the shop you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
      case ModuleTypes.PHARMACY:
        return {
          mainPosition: !isVisited ? "flex-start" : "center",
          heading: isVisited ? t("Visit Again!") : t("Whats New"),
          subHeading: t(
            "Get your recent medicine from the store you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
      case ModuleTypes.ECOMMERCE:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? t("Visit Again!") : t("Whats New"),
          subHeading: t(
            "Get your recent purchase from the shop you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
      case ModuleTypes.FOOD:
        return {
          mainPosition: "flex-start",
          heading: isVisited ? t("Wanna Try  Again!!") : t("Whats New"),
          subHeading: t(
            "Get your recent food from the restaurant you recently ordered",
          ),
          bgColor: "transparent",
          titleSx: {
            fontSize: { xs: "18px", md: "24px" },
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
          },
        };
    }
  };
  // Don't render the section if not loading and no visited stores
  if (!isLoading && (!visitedStores || visitedStores.length === 0) && !token) {
    return null;
  }

  const moduleData = getModuleWiseData?.();

  return (
    <CustomStackFullWidth
      alignItems="flex-start"
      spacing={{ xs: 1.5, md: 1 }}
      paddingX={{ xs: 0, md: 0 }}
    >
      <SliderCustom nopadding="true" sx={{ width: "100%" }}>
        <CustomSlider
          items={isLoading ? Array.from({ length: 5 }) : visitedStores}
          getKey={(item, index) => index}
          renderItem={(item) =>
            isLoading ? (
              <VisitAgainShimmerCard />
            ) : (
              <ExpressStoreCard
                store={item}
                showProducts={false}
                width="100%"
                noShadow
              />
            )
          }
          arrowVariant="section"
          title={
            <Box>
              <H1
                text={moduleData?.heading}
                component="h2"
                sx={{ ...moduleData?.titleSx, textAlign: "left" }}
              />
              {isVisited && (
                <Subtitle1
                  textAlign="left"
                  text={moduleData?.subHeading}
                  component="p"
                />
              )}
            </Box>
          }
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={VISIT_AGAIN_BREAKPOINTS}
        />
      </SliderCustom>
    </CustomStackFullWidth>
  );
};

VisitAgain.propTypes = {};

export default VisitAgain;
