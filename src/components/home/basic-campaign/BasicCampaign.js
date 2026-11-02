import { Skeleton } from "@mui/material";
import React, { useEffect } from "react";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import useGetBasicCampaigns from "../../../api-manage/hooks/react-query/useGetBasicCampaigns";
import CustomSlider from "components/common/CustomSlider";
import { BannersWrapper } from "../banners";
import { useRouter } from "next/router";

const BasicCampaign = () => {
  const router = useRouter();
  const { data, refetch, isFetched, isLoading } = useGetBasicCampaigns();
  // Only banners with artwork are renderable slides.
  const banners = (data ?? []).filter((item) => item?.image_full_url);

  const handleBannerClick = (banner) => {
    router
      .push(
        {
          pathname: "/campaigns/[id]",
          query: { id: `${banner?.slug || banner?.id}` },
        },
        undefined,
        { shallow: true }
      )
      .then(() => {
        // Add slight delay to ensure new page is mounted
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100); // delay helps after DOM updates
      });
  };

  // react-slick breakpoint:600 meant "apply for width <= 600" (descending);
  // this Swiper breakpoint means "apply for width >= 601" (ascending).
  const bannersBreakpoints = {
    // Always two per view on desktop: a lone campaign keeps the same
    // half-width card it would have next to a second one, rather than
    // stretching the 150px-tall artwork across the whole row.
    601: { slidesPerView: 2 },
  };

  return (
    <>
      {isLoading ? (
        <CustomStackFullWidth
          sx={{
            "& .slick-list": {
              marginRight: { xs: "-10px", sm: "-20px" },
            },
            "& .slick-slide": {
              paddingRight: { xs: "10px", sm: "20px" },
            },
          }}
        >
          <CustomSlider
            items={Array.from({ length: 2 })}
            renderItem={() => (
              <BannersWrapper>
                <Skeleton variant="rectangular" height="100%" width="100%" />
              </BannersWrapper>
            )}
            arrowVariant="none"
            allowOverflowY={false}
            slidesPerView={1.1}
            spaceBetween={16}
            breakpoints={bannersBreakpoints}
          />
        </CustomStackFullWidth>
      ) : (
        banners.length > 0 && (
          <CustomStackFullWidth
            sx={{
              "& .slick-list": {
                marginRight: { xs: "-10px", sm: "-20px" },
              },
              "& .slick-slide": {
                paddingRight: { xs: "10px", sm: "20px" },
              },
            }}
          >
            <SliderCustom float="center">
              <CustomSlider
                items={banners}
                getKey={(item, index) => index}
                renderItem={(item) => (
                  <BannersWrapper onClick={() => handleBannerClick(item)}>
                    <CustomImageContainer
                      src={item?.image_full_url}
                      alt={item?.title}
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      borderRadius="10px"
                      bg="#ddd"
                    />
                  </BannersWrapper>
                )}
                arrowVariant="none"
                allowOverflowY={false}
                loop={banners.length > 2}
                autoplay
                autoplayDelay={4000}
                speed={800}
                slidesPerView={1.1}
                spaceBetween={16}
                breakpoints={bannersBreakpoints}
              />
            </SliderCustom>
          </CustomStackFullWidth>
        )
      )}
    </>
  );
};

BasicCampaign.propTypes = {};

export default BasicCampaign;
