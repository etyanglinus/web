import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import CustomSlider from "components/common/CustomSlider";
import { useTranslation } from "react-i18next";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import SearchResultStoreCard from "components/cards/newCard/SearchResultStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";

// NewProductCard/SearchResultStoreCard both have their own self-governed
// width, so slides size to the card's real content width via "auto" rather
// than a computed fractional cell. All "auto" sliders here share the same
// gap: 16px on mobile, 20px from tablet up.
const SLIDER_GAP_BREAKPOINTS = {
  901: { spaceBetween: 20 },
};

// ─── Tab values ────────────────────────────────────────────────────────────
const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

// ─── Empty state ───────────────────────────────────────────────────────────
const SearchEmptyState = ({ label, large = false }) => {
  const { t } = useTranslation();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={0.5}
      sx={{ py: { xs: 1.5, md: 2.5 }, width: "100%" }}
    >
      <Box
        component="img"
        src="/static/nodata.png"
        alt=""
        sx={{
          width: large ? { xs: 56, md: 72 } : { xs: 32, md: 44 },
          height: large ? { xs: 56, md: 72 } : { xs: 32, md: 44 },
          objectFit: "contain",
          opacity: 0.5,
        }}
      />
      <Typography
        sx={{
          fontSize: { xs: "11px", md: "12px" },
          fontWeight: 400,
          color: "neutral.500",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {t(label)}
      </Typography>
    </Stack>
  );
};

// ─── Filter pill ───────────────────────────────────────────────────────────
const FilterPill = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      height: { xs: "26px", md: "36px" },
      px: active ? { xs: "12px", md: "16px" } : { xs: "8px", md: "16px" },
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      backgroundColor: active
        ? "primary.main"
        : { xs: "transparent", md: "background.secondary" },
      userSelect: "none",
      transition: "background-color 0.15s",
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "12px", md: "14px" },
        fontWeight: 600,
        color: active ? "#fff" : "neutral.1050",
        letterSpacing: "-0.42px",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// ─── Section title ─────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "18px", md: "24px" },
      fontWeight: 700,
      color: "neutral.1050",
      letterSpacing: "-1.2px",
      lineHeight: 1.1,
    }}
  >
    {children}
  </Typography>
);

// ─── All-tab view (sliders only) ───────────────────────────────────────────
const AllResult = ({
  items,
  stores,
  itemsLabel,
  storesLabel,
  itemsLoading,
  storesLoading,
  showItems,
  showStores,
  theme,
  t,
}) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const bothEmpty =
    !itemsLoading &&
    !storesLoading &&
    items.length === 0 &&
    stores.length === 0;

  if (bothEmpty) {
    return <SearchEmptyState label="No results found" large />;
  }

  return (
    <>
      {showItems &&
        (itemsLoading ? (
          <Stack
            spacing={2}
            sx={{
              pb: { xs: "8px", md: 0 },
              pl: { xs: "20px", md: 0 },
              pr: { xs: 0, md: 0 },
            }}
          >
            <SectionTitle>{itemsLabel}</SectionTitle>
            <Stack direction="row" spacing={{ xs: "12px", md: "20px" }} sx={{ overflow: "hidden" }}>
              {[...Array(5)].map((_, i) => (
                <ProductCardSimmer key={i} cardWidth={{ xs: "140px" }} />
              ))}
            </Stack>
          </Stack>
        ) : items.length > 0 ? (
          <CustomSlider
            items={items}
            renderItem={(item) => (
              <NewProductCard
                variant="vertical"
                item={item}
                cardWidth={isSmall ? "140px" : undefined}
              />
            )}
            arrowVariant="section"
            title={<SectionTitle>{itemsLabel}</SectionTitle>}
            allowOverflowY={false}
            stretchItems={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={SLIDER_GAP_BREAKPOINTS}
            wrapperSx={{
              pb: { xs: "8px", md: 0 },
              pl: { xs: "20px", md: 0 },
              pr: { xs: 0, md: 0 },
            }}
          />
        ) : (
          <Stack
            spacing={2}
            sx={{
              pb: { xs: "8px", md: 0 },
              pl: { xs: "20px", md: 0 },
              pr: { xs: 0, md: 0 },
            }}
          >
            <SectionTitle>{itemsLabel}</SectionTitle>
            <SearchEmptyState label="No results found" />
          </Stack>
        ))}

      {showStores &&
        (storesLoading ? (
          <Stack
            spacing={2}
            sx={{
              pb: { xs: "8px", md: 0 },
              pl: { xs: "20px", md: 0 },
              pr: { xs: 0, md: 0 },
            }}
          >
            <SectionTitle>{storesLabel}</SectionTitle>
            <Stack direction="row" spacing={{ xs: "12px", md: "20px" }} sx={{ overflow: "hidden" }}>
              {[...Array(3)].map((_, i) => (
                <NewStoreCardSkeleton key={i} />
              ))}
            </Stack>
          </Stack>
        ) : stores.length > 0 ? (
          <CustomSlider
            items={stores}
            renderItem={(store) => (
              <SearchResultStoreCard
                store={store}
                showAdBadge={store?.ad}
                items={store?.top_items}
              />
            )}
            arrowVariant="section"
            title={<SectionTitle>{storesLabel}</SectionTitle>}
            stretchItems={false}
            allowOverflowY={false}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={SLIDER_GAP_BREAKPOINTS}
            wrapperSx={{
              pb: { xs: "8px", md: 0 },
              pl: { xs: "20px", md: 0 },
              pr: { xs: 0, md: 0 },
            }}
          />
        ) : (
          <Stack
            spacing={2}
            sx={{
              pb: { xs: "8px", md: 0 },
              pl: { xs: "20px", md: 0 },
              pr: { xs: 0, md: 0 },
            }}
          >
            <SectionTitle>{storesLabel}</SectionTitle>
            <SearchEmptyState label="No results found" />
          </Stack>
        ))}
    </>
  );
};

