import { Skeleton, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { handleStoreRedirect } from "../../../../helper-functions/handleStoreRedirect";

import { useDispatch, useSelector } from "react-redux";
import CustomSlider from "components/common/CustomSlider";
import useGetBanners from "../../../../api-manage/hooks/react-query/useGetBanners";
import { getCurrentModuleType } from "../../../../helper-functions/getCurrentModuleType";
import { getModuleId } from "../../../../helper-functions/getModuleId";
import { ModuleTypes } from "../../../../helper-functions/moduleTypes";
import { setBanners } from "../../../../redux/slices/storedData";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../../CustomImageContainer";
import FoodDetailModal from "../../../food-details/foodDetail-modal/FoodDetailModal";
import { getImageUrl } from "utils/CustomFunctions";
import { handleProductRedirect } from "helper-functions/handleProductRedirect";

const BannersWrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "10px",
  width: "100%",
  height: "230px",
  position: "relative",
  overflow: "hidden",
  "&:hover img": {
    transform: "scale(1.1)",
  },
  [theme.breakpoints.down("md")]: {
    height: "200px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "150px",
  },
}));

const CampaignBanners = () => {
  const router = useRouter();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { banners } = useSelector((state) => state.storedData);
  const { data, refetch: refetchBannerData, isFetched } = useGetBanners();
  const [bannersData, setBannersData] = useState([]);
  const [foodBanner, setFoodBanner] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { configData } = useSelector((state) => state.configData);

  const dispatch = useDispatch();
  useEffect(() => {
    if (banners.campaigns.length === 0) {
      refetchBannerData();
    }
  }, [banners]);
  useEffect(() => {
    if (data?.campaigns) {
      dispatch(setBanners(data));
    }
  }, [data]);
  useEffect(() => {
    if (banners.banners.length > 0) {
      handleBannersData();
    }
  }, [banners]);

  const handleBannersData = () => {
    let mergedBannerData = [];
    if (banners?.banners?.length > 0) {
      banners?.banners?.forEach((item) => mergedBannerData.push(item));
    }
    setBannersData(mergedBannerData);
  };
  const handleBannerClick = (banner) => {
    if (banner?.type === "default") {
      router.push(banner?.link);
    }
    if (banner?.type === "store_wise") {
      handleStoreRedirect(banner?.store, router);
    } else {
      if (banner?.type === "item_wise") {
        if (selectedModule?.module_type === "food") {
          setFoodBanner(banner?.item);
          setOpenModal(true);
        } else {
          handleProductRedirect(banner?.item, router);
        }
      }
    }
  };
  const handleModalClose = () => {
    setOpenModal(false);
    //setBannerData(null);
  };

  const getModuleWiseBanners = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        if (bannersData.length > 1) {
          return 2;
        } else {
          return 1;
        }
      case ModuleTypes.PHARMACY:
        if (bannersData.length === 1) {
          return 1;
        } else if (bannersData.length === 2) {
          return 2;
        } else {
          return 3;
        }
      case ModuleTypes.ECOMMERCE:
        if (bannersData.length > 1) {
          return bannersData.length;
        } else {
          return 1;
        }
    }
  };

  const hasMultiple = bannersData.length > 1;
  // react-slick breakpoint:600 meant "apply for width <= 600" (descending);
  // this Swiper breakpoint means "apply for width >= 601" (ascending).
  const campaignBreakpoints = {
    601: { slidesPerView: hasMultiple ? 2 : 1, spaceBetween: 20 },
  };

  return (
    <>
      {!isFetched ? (
        <CustomStackFullWidth sx={{ mt: "30px" }}>
          <CustomSlider
            items={[0, 1]}
            renderItem={() => (
              <BannersWrapper>
                <Skeleton variant="rectangular" height="100%" width="100%" />
              </BannersWrapper>
            )}
            arrowVariant="none"
            allowOverflowY={false}
            slidesPerView={1}
            spaceBetween={10}
            breakpoints={campaignBreakpoints}
          />
        </CustomStackFullWidth>
      ) : (
        bannersData?.length > 0 && (
          <CustomStackFullWidth sx={{ mt: "30px" }}>
            <CustomSlider
              items={bannersData}
              renderItem={(item) => (
                <BannersWrapper onClick={() => handleBannerClick(item)}>
                  <CustomImageContainer
                    src={item?.image_full_url}
                    alt={item?.title}
                    height="100%"
                    width="100%"
                    objectfit="cover"
                    borderRadius="10px"
                  />
                </BannersWrapper>
              )}
              arrowVariant="none"
              allowOverflowY={false}
              loop={hasMultiple}
              autoplay={hasMultiple}
              autoplayDelay={4000}
              speed={800}
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={campaignBreakpoints}
            />
          </CustomStackFullWidth>
        )
      )}

      {openModal && foodBanner && (
        <FoodDetailModal
          product={foodBanner}
          image={`${getImageUrl(
            foodBanner?.storage,
            "item_image_url",
            configData,
          )}/${foodBanner?.image}`}
          open={openModal}
          handleModalClose={handleModalClose}
          setOpen={setOpenModal}
        />
      )}
    </>
  );
};

CampaignBanners.propTypes = {};

export default CampaignBanners;
