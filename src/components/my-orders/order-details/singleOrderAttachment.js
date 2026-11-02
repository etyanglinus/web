import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import CustomSlider from "components/common/CustomSlider";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import CustomModal from "../../modal";

const SingleOrderAttachment = (props) => {
  const { title, trackOrderData, configData } = props;
  const [selectedImage, setSelectedImage] = useState(null);
  const images = trackOrderData?.order_attachment_full_url ?? [];

  return (
    <CustomStackFullWidth
      alignItems="flex-start"
      spacing={2}
      pl={{ xs: "0px", sm: "0px", md: "28px" }}
      pb="20px"
    >
      <CustomSlider
        items={images}
        getKey={(url, index) => index}
        renderItem={(url) => (
          <Box
            onClick={() => setSelectedImage(url)}
            sx={{
              width: "100px",
              height: "100px",
              overflow: "hidden",
              borderRadius: "4px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <CustomImageContainer
              src={url}
              width="100%"
              height="100%"
              objectfit="cover"
              alt="prescription"
              borderRadius="4px"
            />
          </Box>
        )}
        arrowVariant="inline"
        stretchItems={false}
        slidesPerView="auto"
        spaceBetween={16}
      />

      <CustomModal
        openModal={!!selectedImage}
        handleClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <Stack position="relative">
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                zIndex: "999",
                position: "absolute",
                right: 0,
                cursor: "pointer",
                border: "none",
                borderRadius: "50%",
                width: " 2rem",
                height: "2rem",
              }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </button>
            <CustomImageContainer
              src={selectedImage}
              width="600px"
              smWidth="300px"
              objectfit="contain"
              alt="prescription"
            />
          </Stack>
        )}
      </CustomModal>
    </CustomStackFullWidth>
  );
};

SingleOrderAttachment.propTypes = {};

export default SingleOrderAttachment;
