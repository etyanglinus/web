import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../api-error-response/ErrorResponses";
import { basic_campaigns_api } from "../../ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiList } from "../../getApiContent";

const getData = async () => {
  const { data } = await MainApi.get(basic_campaigns_api);
  return getApiList(data);
};

export default function useGetBasicCampaigns() {
  return useQuery(
    ["basic-cam", getModuleId(), getCurrentModuleType()],
    getData,
    {
      enabled: true,
      staleTime: 60 * 1000,
      cacheTime: 60 * 1000,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      onError: onSingleErrorResponse,
    },
  );
}
