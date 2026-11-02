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

// react-slick breakpoint:600 meant "apply for width <= 600" (descending);
// this Swiper breakpoint means "apply for width >= 601" (ascending).
const featureBannerBreakpoints = {
  601: { slidesPerView: 2 },
};

const Banners = ({ landingPageData, isSmall }) => {
  const infiniteManage = () => {
    if (isSmall) {
      return landingPageData?.promotion_banners?.length !== 1;
    }
    return landingPageData?.promotion_banners?.length > 3;
  };

  const slidesToShowManage = () => {
    if (isSmall) {
      return 1;
    } else {
      if (landingPageData?.promotion_banners?.length > 2) {
        return 3;
      } else if (landingPageData?.promotion_banners?.length === 2) {
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
        {landingPageData?.promotion_banners_full_url?.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{

                position: "relative",
                height: "175px",
                width: { sm: "100%", md: "395px" },
                borderRadius: "5px",
                overflow: "hidden",
                "&:hover": {
                  img: {
                    transform: "scale(1.1)",
                    transition: "transform .8s ease-in-out",
                  },
                },
              }}
            >
              <NextImage
                src={item}
                alt="banners"
                height={173}
                width={394}
                objectFit="cover"
                borderRadius="5px"
              />
            </Box>
          );
        })}
      </CustomStackFullWidth>
    );
  };
  const sliderManage = () => {
    return (
      <SliderCustom>
        <CustomSlider
          items={landingPageData?.promotion_banners_full_url ?? []}
          getKey={(item, index) => index}
          renderItem={(item) => (
            <Box
              sx={{
                position: "relative",
                height: "175px",
                width: "100%",
                borderRadius: "5px",
                overflow: "hidden",
                "&:hover": {
                  img: {
                    transform: "scale(1.1)",
                    transition: "transform 0.8s ease-in-out",
                  },
                },
              }}
            >
              <NextImage
                src={item}
                alt="banners"
                height={173}
                width={394}
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
          breakpoints={featureBannerBreakpoints}
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
              `0.828571px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            position: "relative",
            height: "200px",
            borderRadius: "5px",
            width: "100%",
            "img": {
              width: "100%",
              height: "100%",
            }
          }}
        >
          <NextImage
            src={landingPageData?.promotion_banners_full_url[0]}
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
      if (landingPageData?.promotion_banners?.length === 1) {
        return <>{singleImageManage()}</>;
      } else {
        return <>{sliderManage()}</>;
      }
    } else {
      if (landingPageData?.promotion_banners?.length === 1) {
        return <>{singleImageManage()}</>;
      } else if (landingPageData?.promotion_banners?.length === 2) {
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
