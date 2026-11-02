import React, { useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import CustomSlider from "components/common/CustomSlider";
import NextImage from "components/NextImage";
import useGetOtherBanners from "../../api-manage/hooks/react-query/useGetOtherBanners";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../home/HomePageComponents";

// react-slick breakpoints meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - re-derived,
// with the 901px gap bump merged in.
const parcelOnTimeBreakpoints = {
  577: { slidesPerView: 2 },
  901: { slidesPerView: 2, spaceBetween: 20 },
  993: { slidesPerView: 3, spaceBetween: 20 },
};

// Every card is a 2:1 box: the slide width drives the height, and the image
// covers it, so the ratio holds at every breakpoint instead of a fixed
// pixel height stretching with the slide.
const bannerBoxSx = {
  width: "100%",
  aspectRatio: "2 / 1",
  borderRadius: "20px",
  overflow: "hidden",
  position: "relative",
  img: { width: "100%", height: "100%", display: "block" },
};

const ParcelOnTime = () => {
  const { data, isLoading, refetch } = useGetOtherBanners();
  // For the parcel module this endpoint returns a paginated list
  // ({ data: [{ value_full_url }], pagination }) rather than the bare array
  // other modules get, so accept both shapes.
  const banners = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  useEffect(() => {
    refetch();
  }, []);

  if (!isLoading && banners.length === 0) {
    return null;
  }

  return (
    <HomeComponentsWrapper>
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <CustomBoxFullWidth>
          {isLoading ? (
            <CustomSlider
              items={[...Array(4)]}
              getKey={(_, index) => index}
              renderItem={() => (
                <Box sx={bannerBoxSx}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
              )}
              arrowVariant="none"
              showDots
              allowOverflowY={false}
              autoplay
              autoplayDelay={4000}
              speed={800}
              slidesPerView={1.1}
              spaceBetween={16}
              breakpoints={parcelOnTimeBreakpoints}
            />
          ) : (
            <CustomSlider
              items={banners}
              getKey={(item, index) => index}
              renderItem={(item) => (
                <Box sx={bannerBoxSx}>
                  <NextImage
                    src={item?.value_full_url || ""}
                    width={400}
                    height={200}
                    objectFit="cover"
                  />
                </Box>
              )}
              arrowVariant="none"
              showDots
              allowOverflowY={false}
              loop={banners.length > 3}
              autoplay
              autoplayDelay={4000}
              speed={800}
              slidesPerView={1.1}
              spaceBetween={16}
              breakpoints={parcelOnTimeBreakpoints}
            />
          )}
        </CustomBoxFullWidth>
      </CustomStackFullWidth>
    </HomeComponentsWrapper>
  );
};

export default ParcelOnTime;
