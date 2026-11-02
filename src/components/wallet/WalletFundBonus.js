/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { Box, Stack, alpha } from "@mui/system";
import Image from "next/image";
import React, { useEffect } from "react";
import CustomSlider from "components/common/CustomSlider";
import useWalletBonus from "../../api-manage/hooks/react-query/useWalletBonus";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { CustomDateFormat } from "../date-and-time-formators/CustomDateFormat";
import img from "./assets/add-fund.png";
import { t } from "i18next";

// react-slick breakpoints meant "apply for width <= X" (descending); this
// Swiper breakpoint means "apply for width >= X" (ascending) - re-derived,
// with the 901px gap bump merged in.
const walletFundBreakpoints = {
  601: { slidesPerView: 2 },
  901: { slidesPerView: 2, spaceBetween: 20 },
};

const WalletFundBonus = () => {
  const { data, refetch, isLoading } = useWalletBonus();

  useEffect(() => {
    refetch();
  }, []);

  const Extra_on = t("Extra on Every Add Fund");
  const get = t("Get");
  const valid_till = t("Valid till");
  const you_have_to_add_min = t("You have to add min");
  const fund_to_get_max_of = t("fund to get max of");

  return !isLoading ? (
    <Stack>
      <CustomSlider
        items={data ?? []}
        getKey={(item, i) => i}
        renderItem={(item) => (
          <CustomWalletStack>
            <Box>
              <Typography fontSize={{ xs: "14px", md: "16px" }} fontWeight="600">
                {item?.title}
              </Typography>
              <Typography variant="body2">
                {valid_till} {CustomDateFormat(item?.end_date)}
              </Typography>
              <Typography fontSize="12px">
                {you_have_to_add_min}{" "}
                {getAmountWithSign(item?.minimum_add_amount)}{" "}
                {fund_to_get_max_of}{" "}
                {getAmountWithSign(item?.maximum_bonus_amount)}
              </Typography>
            </Box>
            <Image src={img.src} width="100" height="100" />
          </CustomWalletStack>
        )}
        arrowVariant="inline"
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={walletFundBreakpoints}
      />
    </Stack>
  ) : (
    ""
  );
};
const CustomWalletStack = styled(Stack)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  flexDirection: "row",
  alignItems: "center",
  padding: "25px 0 25px 15px",
  borderRadius: "10px",
  [theme.breakpoints.down("md")]: {
    padding: "15px 0 15px 15px",
  },
  ".MuiBox-root": {
    width: "0",
    flexGrow: "1",
  },
  ".MuiTypography-h6": {
    fontSize: "16px",
    fontWeight: "500",
    color: theme.palette.primary.main,
  },
  ".MuiTypography-body2": {
    display: "block",
    marginBlock: "10px",
  },
  ".MuiTypography-body1": {
    fontSize: "12px",
    lineHeight: "1.3",
    display: "block",
    color: theme.palette.primary.main,
  },
}));

export default WalletFundBonus;
