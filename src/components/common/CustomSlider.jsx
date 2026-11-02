import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Box, Stack, alpha, useMediaQuery, useTheme } from "@mui/material";
import { getLanguage } from "helper-functions/getLanguage";

/**
 * CustomSlider — common Swiper wrapper, replaces react-slick.
 *
 * Pass `items` + `renderItem`. Handles arrows, RTL, safe-loop (no
 * width-explosion when slide count <= slidesPerView), and auto-hiding arrows
 * when nothing can scroll.
 *
 * `breakpoints` are Swiper-style min-width ascending — opposite of
 * react-slick's max-width descending `responsive` array. When migrating a
 * react-slick config, the breakpoint list has to be re-derived, not just
 * copied over.
 *
 * Arrow variants:
 *  "section" — prev/next sit in the header row (top-right), matching
 *              SliderSectionHeader's nav-button style. Pass `title` to render it.
 *  "inline"  — arrows overlaid centered on slide edges. Hidden on mobile.
 *  "none"    — no arrows.
 *
 * `mousewheel` (default true) — hover + trackpad horizontal swipe, or
 * Shift+wheel, moves the slides. forceToAxis means it never hijacks normal
 * vertical page scrolling. Pass `mousewheel={false}` to turn it off per slider.
 *
 * Motion: slides ease out over `speed` ms with `easing` (an ease-out curve
 * rather than Swiper's default `ease`), touch has a small start threshold so
 * taps never nudge the track, and edge resistance is softened. Pass
 * `freeMode` for momentum scrolling that still settles on a slide.
 *
 * `stretchItems` (default true) — forces each slide's content to the slide's
 * own cell width. Turn off for cards with their own intrinsic/self-governed
 * width (e.g. SearchResultStoreCard's `calc(100vw - 40px)`) that are meant to
 * overflow their cell and get clipped by the slider's own edge for a
 * peek/overlap effect — forcing them to 100% fights that design.
 */
// Nav button — matches SliderSectionHeader's style exactly. Defined at module
// level so edge-state updates do not remount the buttons mid-interaction.
const NavBtn = ({ onClick, icon, disabled }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 28,
        height: 28,
        borderRadius: "9999px",
        backgroundColor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        flexShrink: 0,
        opacity: disabled ? 0.35 : 1,
        transition: "opacity 0.2s, background-color 0.2s",
        "&:hover": {
          backgroundColor: disabled ? "background.paper" : "action.hover",
        },
      }}
    >
      <Box
        component="i"
        className={`fi fi-rr-${icon}`}
        sx={{
          fontSize: "13px",
          lineHeight: 1,
          display: "flex",
          color: "neutral.1050",
        }}
      />
    </Box>
  );
};

