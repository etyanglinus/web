import styled from "@emotion/styled";
import {
  Button,
  Dialog,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  MailruIcon,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  PinterestIcon,
  PinterestShareButton,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  VKIcon,
  VKShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton,
} from "react-share";
import {
  CodePreviewWrapper,
  ReferralShareBox,
  ShareButton,
} from "./ReferralCode.style";
import ShareIcon from "@mui/icons-material/Share";
import { fb_app_id } from "../../utils/staticCredential";
import CustomModal from "../custom-component/CustomModal";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import CustomCopyWithTooltip from "../custom-copy-with-tooltip";
import CustomSlider from "../common/CustomSlider";

// react-slick row of share icons had no gap convention; use the standard
// 16px mobile / 20px desktop (>=901px) gap.
const referralShareBreakpoints = {
  901: { spaceBetween: 20 },
};

const ReferralShare = ({ referralCode, horizontal, size }) => {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const companyName = configData?.business_name;
  const pinId = "patwary6am";
  useEffect(() => {
    const code_url = `
        ${companyName}
        Referral code=${referralCode}
        ${window.location.origin}`;

    setCurrentUrl(code_url);
  }, []);
  const shareUrl = `${t("Hey there welcome to")} ${companyName}! ${t(
    "If you're checking out"
  )} ${companyName} ${t(
    "for the first time, make sure to use the referral code"
  )} ${referralCode} ${t(
    "when you sign up. It's my way of welcoming you to this awesome e-commerce platform! Happy shopping on"
  )} ${companyName}! ${currentUrl}`;
  const title = `${t("Hey there welcome to")} ${companyName}!`;

  return (
    <>
      <ReferralShareBox horizontal={horizontal}>
        <FacebookMessengerShareButton
          url={shareUrl}
          appId={fb_app_id}
          quote={shareUrl}
        >
          <FacebookMessengerIcon size={size ? size : 40} round />
        </FacebookMessengerShareButton>
        <TwitterShareButton url={shareUrl}>
          <TwitterIcon size={size ? size : 40} round />
        </TwitterShareButton>
        <WhatsappShareButton
          url={shareUrl}
          separator=":: "
          title={title}
          quote={shareUrl}
        >
          <WhatsappIcon size={size ? size : 40} round />
        </WhatsappShareButton>
        <LinkedinShareButton
          title={title}
          url={currentUrl}
          source={currentUrl}
          summary={shareUrl}
        >
          <LinkedinIcon size={size ? size : 40} round />
        </LinkedinShareButton>
        <ShareButton size={`${size}px`} onClick={() => setOpen(true)}>
          <ShareIcon
            sx={{ fontSize: `${size - 12}px`, color: theme.palette.info.main }}
          />
        </ShareButton>
        <CustomModal openModal={open} setModalOpen={setOpen}>
          <Paper
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "350px", sm: "450px", md: "550px" },
              p: "1.2rem",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              padding: "40px",
            }}
          >
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <CloseIcon sx={{ fontSize: "22px" }} />
            </IconButton>
            <Typography fontSize="16px">{t("Share")}</Typography>
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
              getKey={(kind) => kind}
              renderItem={(kind) => {
                switch (kind) {
                  case "facebookMessenger":
                    return (
                      <FacebookMessengerShareButton
                        url={shareUrl}
                        appId={fb_app_id}
                        quote={shareUrl}
                      >
                        <FacebookMessengerIcon size={size ? size : 40} round />
                      </FacebookMessengerShareButton>
                    );
                  case "twitter":
                    return (
                      <TwitterShareButton url={shareUrl}>
                        <TwitterIcon size={size ? size : 40} round />
                      </TwitterShareButton>
                    );
                  case "whatsapp":
                    return (
                      <WhatsappShareButton
                        url={shareUrl}
                        separator=":: "
                        title={title}
                        quote={shareUrl}
                      >
                        <WhatsappIcon size={size ? size : 40} round />
                      </WhatsappShareButton>
                    );
                  case "linkedin":
                    return (
                      <LinkedinShareButton
                        title={title}
                        url={currentUrl}
                        source={currentUrl}
                        summary={shareUrl}
                      >
                        <LinkedinIcon size={size ? size : 40} round />
                      </LinkedinShareButton>
                    );
                  case "telegram":
                    return (
                      <TelegramShareButton url={shareUrl}>
                        <TelegramIcon size={size ? size : 40} round />
                      </TelegramShareButton>
                    );
                  case "email":
                    return (
                      <EmailShareButton
                        url={currentUrl}
                        subject={title}
                        body={shareUrl}
                      >
                        <EmailIcon size={size ? size : 40} round />
                      </EmailShareButton>
                    );
                  case "reddit":
                    return (
                      <RedditShareButton
                        title={title}
                        url={shareUrl}
                        windowWidth={660}
                        windowHeight={460}
                      >
                        <RedditIcon size={size ? size : 40} round />
                      </RedditShareButton>
                    );
                  case "tumblr":
                    return (
                      <TumblrShareButton
                        url={String(window.location.origin)}
                        title={title}
                        caption={shareUrl}
                      >
                        <TumblrIcon size={size ? size : 40} round />
                      </TumblrShareButton>
                    );
                  case "livejournal":
                    return (
                      <LivejournalShareButton
                        url={shareUrl}
                        title={title}
                        description={shareUrl}
                      >
                        <LivejournalIcon size={size ? size : 40} round />
                      </LivejournalShareButton>
                    );
                  case "line":
                    return (
                      <LineShareButton url={shareUrl} title={title}>
                        <LineIcon size={size ? size : 40} round />
                      </LineShareButton>
                    );
                  default:
                    return null;
                }
              }}
              arrowVariant="inline"
              stretchItems={false}
              slidesPerView="auto"
              spaceBetween={16}
              breakpoints={referralShareBreakpoints}
            />
            <CodePreviewWrapper
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              padding="5px"
            >
              <Typography fontWeight="600" color={theme.palette.primary.main}>
                {profileInfo?.ref_code}{" "}
              </Typography>
              <Stack padding="3px">
                <CustomCopyWithTooltip
                  t={t}
                  value={currentUrl}
                  forModal={true}
                  companyName={companyName}
                  referralCode={referralCode}
                />
              </Stack>
            </CodePreviewWrapper>
          </Paper>
        </CustomModal>
      </ReferralShareBox>
    </>
  );
};
export default ReferralShare;
