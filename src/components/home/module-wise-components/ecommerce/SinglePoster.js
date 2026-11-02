import React from "react";
import PropTypes from "prop-types";
import CustomImageContainer from "../../../CustomImageContainer";
import { Box, styled } from "@mui/material";
import { CustomBoxFullWidth } from "../../../../styled-components/CustomStyles.style";
import banner from "./assets/banner.png";
import { getHomePageBannerImageUrl } from "utils/CustomFunctions";
import NextImage from "components/NextImage";
const ImageWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  position: "relative",
  borderRadius: "10px",
  overflow: "hidden",
  // Poster artwork is supplied at 5:1; the width drives the height so the
  // image is never letterboxed or cropped differently per breakpoint.
  aspectRatio: "5 / 1",
}));
const SinglePoster = ({ bannerData }) => {
  return (
    <>
      {bannerData?.bottom_section_banner_full_url && (
        // The home pages render this inside a container with mobile padding
        // switched off, so the side gutter on phones lives here.
        <Box sx={{ px: { xs: "16px", sm: 0 } }}>
          <ImageWrapper
            sx={{
              // The section gap already separates it from the row above on
              // phones; the extra top margin only applies from tablet up.
              marginTop: { xs: 0, sm: "1rem" },
              img: { width: "100%", height: "100%", display: "block" },
            }}
          >
            <NextImage
              height={288}
              width={1440}
              src={bannerData?.bottom_section_banner_full_url}
              objectFit="cover"
            />
          </ImageWrapper>
        </Box>
      )}
    </>
  );
};

SinglePoster.propTypes = {};

export default SinglePoster;
