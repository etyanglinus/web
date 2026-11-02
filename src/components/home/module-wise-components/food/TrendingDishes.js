import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useGetPopularItemsNearby from "api-manage/hooks/react-query/useGetPopularItemsNearby";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import { t } from "i18next";
import CustomSlider from "components/common/CustomSlider";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const TRENDING_DISHES_GAP_BREAKPOINTS = {
  901: { spaceBetween: 20 },
};

// ─── Styled ────────────────────────────────────────────────────────────────

const SectionWrapper = styled(Box)({
  width: "100%",
});

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Main ──────────────────────────────────────────────────────────────────

const TrendingDishes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // same hooks will call for getting popular items result
  const { data } = useGetPopularItemsNearby({ offset: 1, type: "all" });
  const dishes = data?.products ?? [];

  if (!dishes.length) return null;

  return (
    <SectionWrapper>
      <HomeComponentsWrapper sx={{ gap: "1rem" }}>
        <SliderWrapper>
          <CustomSlider
            items={dishes}
            renderItem={(item) => (
              <NewProductCard
                max_width={isMobile ? "300px" : undefined}
                variant="horizontal"
                item={item}
              />
            )}
            getKey={(item) => item.id}
            arrowVariant="section"
            title={
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                }}
              >
                {t("Trending Dishes")}
              </Typography>
            }
            stretchItems={false}
            allowOverflowY={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={TRENDING_DISHES_GAP_BREAKPOINTS}
          />
        </SliderWrapper>
      </HomeComponentsWrapper>
    </SectionWrapper>
  );
};

export default TrendingDishes;
