import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomSlider from "components/common/CustomSlider";
import CustomImageContainerJs from "../../CustomImageContainer";

const CustomImageContainer = CustomImageContainerJs as React.FC<any>;

const buildEmbedAutoplayUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  let baseUrl = url;
  let videoId: string | null = null;
  if (ytMatch) {
    videoId = ytMatch[1];
    baseUrl = `https://www.youtube.com/embed/${videoId}`;
  } else {
    const embedMatch = url.match(/\/embed\/([^?/&]+)/);
    videoId = embedMatch?.[1] ?? null;
  }
  const params = [
    "autoplay=1",
    "mute=1",
    "loop=1",
    "controls=0",
    "modestbranding=1",
    "playsinline=1",
    "rel=0",
    videoId ? `playlist=${videoId}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}${params}`;
};

interface FoodModalMediaPreviewProps {
  imageUrl?: string | string[];
  product:
    | ({
        video_preview_available?: boolean;
        video_preview_type?: string | null;
        video_preview_url?: string | null;
        video_preview_modal_url?: string | null;
      } & Record<string, any>)
    | null
    | undefined;
  height?: string;
  aspectRatio?: string;
  borderRadius?: string;
  alt?: string;
  activeIndex?: number;
  onSlideChange?: (idx: number) => void;
}

const FoodModalMediaPreview = ({
  imageUrl,
  product,
  height = "200px",
  aspectRatio = "2/1",
  borderRadius = ".3rem",
  alt = "Product",
  activeIndex,
  onSlideChange,
}: FoodModalMediaPreviewProps) => {
  const previewType = product?.video_preview_type;
  const inlineUrl = product?.video_preview_url ?? "";
  const modalUrl = product?.video_preview_modal_url ?? "";

  const useVideoTag = previewType === "upload" && !!inlineUrl;
  const useEmbedInline = previewType === "embed" && !!inlineUrl;

  const videoUrl = useVideoTag || useEmbedInline ? inlineUrl : modalUrl;

  const hasVideo = !!product?.video_preview_available && !!videoUrl;

  const images = Array.isArray(imageUrl)
    ? imageUrl.filter(Boolean)
    : imageUrl
    ? [imageUrl]
    : [];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const swiperRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(activeIndex ?? 0);

  useEffect(() => {
    if (typeof activeIndex !== "number") return;
    if (activeIndex === currentSlide) return;
    if (!swiperRef.current) return;
    swiperRef.current.slideTo(activeIndex);
  }, [activeIndex, currentSlide]);

  useEffect(() => {
    if (!hasVideo || !useVideoTag) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* autoplay blocked, user can swipe */
        });
      }
    };
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener("loadeddata", tryPlay, { once: true });
      return () => v.removeEventListener("loadeddata", tryPlay);
    }
  }, [hasVideo, useVideoTag, videoUrl]);

  if (!hasVideo && images.length <= 1) {
    return (
      <CustomImageContainer
        src={images[0]}
        borderRadius={borderRadius}
        width="100%"
        height={height}
        alt={alt}
        objectfit="cover"
        aspectRatio={aspectRatio}
      />
    );
  }

  const slideShellSx = {
    position: "relative" as const,
    width: "100%",
    height,
    aspectRatio,
    overflow: "hidden",
    borderRadius,
    backgroundColor: "#000",
  };

  const mediaStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    border: 0,
  };

  const videoSlide = (
    <Box sx={slideShellSx}>
      {useVideoTag ? (
        <video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ ...mediaStyle, pointerEvents: "none" }}
        />
      ) : (
        <iframe
          key={videoUrl}
          src={buildEmbedAutoplayUrl(videoUrl)}
          title="Product video preview"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          style={{ ...mediaStyle, pointerEvents: "none" }}
        />
      )}
    </Box>
  );

  type MediaItem = { key: string; kind: "video" | "image"; src?: string };
  const mediaItems: MediaItem[] = [
    ...(hasVideo ? [{ key: "video", kind: "video" as const }] : []),
    ...images.map((src, idx) => ({
      key: `${src}-${idx}`,
      kind: "image" as const,
      src,
    })),
  ];

  return (
    <Box
      sx={{
        position: "relative",
        "& .swiper": { borderRadius },
        "& .swiper-slide": { lineHeight: 0 },
        "& .swiper-pagination": {
          position: "absolute",
          bottom: "8px",
          margin: 0,
          zIndex: 2,
          display: "flex !important",
          justifyContent: "center",
          gap: "4px",
        },
        "& .swiper-pagination-bullet": {
          width: "8px",
          height: "8px",
          margin: "0 !important",
          borderRadius: "50%",
          backgroundColor: "#fff",
          opacity: 0.6,
        },
        "& .swiper-pagination-bullet-active": { opacity: 1 },
      }}
    >
      <CustomSlider
        items={mediaItems}
        getKey={(item: MediaItem) => item.key}
        renderItem={(item: MediaItem) =>
          item.kind === "video" ? (
            videoSlide
          ) : (
            <CustomImageContainer
              src={item.src}
              borderRadius={borderRadius}
              width="100%"
              height={height}
              alt={alt}
              objectfit="cover"
              aspectRatio={aspectRatio}
            />
          )
        }
        arrowVariant="inline"
        showDots
        speed={400}
        slidesPerView={1}
        swiperProps={{
          onSwiper: (swiper: any) => {
            swiperRef.current = swiper;
          },
          onSlideChange: (swiper: any) => {
            setCurrentSlide(swiper.activeIndex);
            onSlideChange?.(swiper.activeIndex);
          },
          initialSlide: activeIndex ?? 0,
        }}
      />
    </Box>
  );
};

export default FoodModalMediaPreview;
