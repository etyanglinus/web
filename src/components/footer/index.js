import { useRouter } from "next/router";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import FastaFooter from "./FastaFooter";

const FooterComponent = ({
  configData,
  landingPageData: initialLandingPageData,
}) => {
  const router = useRouter();
  const { data } = useGetLandingPage();
  const bottomSpace =
    router.pathname === "/"
      ? 0
      : router.pathname === "/home"
      ? "120px"
      : "65px";
  return (
    <FastaFooter
      configData={configData}
      landingPageData={data || initialLandingPageData}
      bottomSpace={bottomSpace}
    />
  );
};
export default FooterComponent;