// Inline arrow button — overlaid, centered on slide edges
const InlineArrowBtn = ({ onClick, icon, disabled, side }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        position: "absolute",
        [side]: -14,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: alpha(theme.palette.background.paper, 0.92),
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, 0.1)}`,
        transition: "opacity 0.2s",
      }}
    >
      <Box
        component="i"
        className={`fi fi-rr-${icon}`}
        sx={{
          fontSize: "13px",
          lineHeight: 1,
          display: "flex",
          color: "text.primary",
        }}
      />
    </Box>
  );
};

const CustomSlider = ({
  items = [],
  renderItem,
  getKey,

  slidesPerView = 1,
  breakpoints = undefined,
  spaceBetween = 16,
  loop = false,
  autoplay = false,
  autoplayDelay = 3500,
  centered = false,
  speed = 500,
  easing = "cubic-bezier(0.22, 0.61, 0.36, 1)",
  freeMode = false,
  grabCursor = true,

  arrowVariant = "section",
  title = undefined,
  trailing = undefined,
  headerSx = {},

  showDots = false,
  allowOverflowY = true,
  mousewheel = true,
  stretchItems = true,
  wrapperSx = {},
  swiperProps = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isRTL = getLanguage() === "rtl";

  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  // Pagination is rendered in our own DOM node (outside the `.swiper` root,
  // which clips its own content via overflow:hidden) so dots can sit below
  // the slides instead of overlapping them.
  const [paginationEl, setPaginationEl] = useState(null);

  // Safe loop guard — Swiper explodes slide widths when loop is enabled but
  // slide count <= visible count, and even when it's only *slightly* above,
  // loop mode's wrap-around duplicate slides don't get a full buffer, which
  // shows up as a stray oversized gap at the loop boundary. Swiper's own
  // guidance is to only loop when there's roughly double the visible count
  // in reserve, so require that instead of just "more than fits".
  const maxSlidesPerView = (() => {
    const toNum = (v) => (typeof v === "number" ? v : 0);
    let max = toNum(slidesPerView);
    if (breakpoints) {
      for (const bp of Object.values(breakpoints)) {
        max = Math.max(max, toNum(bp?.slidesPerView));
      }
    }
    return max || 1;
  })();
  const safeLoop = loop && items.length >= Math.ceil(maxSlidesPerView) * 2;

  // isLocked = all slides fit in view, nothing to scroll → hide arrows
  const noOverflow = isLocked;
  const edgeAware = !safeLoop && !autoplay;
  const hidePrev = edgeAware && isBeginning;
  const hideNext = edgeAware && isEnd;

  const syncEdges = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setIsLocked(!!swiper.isLocked);
  };

  // RTL: swap prev/next direction
  const handlePrev = (e) => {
    e.stopPropagation();
    isRTL ? swiperRef.current?.slideNext() : swiperRef.current?.slidePrev();
  };
  const handleNext = (e) => {
    e.stopPropagation();
    isRTL ? swiperRef.current?.slidePrev() : swiperRef.current?.slideNext();
  };

  const resolveKey = (item, i) =>
    typeof getKey === "function" ? getKey(item, i) : item?.id ?? i;

  const showArrows = arrowVariant !== "none" && !noOverflow && !isMobile;

  const prevIcon = isRTL ? "angle-small-right" : "angle-small-left";
  const nextIcon = isRTL ? "angle-small-left" : "angle-small-right";

  const modules = [];
  if (mousewheel) modules.push(Mousewheel);
  if (autoplay) modules.push(Autoplay);
  if (showDots) modules.push(Pagination);
  if (freeMode) modules.push(FreeMode);

  return (
    <Stack spacing={2} sx={wrapperSx}>
      {arrowVariant === "section" && (title || trailing) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", ...headerSx }}
        >
          <Box sx={{ flex: 1, minWidth: 0, textAlign: "start" }}>{title}</Box>
          <Stack
            direction="row"
            alignItems="center"
            gap="8px"
            sx={{ flexShrink: 0 }}
          >
            {trailing && (
              <Box sx={{ flexShrink: 0, minWidth: "max-content" }}>
                {trailing}
              </Box>
            )}
            {showArrows && (
              <>
                <NavBtn
                  onClick={handlePrev}
                  icon={prevIcon}
                  disabled={hidePrev}
                />
                <NavBtn
                  onClick={handleNext}
                  icon={nextIcon}
                  disabled={hideNext}
                />
              </>
            )}
          </Stack>
        </Stack>
      )}

      <Box sx={{ position: "relative" }}>
        {arrowVariant === "inline" && showArrows && (
          <>
            <InlineArrowBtn
              onClick={handlePrev}
              icon={prevIcon}
              disabled={hidePrev}
              side={isRTL ? "right" : "left"}
            />
            <InlineArrowBtn
              onClick={handleNext}
              icon={nextIcon}
              disabled={hideNext}
              side={isRTL ? "left" : "right"}
            />
          </>
        )}

        <Box
          sx={{
            overflowX: "hidden",
            overflowY: allowOverflowY ? "visible" : "hidden",
            py: allowOverflowY ? "8px" : 0,
            // Ease-out curve for every track move (Swiper reads this variable).
            // No will-change / backface-visibility here on purpose: forcing a
            // GPU layer per slider made Chrome re-rasterize at drag start,
            // which showed as a blink. Swiper's translate3d is enough.
            "--swiper-wrapper-transition-timing-function": easing,
            "& .swiper-wrapper": { transitionTimingFunction: easing },
            // swiper/css ships a baseline ".swiper-slide{width:100%}" rule that
            // outranks a plain inline style in some build setups — force it
            // with !important so auto mode's content-based sizing actually wins.
            ...(slidesPerView === "auto" && {
              "& .swiper-slide": { width: "auto !important" },
            }),
          }}
        >
          <Swiper
            // Re-key on direction change so Swiper remounts with correct RTL state
            key={isRTL ? "rtl" : "ltr"}
            modules={modules}
            dir={isRTL ? "rtl" : "ltr"}
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
            loop={safeLoop}
            // Pre-render extra neighbours around the loop seam so the
            // wrap-around reshuffle never shows an empty or jumping slide.
            loopAdditionalSlides={safeLoop ? 2 : 0}
            centeredSlides={centered}
            speed={speed}
            grabCursor={grabCursor}
            // A few px of travel before a drag starts, so taps never nudge the
            // track; short flicks still count, and edges resist more softly.
            threshold={6}
            longSwipesRatio={0.25}
            longSwipesMs={250}
            resistanceRatio={0.7}
            freeMode={
              freeMode
                ? {
                    enabled: true,
                    sticky: true,
                    momentumRatio: 0.7,
                    momentumVelocityRatio: 0.7,
                    momentumBounce: false,
                  }
                : false
            }
            autoplay={
              autoplay
                ? { delay: autoplayDelay, disableOnInteraction: false }
                : false
            }
            pagination={
              showDots ? { el: paginationEl, clickable: true } : false
            }
            mousewheel={
              mousewheel
                ? {
                    forceToAxis: true,
                    sensitivity: 1,
                    releaseOnEdges: true,
                    // Coalesce trackpad ticks so one gesture moves one step
                    // instead of firing a jump per wheel event.
                    thresholdDelta: 8,
                    thresholdTime: 150,
                  }
                : false
            }
            breakpoints={breakpoints}
            style={{ overflow: "visible" }}
            {...swiperProps}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              syncEdges(swiper);
              swiperProps.onSwiper?.(swiper);
            }}
            onSlideChange={(swiper) => {
              syncEdges(swiper);
              swiperProps.onSlideChange?.(swiper);
            }}
            onResize={(swiper) => {
              syncEdges(swiper);
              swiperProps.onResize?.(swiper);
            }}
            onReachBeginning={(swiper) => {
              setIsBeginning(true);
              swiperProps.onReachBeginning?.(swiper);
            }}
            onReachEnd={(swiper) => {
              setIsEnd(true);
              swiperProps.onReachEnd?.(swiper);
            }}
            onFromEdge={(swiper) => {
              syncEdges(swiper);
              swiperProps.onFromEdge?.(swiper);
            }}
          >
            {items.map((item, i) => (
              <SwiperSlide
                key={resolveKey(item, i)}
                style={slidesPerView === "auto" ? { width: "auto" } : undefined}
              >
                <Box
                  sx={{
                    width: slidesPerView === "auto" ? "auto" : "100%",
                    minWidth: 0,
                    ...(stretchItems &&
                      slidesPerView !== "auto" && {
                        "& > *": {
                          width: "100% !important",
                          maxWidth: "100% !important",
                        },
                      }),
                  }}
                >
                  {renderItem ? renderItem(item, i) : null}
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {showDots && (
          <Box ref={setPaginationEl} className="swiper-pagination" />
        )}
      </Box>
    </Stack>
  );
};

export default CustomSlider;
