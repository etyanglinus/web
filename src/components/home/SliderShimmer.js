import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import ProductCardSimmer from "../Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "../Shimmer/NewStoreCardSkeleton";

const ProductRowShimmer = () => (
  <Stack direction="row" spacing={{ xs: "12px", md: "20px" }} sx={{ overflow: "hidden" }}>
    {[...Array(6)].map((_, i) => (
      <ProductCardSimmer key={i} />
    ))}
  </Stack>
);

const StoreRowShimmer = () => (
  <Stack direction="row" spacing={{ xs: "12px", md: "20px" }} sx={{ overflow: "hidden" }}>
    {[...Array(4)].map((_, i) => (
      <Box key={i} sx={{ width: { xs: "220px", md: "280px" }, flexShrink: 0 }}>
        <NewStoreCardSkeleton />
      </Box>
    ))}
  </Stack>
);

const BrandRowShimmer = () => (
  <Stack direction="row" spacing={{ xs: 2, md: 3 }} sx={{ overflow: "hidden" }}>
    {[...Array(8)].map((_, i) => (
      <Stack key={i} alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
        <Skeleton variant="rounded" width={92} height={92} sx={{ borderRadius: "12px" }} />
        <Skeleton variant="text" width={70} height={16} />
      </Stack>
    ))}
  </Stack>
);

const BannerShimmer = () => (
  <Skeleton
    variant="rounded"
    width="100%"
    height={160}
    sx={{ borderRadius: "16px" }}
  />
);

const VARIANTS = {
  product: ProductRowShimmer,
  store: StoreRowShimmer,
  brand: BrandRowShimmer,
  banner: BannerShimmer,
};

const SliderShimmer = ({ variant = "product" }) => {
  const Variant = VARIANTS[variant] ?? ProductRowShimmer;
  return <Variant />;
};

export default SliderShimmer;
