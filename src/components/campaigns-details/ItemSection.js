import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import CustomEmptyResult from "../custom-empty-result";
import noData from "../../../public/static/newnoitem.png";
import NewStoreCardSkeleton from "../Shimmer/NewStoreCardSkeleton";
import StoreCard from "../cards/StoreCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";

const ItemSection = ({ campaignsDetails, isLoading, isRefetching }) => {
  const [page_limit, setPageLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const { configData } = useSelector((state) => state.configData);
  return (
    <>
      <Grid container spacing={2.5} paddingTop="1.5rem">
        {campaignsDetails?.stores?.length > 0 &&
          campaignsDetails?.stores?.map((store) => {
            return (
              <Grid key={store?.id} item xs={12} sm={6} md={3}>
                <Box sx={{ "& > *": { width: "100% !important" } }}>
                  <NewStoreCard
                    variant="normal"
                    item={store}
                    imageUrl={store?.cover_photo_full_url}
                  />
                </Box>
              </Grid>
            );
          })}
        {isLoading &&
          [...Array(8)].map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <NewStoreCardSkeleton />
            </Grid>
          ))}
      </Grid>
      {campaignsDetails?.stores?.length === 0 && (
        <CustomEmptyResult
          label="No store found"
          image={noData}
          height="200px"
          width="200px"
        />
      )}
    </>
  );
};

export default ItemSection;
