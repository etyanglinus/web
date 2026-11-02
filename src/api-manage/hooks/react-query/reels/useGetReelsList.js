import MainApi from "../../../MainApi";
import { reels_list_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../../getApiContent";
import { getModuleId } from "helper-functions/getModuleId";

const getData = async ({ limit = 10, offset = 1, guest_id } = {}) => {
  const { data } = await MainApi.get(
    `${reels_list_api}?limit=${limit}&offset=${offset}${
      guest_id ? `&guest_id=${guest_id}` : ""
    }`,
  );
  return getApiCollection(data, "reels");
};

export default function useGetReelsList(handleSuccess, params) {
  return useQuery(
    ["reels-list", params, getModuleId()],
    () => getData(params),
    {
      onSuccess: handleSuccess,
      enabled: false,
      onError: onSingleErrorResponse,
    },
  );
}
