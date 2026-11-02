import { basic_campaigns_details_api } from "../../ApiRoutes";
import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../getApiContent";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const getData = async (pageParams) => {
  const { id } = pageParams;
  const { data } = await MainApi.get(
    `${basic_campaigns_details_api}?basic_campaign_id=${id}`
  );
  return getApiCollection(data);
};

export default function useGetBasicCampaignsDetails(pageParams) {
  return useQuery(
    [
      "basic-campaigns-details",
      pageParams?.id,
      getModuleId(),
      getCurrentModuleType(),
    ],
    () => getData(pageParams),
    {
      enabled: false,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      onError: onSingleErrorResponse,
    },
  );
}
