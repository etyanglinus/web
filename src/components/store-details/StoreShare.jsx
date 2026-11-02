import React from 'react';
import {CustomStackFullWidth, SliderCustom} from "styled-components/CustomStyles.style";
import CustomModal from "components/modal";
import {Button, IconButton, TextField, Typography, useMediaQuery} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import {Stack} from "@mui/system";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import {
  EmailIcon,
  EmailShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'
import CustomSlider from "components/common/CustomSlider";
import {useTheme} from "@mui/styles";
import {useTranslation} from "react-i18next";
import {t} from "i18next";

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const SHARE_BREAKPOINTS = {
  421: { slidesPerView: 6 },
  480: { slidesPerView: 7 },
  1025: { slidesPerView: 8 },
  1451: { slidesPerView: 9 },
};

const StoreShare = (props) => {
  const {openShareModal,setOpenShareModal,handleCopy}=props
  const theme=useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const currentRoute =
    typeof window !== 'undefined' ? window.location.href : ''
  const size = isSmall ? 30 : 40
  const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ''
  return (
    <CustomModal
      openModal={openShareModal}
      setOpenModal={setOpenShareModal}
      handleClose={() => setOpenShareModal(false)}
      maxWidth="550px"
    >
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ position: 'relative' }}
      >
        <IconButton
          onClick={() => setOpenShareModal(false)}
          sx={{
            zIndex: '99',
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: (theme) =>
              theme.palette.neutral[100],
            borderRadius: '50%',
            [theme.breakpoints.down('md')]: {
              top: 10,
              right: 5,
            },
          }}
        >
          <CloseIcon
            sx={{ fontSize: '24px', fontWeight: '500' }}
          />
        </IconButton>
      </CustomStackFullWidth>
      <CustomStackFullWidth padding="20px">
        <Typography
          fontWeight={600}
          fontSize="20px"
          color={theme.palette.neutral[1000]}
        >
          {t('Share')}
        </Typography>
        <Stack padding="10px" flexDirection="row" gap="10px">
          <TextField
            fullWidth
            variant="outlined"
            value={currentRoute}
            fontWeight={400}
            InputProps={{
              style: {
                height: '40px !important', // Adjust the height as needed
                fontSize: '12px',
              },
              readOnly: true,
            }}
          />
          <Button
            sx={{ minWidth: '45px', padding: '8px 10px' }}
            variant="contained"
            onClick={() => handleCopy(currentRoute)}
          >
            <ContentCopyIcon />
          </Button>
        </Stack>
        <Stack marginTop=".5rem">
          <SliderCustom nopadding="true">
            <CustomSlider
              items={[
                "facebookMessenger",
                "twitter",
                "whatsapp",
                "linkedin",
                "telegram",
                "email",
                "reddit",
                "tumblr",
                "livejournal",
                "line",
              ]}
              getKey={(key) => key}
              renderItem={(key) => {
                switch (key) {
                  case "facebookMessenger":
                    return (
                      <FacebookMessengerShareButton
                        url={currentRoute}
                        appId={FACEBOOK_APP_ID}
                      >
                        <FacebookMessengerIcon size={size ? size : 40} round />
                      </FacebookMessengerShareButton>
                    );
                  case "twitter":
                    return (
                      <TwitterShareButton url={currentRoute}>
                        <TwitterIcon size={size ? size : 40} round />
                      </TwitterShareButton>
                    );
                  case "whatsapp":
                    return (
                      <WhatsappShareButton url={currentRoute} separator=":: ">
                        <WhatsappIcon size={size ? size : 40} round />
                      </WhatsappShareButton>
                    );
                  case "linkedin":
                    return (
                      <LinkedinShareButton
                        url={currentRoute}
                        source={currentRoute}
                      >
                        <LinkedinIcon size={size ? size : 40} round />
                      </LinkedinShareButton>
                    );
                  case "telegram":
                    return (
                      <TelegramShareButton url={currentRoute}>
                        <TelegramIcon size={size ? size : 40} round />
                      </TelegramShareButton>
                    );
                  case "email":
                    return (
                      <EmailShareButton url={currentRoute}>
                        <EmailIcon size={size ? size : 40} round />
                      </EmailShareButton>
                    );
                  case "reddit":
                    return (
                      <RedditShareButton
                        url={currentRoute}
                        windowWidth={660}
                        windowHeight={460}
                      >
                        <RedditIcon size={size ? size : 40} round />
                      </RedditShareButton>
                    );
                  case "tumblr":
                    return (
                      <TumblrShareButton url={String(window.location.origin)}>
                        <TumblrIcon size={size ? size : 40} round />
                      </TumblrShareButton>
                    );
                  case "livejournal":
                    return (
                      <LivejournalShareButton url={currentRoute}>
                        <LivejournalIcon size={size ? size : 40} round />
                      </LivejournalShareButton>
                    );
                  case "line":
                    return (
                      <LineShareButton url={currentRoute}>
                        <LineIcon size={size ? size : 40} round />
                      </LineShareButton>
                    );
                  default:
                    return null;
                }
              }}
              arrowVariant="inline"
              stretchItems={false}
              slidesPerView={5}
              spaceBetween={12}
              breakpoints={SHARE_BREAKPOINTS}
            />
          </SliderCustom>
        </Stack>
      </CustomStackFullWidth>
    </CustomModal>
  );
};

export default StoreShare;