import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import { useGetRecommendStores } from "api-manage/hooks/react-query/store/useGetRecommendStores";
import useGetTrendingSearches from "api-manage/hooks/react-query/useGetTrendingSearches";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ClosedNow from "components/closed-now";
import NextImage from "components/NextImage";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getStoreRedirectURL } from "helper-functions/handleStoreRedirect";
import Link from "next/link";
import { useMemo } from "react";
import CustomSlider from "components/common/CustomSlider";
import useGetTopRatedStores from "api-manage/hooks/react-query/store/useGetTopRatedStores";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { useGetRecommendedServices } from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/recommended-services";

// ─── Styled (same as New Arrival food module) ──────────────────────────────

const StoreCard = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  width: "80px",
}));

const StoreImageBox = styled(Box)(() => ({
  position: "relative",
  width: "80px",
  height: "80px",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #ededed",
  backgroundColor: "background.paper",
  flexShrink: 0,
}));

// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
const topRestaurantsBreakpoints = (searchFromNav = false) => ({
  401: { slidesPerView: 4.2 },
  601: { slidesPerView: searchFromNav ? 4.8 : 8.2 },
});

const featuredRestaurantsBreakpoints = (searchFromNav = false) => ({
  341: { slidesPerView: 1.4 },
  481: { slidesPerView: 2 },
  696: { slidesPerView: 1 },
  761: { slidesPerView: 2.1 },
  1025: { slidesPerView: 2.8 },
  1451: { slidesPerView: searchFromNav ? 1.8 : 2.7 },
});

// ─── Section wrapper ───────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <Stack spacing={2}>
    <Typography
      sx={{
        fontSize: "18px",
        fontWeight: 700,
        color: "neutral.1050",
        letterSpacing: "-0.54px",
        lineHeight: 1.1,
      }}
    >
      {title}
    </Typography>
    {children}
  </Stack>
);

// ─── Section: Recent Searches ─────────────────────────────────────────────

const RecentSearchSection = ({
  list,
  onItemClick,
  onDelete,
  onClearAll,
  t,
}) => {
  if (!list || list.length === 0) return null;
  return (
    <Stack spacing={2}>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
          }}
        >
          {t("Recent Searches")}
        </Typography>
        <Typography
          onClick={onClearAll}
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#ec221f",
            letterSpacing: "-0.48px",
            lineHeight: 1.1,
            cursor: "pointer",
            userSelect: "none",
            textTransform: "capitalize",
          }}
        >
          {t("Clear All")}
        </Typography>
      </Stack>

      {/* Items */}
      <Stack spacing="6px">
        {list
          .slice(0, 6)
          .reverse()
          .map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" gap="12px">
              <i
                className="fi fi-rr-clock"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: "neutral.500",
                  flexShrink: 0,
                }}
              />
              <Typography
                onClick={() => onItemClick(item)}
                sx={{
                  flex: 1,
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "neutral.700",
                  lineHeight: 1.3,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.7 },
                }}
              >
                {item}
              </Typography>
              <Box
                onClick={() => onDelete(item)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: "8px",
                  cursor: "pointer",
                  flexShrink: 0,
                  "&:hover": { opacity: 0.7 },
                }}
              >
                <i
                  className="fi fi-rr-cross-small"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    display: "flex",
                    color: "neutral.500",
                  }}
                />
              </Box>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

// ─── Section: Trending Searches ──────────────────────────────────────────