// ─── Items tab (infinite scroll grid) ──────────────────────────────────────
const ItemsResult = ({
  items,
  itemsLabel,
  itemsLoading,
  itemsHasNext,
  itemsFetchingNext,
  fetchMoreItems,
  theme,
  t,
}) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { ref, inView } = useInView({ rootMargin: "0px 0px 50% 0px" });

  useEffect(() => {
    if (inView && itemsHasNext && !itemsFetchingNext) {
      fetchMoreItems();
    }
  }, [inView, itemsHasNext, itemsFetchingNext, fetchMoreItems]);

  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{itemsLabel}</SectionTitle>
      {!itemsLoading && items.length === 0 ? (
        <SearchEmptyState label="No results found" />
      ) : (
        <Box sx={{ overflow: "hidden" }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {itemsLoading
              ? [...Array(10)].map((_, i) => (
                  <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                    <ProductCardSimmer cardWidth="100%" />
                  </Grid>
                ))
              : items.map((item) => (
                  <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
                    <NewProductCard
                      variant="vertical"
                      item={item}
                      cardWidth={isSmall ? "100%" : undefined}
                    />
                  </Grid>
                ))}
          </Grid>
        </Box>
      )}
      <Box ref={ref} sx={{ height: "10px" }} />
      {itemsFetchingNext && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  );
};

