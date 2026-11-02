import { useTheme } from "@emotion/react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect } from "react";
import CustomSlider from "components/common/CustomSlider";
import { t } from "i18next";
import useWhyChoose from "../../api-manage/hooks/react-query/percel/UseWhyChoose";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import WhyChooseSimmer from "../Shimmer/Parcel/WhyChooseSimmer";
import H1 from "../typographies/H1";
import NextImage from "components/NextImage";

// react-slick breakpoints meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - re-derived.
const parcelFeaturesBreakpoints = {
  481: { slidesPerView: 2 },
  701: { slidesPerView: 3 },
  2401: { slidesPerView: 8 },
};

const ParcelFeatures = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data, refetch, isLoading } = useWhyChoose();
  // The hook exposes the rows under both the legacy `banners` key and the
  // 4.2 `data` key; read one list and use it everywhere below.
  const banners = data?.banners ?? data?.data ?? [];

  useEffect(() => {
    refetch();
  }, []);

  const renderCard = (item, key) => (
    <Stack
      key={key}
      alignItems="center"
      justifyContent="center"
      maxWidth="275px"
      width="100%"
      display="flex !important"
      spacing={{ xs: 1, sm: 1.5, md: 2 }}
      sx={{
        img: {
          width: { xs: "90px", sm: "130px", md: "150px" },
          height: { xs: "90px", sm: "130px", md: "150px" },
          aspectRatio: "1",
          objectFit: "contain",
        },
      }}
    >
      <NextImage
        src={item?.image_full_url}
        width={150}
        height={150}
        objectFit="contain"
        smWidth="90px"
        smHeight="90px"
      />
      <Stack spacing={{ xs: 0.5, sm: 0.75, md: 1 }} padding="0 10px">
        <Typography
          textAlign="center"
          width="100%"
          maxWidth="275px"
          fontSize={{
            xs: "20px",
          }}
          fontWeight="700"
          color="neutral.1050"
          sx={{ wordWrap: "break-word" }}
          component="h3"
        >
          {item?.title}
        </Typography>
        <Typography
          width="100%"
          maxWidth="275px"
          fontSize={{
            xs: "11px",
            sm: "12px",
            md: "14px",
          }}
          color={theme.palette.neutral[400]}
          textAlign="center"
          lineHeight={1.4}
          sx={{ wordWrap: "break-word" }}
        >
          {item.short_description}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderHeader = () => (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={{ xs: 1, md: 0.5 }}
    >
      <H1
        text="Why Send With Us"
        component="h2"
        sx={{ fontSize: { xs: "22px", md: "36px" }, color: "neutral.1050" }}
      />
      <Typography
        textAlign="center"
        color={theme.palette.neutral[400]}
        fontSize={{ xs: "12px", md: "14px" }}
      >
        {t(
          "Experience smooth, secure, and dependable delivery from pickup to drop-off."
        )}
      </Typography>
    </Stack>
  );

  if (isLoading) {
    return (
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 2, md: 3 }}
        mt={{ xs: "20px", sm: "30px", md: "50px" }}
      >
        {renderHeader()}
        <CustomStackFullWidth>
          {isMobile ? (
            <Grid container spacing={2} justifyContent="center">
              {[...Array(4)].map((_, index) => (
                <Grid
                  item
                  xs={6}
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <WhyChooseSimmer />
                </Grid>
              ))}
            </Grid>
          ) : (
            <CustomSlider
              items={[...Array(4)]}
              getKey={(_, index) => index}
              renderItem={() => <WhyChooseSimmer />}
              arrowVariant="none"
              slidesPerView={1.7}
              spaceBetween={20}
              breakpoints={parcelFeaturesBreakpoints}
            />
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 2, md: 3 }}
      mt={{ xs: "20px", sm: "30px", md: "50px" }}
    >
      {renderHeader()}
      <CustomStackFullWidth>
        {isMobile ? (
          <Grid container spacing={2} justifyContent="center">
            {banners.map((item, index) => (
              <Grid
                item
                xs={12}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {renderCard(item, index)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <CustomSlider
            items={banners}
            getKey={(item, index) => index}
            renderItem={(item, index) => renderCard(item, index)}
            arrowVariant="none"
            slidesPerView={1.7}
            spaceBetween={20}
            breakpoints={parcelFeaturesBreakpoints}
          />
        )}
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default ParcelFeatures;
