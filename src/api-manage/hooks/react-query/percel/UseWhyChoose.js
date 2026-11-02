import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { parcel_whyChoose_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../../getApiContent";

const getWhyChoose = async () => {
  const { data } = await MainApi.get(parcel_whyChoose_api);
  // v4.2 moved the rows from `banners` to a paginated `data` list; expose
  // both names so the section keeps reading `banners`.
  return getApiCollection(data, "banners");
};

export default function useWhyChoose() {
  return useQuery("why-choose", getWhyChoose, {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
