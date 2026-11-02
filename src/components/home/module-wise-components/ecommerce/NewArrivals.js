/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import CustomSlider from "components/common/CustomSlider";
import styled from "@emotion/styled";
import useNewArrivals from "../../../../api-manage/hooks/react-query/product-details/useNewArrivals";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "../../../Shimmer/ProductCardSimmer";
import Link from "next/link";

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? `${theme.palette.warning.main}18`
      : "#fffbeb",
  borderRadius: "16px",
  padding: "20px 24px",
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    padding: "20px 16px",
  },
}));

const SliderWrapper = styled(Box)(() => ({
  "& .slick-list": { overflow: "hidden" },
  "& .slick-slide > div": { paddingRight: "16px" },
  "& .slick-slide:first-child > div": { paddingLeft: 0 },
}));

// ─── View All button ───────────────────────────────────────────────────────

const ViewAllTrailing = () => {
  const theme = useTheme();
  return (
    <Link href="/products?type=new_arrival" style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          minWidth: 64,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "9999px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 1px 4px rgba(0,0,0,0.10), 0 0 4px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="i"
            className="fi fi-rr-arrow-small-right"
            sx={{
              fontSize: "16px",
              lineHeight: 1,
              display: "flex",
              color: "primary.main",
            }}
          />
        </Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "primary.main",
            letterSpacing: "-0.48px",
            whiteSpace: "nowrap",
          }}
        >
          {t("View All")}
        </Typography>
      </Box>
    </Link>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────

const NewArrivals = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, refetch, isLoading } = useNewArrivals();

  const isPharmacy = getCurrentModuleType() === ModuleTypes.PHARMACY;

  useEffect(() => {
    refetch();
  }, []);

  const products = data?.products ?? [];

  if (!isLoading && products.length === 0) return null;

  const titleColor =
    theme.palette.mode === "dark" ? theme.palette.warning.light : "#bf6a02";

  const title = isLoading ? (
    <Box>
      <Skeleton variant="text" width="160px" height={32} />
      <Skeleton variant="text" width="220px" height={20} sx={{ mt: "4px" }} />
    </Box>
  ) : (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: "18px", md: "24px" },
          fontWeight: 700,
          color: titleColor,
          lineHeight: 1.1,
          letterSpacing: "-1.2px",
        }}
      >
        {t("New Arrivals")}
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: titleColor,
          lineHeight: 1.3,
          mt: "4px",
        }}
      >
        {t("Freshly added, just for you.")}
      </Typography>
    </Box>
  );

  return (
    <Container>
      <SliderWrapper>
        <CustomSlider
          items={isLoading ? Array.from({ length: 5 }) : products}
          renderItem={(item) =>
            isLoading ? (
              <ProductCardSimmer />
            ) : (
              <NewProductCard
                variant="vertical"
                item={item}
                isPharmacy={isPharmacy}
                cardWidth={{ xs: "150px", md: "170px" }}
              />
            )
          }
          arrowVariant="section"
          title={title}
          stretchItems={false}
          allowOverflowY={false}
          slidesPerView="auto"
          spaceBetween={16}
          breakpoints={{ 901: { spaceBetween: 20 } }}
        />
      </SliderWrapper>
    </Container>
  );
};

NewArrivals.propTypes = {};

export default NewArrivals;