// ─── Stores tab (infinite scroll grid) ─────────────────────────────────────
const StoresResult = ({
  stores,
  storesLabel,
  storesLoading,
  storesHasNext,
  storesFetchingNext,
  fetchMoreStores,
  t,
}) => {
  const { ref, inView } = useInView({ rootMargin: "0px 0px 50% 0px" });

  useEffect(() => {
    if (inView && storesHasNext && !storesFetchingNext) {
      fetchMoreStores();
    }
  }, [inView, storesHasNext, storesFetchingNext, fetchMoreStores]);

  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{storesLabel}</SectionTitle>
      {!storesLoading && stores.length === 0 ? (
        <SearchEmptyState label="No results found" />
      ) : (
        <Box sx={{ overflow: "hidden" }}>
          <Grid container spacing={3}>
            {storesLoading
              ? [...Array(6)].map((_, i) => (
                  <Grid key={i} item xs={12} sm={6} md={4}>
                    <NewStoreCardSkeleton />
                  </Grid>
                ))
              : stores.map((store) => (
                  <Grid key={store?.id} item xs={12} sm={6} md={4}>
                    <Box sx={{ "& > *": { width: "100% !important" } }}>
                      <NewStoreCard
                        variant="normal"
                        item={store}
                        imageUrl={store?.cover_photo_full_url}
                      />
                    </Box>
                  </Grid>
                ))}
          </Grid>
        </Box>
      )}
      <Box ref={ref} sx={{ height: "10px" }} />
      {storesFetchingNext && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────
const CategoryResult = ({
  breadcrumbItems,
  activeTab,
  onTabChange,
  items,
  stores,
  itemsLabel,
  storesLabel,
  itemsLoading,
  storesLoading,
  itemsHasNext,
  storesHasNext,
  itemsFetchingNext,
  storesFetchingNext,
  fetchMoreItems,
  fetchMoreStores,
  appliedFilterCount,
  onFilterOpen,
  storesOnly = false,
  hideAllTab = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // storesOnly mode: no tabs, just stores grid with breadcrumb + filter
  if (storesOnly) {
    return (
      <Stack spacing={3} sx={{ pt: 0 }}>
        {/* Mobile breadcrumb + filter icon */}
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{
            display: { xs: "flex", md: "none" },
            flexWrap: "nowrap",
            px: "16px",
            py: "8px",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomPageBreadCrumb items={breadcrumbItems} />
          </Box>
        </Stack>
        {/* Desktop breadcrumb + filter */}
        <Stack
          direction="row"
          alignItems="center"
          gap={{ xs: "8px", md: "12px" }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexWrap: "nowrap",
            py: { md: "4px" },
            position: { md: "sticky" },
            top: { md: "63px" },
            zIndex: { md: 10 },
            backgroundColor: (th) => th.palette.background.default,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomPageBreadCrumb items={breadcrumbItems} />
          </Box>
          <Box
            onClick={onFilterOpen}
            sx={{
              position: "relative",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.secondary",
              border: (th) => `1px solid ${th.palette.divider}`,
              borderRadius: "8px",
              cursor: "pointer",
              flexShrink: 0,
              "&:hover": { opacity: 0.7 },
            }}
          >
            <i
              className="fi fi-ss-sliders-v"
              style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
            />
            {appliedFilterCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  minWidth: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "neutral.1050",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {appliedFilterCount}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
        <StoresResult
          stores={stores}
          storesLabel={storesLabel}
          storesLoading={storesLoading}
          storesHasNext={storesHasNext}
          storesFetchingNext={storesFetchingNext}
          fetchMoreStores={fetchMoreStores}
          t={t}
        />
      </Stack>
    );
  }

  const showItems = activeTab === TAB_ALL || activeTab === TAB_ITEMS;
  const showStores = activeTab === TAB_ALL || activeTab === TAB_STORES;

  const renderTab = () => {
    if (activeTab === TAB_ITEMS) {
      return (
        <ItemsResult
          items={items}
          itemsLabel={itemsLabel}
          itemsLoading={itemsLoading}
          itemsHasNext={itemsHasNext}
          itemsFetchingNext={itemsFetchingNext}
          fetchMoreItems={fetchMoreItems}
          theme={theme}
          t={t}
        />
      );
    }
    if (activeTab === TAB_STORES) {
      return (
        <StoresResult
          stores={stores}
          storesLabel={storesLabel}
          storesLoading={storesLoading}
          storesHasNext={storesHasNext}
          storesFetchingNext={storesFetchingNext}
          fetchMoreStores={fetchMoreStores}
          t={t}
        />
      );
    }
    return (
      <AllResult
        items={items}
        stores={stores}
        itemsLabel={itemsLabel}
        storesLabel={storesLabel}
        itemsLoading={itemsLoading}
        storesLoading={storesLoading}
        showItems={showItems}
        showStores={showStores}
        theme={theme}
        t={t}
      />
    );
  };

  return (
    <Stack spacing={3} sx={{ pt: 0 }}>
      {/* Mobile-only: breadcrumb + tabs on same row (filter lives in CategoryMobilePageBar) */}
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{
          display: { xs: "flex", md: "none" },
          flexWrap: "nowrap",
          px: "16px",
          py: "8px",
          position: "sticky",
          top: "112px", // MobileNavBar(60px) + CategoryMobilePageBar(52px)
          zIndex: (theme) => theme.zIndex.appBar - 2,
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>
        <Stack
          direction="row"
          gap={{ xs: "2px", md: "6px" }}
          alignItems="center"
          flexShrink={0}
          sx={{
            overflowX: "auto",
            flexWrap: "nowrap",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {!hideAllTab && (
            <FilterPill
              label={t("All")}
              active={activeTab === TAB_ALL}
              onClick={() => onTabChange(TAB_ALL)}
            />
          )}
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => onTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => onTabChange(TAB_STORES)}
          />
        </Stack>
      </Stack>

      {/* Desktop filter bar */}
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: "8px", md: "12px" }}
        sx={{
          flexWrap: "nowrap",
          display: { xs: "none", md: "flex" },
          py: { md: "12px" },
          position: { md: "sticky" },
          top: { md: "63px" },
          zIndex: { md: 10 },
          backgroundColor: (th) => th.palette.background.default,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>

        <Stack direction="row" gap="8px" alignItems="center" flexShrink={0}>
          {!hideAllTab && (
            <FilterPill
              label={t("All")}
              active={activeTab === TAB_ALL}
              onClick={() => onTabChange(TAB_ALL)}
            />
          )}
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => onTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => onTabChange(TAB_STORES)}
          />
        </Stack>

        <Box
          onClick={onFilterOpen}
          sx={{
            position: "relative",
            width: 36,
            height: 36,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.secondary",
            border: (th) => `1px solid ${th.palette.divider}`,
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { opacity: 0.7 },
          }}
        >
          <i
            className="fi fi-ss-sliders-v"
            style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
          />
          {appliedFilterCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                minWidth: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "neutral.1050",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {appliedFilterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {renderTab()}
    </Stack>
  );
};

export default CategoryResult;
