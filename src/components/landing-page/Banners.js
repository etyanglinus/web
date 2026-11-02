import { Stack, alpha } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CustomSlider from "components/common/CustomSlider";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import CustomContainer from "../container";
import NextImage from "components/NextImage";

const Banners = ({ promotionalBanner, isSmall, feature }) => {
  const infiniteManage = () => {
    if (isSmall) {
      return promotionalBanner?.length !== 1;
    }
    return promotionalBanner?.length > 3;
  };

  const slidesToShowManage = () => {
    if (isSmall) {
      return 1;
    } else {
      if (promotionalBanner?.length > 2) {
        return 2;
      } else if (promotionalBanner?.length === 2) {
        return 2;
      } else {
        return 1;
      }
    }
  };
  const twoItemManage = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        flexDirection="row"
        gap="20px"
      >
        {/* <Grid container spacing={2}> */}
        {promotionalBanner?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                border: (theme) =>
                  `0.828571px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                position: "relative",

                width: { sm: "100%", md: "590px" },
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "3/1",
                "img": {
                  height: "100%",
                  maxWidth: "100%",
                  width: "100%",


                  // border: "1px solid"
                }
              }}
            >
              <NextImage
                src={item}
                alt="banners"
                height={173}
                width={590}
                objectFit="cover"
                borderRadius="20px"
                aspectRatio="3/1"
              />
            </Box>
          );
        })}
      </CustomStackFullWidth>
    );
  };
  // react-slick breakpoint:X meant "apply for width <= X" (descending); this
  // Swiper breakpoint means "apply for width >= X" (ascending) - shifted by +1.
  const bannerBreakpoints = {
    601: { slidesPerView: slidesToShowManage() },
  };

  const sliderManage = () => {
    return (
      <SliderCustom>
        <CustomSlider
          items={promotionalBanner ?? []}
          getKey={(item, index) => index}
          renderItem={(item) => (
            <Box
              sx={{
                border: (theme) =>
                  `0.828571px solid ${alpha(
                    theme.palette.primary.main,
                    0.15,
                  )}`,
                position: "relative",
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "3/1",
                img: {
                  height: "100%",
                  maxWidth: "100%",
                  width: "100%",
                },
              }}
            >
              <NextImage
                src={item}
                alt="banners"
                height={200}
                width={590}
                objectFit="cover"
                borderRadius="20px"
              />
            </Box>
          )}
          arrowVariant="none"
          allowOverflowY={false}
          loop={infiniteManage()}
          autoplay
          autoplayDelay={3000}
          speed={2000}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={bannerBreakpoints}
        />
      </SliderCustom>
    );
  };
  const singleImageManage = () => {
    return (
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            position: "relative",

            borderRadius: "5px",
            width: "100%",
            aspectRatio: "3/1",
            "img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // border: "1px solid"
            }
          }}
        >
          <NextImage
            src={promotionalBanner[0]?.img}
            alt="banners"
            height={175}
            width={1250}
            objectFit="cover"
            borderRadius="5px"

          />
        </Box>
      </Stack>
    );
  };
  const handleContent = () => {
    if (isSmall) {
      if (promotionalBanner?.length === 1) {
        return <>{singleImageManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    } else {
      if (promotionalBanner?.length === 1) {
        return <>{singleImageManage()}</>;
      } else if (promotionalBanner?.length === 2) {
        return <>{twoItemManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    }
  };
  return (
    <CustomContainer>
      <Stack sx={{ marginY: isSmall ? "22px" : "40px" }}>
        {handleContent()}
      </Stack>
    </CustomContainer>
  );
};

export default Banners;