const TrendingSearchSection = ({ onItemClick, t, isLoading, items }) => {
  if (!isLoading && items.length === 0) return null;

  return (
    <Box
      sx={{
        backgroundColor: "background.secondary",
        px: "20px",
        py: "16px",
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
          }}
        >
          {t("Trending Searches")}
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "12px",
              columnGap: "16px",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={90}
                height={24}
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "12px",
              columnGap: "16px",
            }}
          >
            {items.map((keyword, index) => (
              <Box
                key={index}
                onClick={() => onItemClick(keyword)}
                sx={{
                  px: "8px",
                  py: "4px",
                  height: "24px",
                  borderRadius: "8px",
                  backgroundColor: "background.paper",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.15s",
                  "&:hover": { opacity: 0.75 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "neutral.1050",
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

// ─── Section: Top Restaurants / Top Store / Top Providers ───────────────────

const TopRestaurantsSection = ({ t, searchFromNav = false }) => {
  const moduleType = getCurrentModuleType();
  const isFoodModule = moduleType === "food";
  const isServiceModule = moduleType === "service";

  const { data: storesData, isLoading } = useGetSearchPageData(
    {
      offset: 1,
      currentTab: 1,
      page_limit: 20,
      quick_action: "top_rated",
    },
    () => {},
    moduleType !== ModuleTypes.SERVICE, // if not service module call the hooks
  );

  const { data: topRatedStoreInfiniteDate, isLoading: topRatedLoading } =
    useGetTopRatedStores({
      pageParams: {
        type: "service-search",
        offset: 1,
        limit: 20,
      },
      enabled: moduleType === ModuleTypes.SERVICE,
    });

  const flatTopRatedStoreList = useMemo(() => {
    if (moduleType !== ModuleTypes.SERVICE) return [];
    return (
      topRatedStoreInfiniteDate?.pages?.flatMap(
        (page) => page?.providers ?? [],
      ) ?? []
    );
  }, [topRatedStoreInfiniteDate, moduleType]);

  const rawStores = storesData?.pages?.[0]?.stores ?? [];
  const stores = isServiceModule ? flatTopRatedStoreList : rawStores;

  if (!isLoading && !topRatedLoading && stores.length === 0) return null;

  const sectionTitle = isFoodModule
    ? t("Top Restaurants")
    : isServiceModule
    ? t("Top Providers")
    : t("Top Store");

  const loading = isLoading || topRatedLoading;
  const baseSlidesPerView = searchFromNav ? 4.8 : 8.2;
  const canLoop = stores.length >= Math.ceil(baseSlidesPerView);

  const sliderItems = loading ? (
    <Stack direction="row" spacing="20px" sx={{ overflow: "hidden" }}>
      {[...Array(5)].map((_, i) => (
        <Stack key={i} alignItems="center" gap="6px">
          <Skeleton
            variant="rounded"
            width={80}
            height={80}
            sx={{ borderRadius: "12px" }}
          />
          <Skeleton variant="text" width={60} height={14} />
        </Stack>
      ))}
    </Stack>
  ) : stores.length > 0 ? (
    <CustomSlider
      items={stores}
      renderItem={(store) => (
        <Link href={getStoreRedirectURL(store)}>
          <StoreCard>
            <StoreImageBox>
              <NextImage
                src={store?.logo_full_url}
                alt={store?.name}
                width={80}
                height={80}
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
              <ClosedNow
                active={store?.active}
                open={store?.open}
                borderRadius="12px"
              />
            </StoreImageBox>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.1050",
                letterSpacing: "-0.42px",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "80px",
                lineHeight: 1.2,
              }}
            >
              {store?.name}
            </Typography>
          </StoreCard>
        </Link>
      )}
      stretchItems={false}
      arrowVariant="inline"
      loop={canLoop}
      autoplay={canLoop}
      autoplayDelay={2500}
      speed={600}
      slidesPerView={3.5}
      spaceBetween={20}
      breakpoints={topRestaurantsBreakpoints(searchFromNav)}
    />
  ) : null;

  return <Section title={sectionTitle}>{sliderItems}</Section>;
};

const FeaturedRestaurantsSection = ({
  t,
  searchFromNav = false,
  popularData,
  popularIsLoading,
}) => {
  const moduleType = getCurrentModuleType();
  const isFoodModule = moduleType === "food";
  const isServiceModule = moduleType === "service";

  const sliderItems = popularIsLoading ? (
    <Stack direction="row" spacing="20px" sx={{ overflow: "hidden" }}>
      {[...Array(4)].map((_, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={120} />
          <Box sx={{ p: "10px" }}>
            <Skeleton variant="text" width="70%" height={16} />
            <Skeleton
              variant="text"
              width="50%"
              height={14}
              sx={{ mt: "4px" }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  ) : popularData?.stores?.length > 0 ? (
    <CustomSlider
      items={popularData.stores}
      renderItem={(item) => (
        <NewStoreCard
          variant="normal"
          item={item}
          imageUrl={item?.cover_photo_full_url}
        />
      )}
      arrowVariant="none"
      slidesPerView={1.2}
      spaceBetween={20}
      breakpoints={featuredRestaurantsBreakpoints(searchFromNav)}
    />
  ) : null;
  if (!popularData?.stores?.length) return null;

  return (
    <Section
      title={
        isFoodModule
          ? t("Featured Restaurants")
          : isServiceModule
          ? t("Featured Providers")
          : t("Featured Store")
      }
    >
      {sliderItems}
    </Section>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────

const SearchDropdownEmpty = ({
  list,
  onItemClick,
  onDelete,
  onClearAll,
  t,
  searchFromNav = false,
}) => {
  const { data, isLoading } = useGetTrendingSearches();

  const { data: rawPopularData, isLoading: popularIsLoading } =
    useGetRecommendStores();

  const isServiceModule = getCurrentModuleType() === "service";
  const popularData = rawPopularData;
  const items = (
    Array.isArray(data?.trending_searches) ? data?.trending_searches : []
  )
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.keyword ?? item?.name ?? item?.title,
    )
    .filter(Boolean);

  return (
    <Stack>
      {list.length ? (
        <Box sx={{ px: "20px", pt: "20px", pb: "24px" }}>
          <RecentSearchSection
            list={list}
            onItemClick={onItemClick}
            onDelete={onDelete}
            onClearAll={onClearAll}
            t={t}
          />
        </Box>
      ) : null}
      <TrendingSearchSection
        onItemClick={onItemClick}
        t={t}
        isLoading={isLoading}
        items={items}
      />
      <Box sx={{ pl: "20px", pt: items.length ? "24px" : "20px", pb: "24px" }}>
        <TopRestaurantsSection t={t} searchFromNav={searchFromNav} />
      </Box>
      {popularData?.stores?.length ? (
        <>
          <Divider sx={{ borderColor: "divider", borderBottomWidth: "2px" }} />
          <Box sx={{ pl: "20px", pt: "24px", pb: "20px" }}>
            <FeaturedRestaurantsSection
              t={t}
              searchFromNav={searchFromNav}
              popularData={popularData}
              popularIsLoading={popularIsLoading}
            />
          </Box>
        </>
      ) : null}
    </Stack>
  );
};

export default SearchDropdownEmpty;
