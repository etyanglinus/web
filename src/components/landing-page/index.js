import { NoSsr } from "@mui/material";
import CookiesConsent from "../CookiesConsent";
import PushNotificationLayout from "../PushNotificationLayout";
import FastaExperience from "./FastaExperience";

const LandingPage = ({ configData, landingPageData }) => (
  <PushNotificationLayout>
    <FastaExperience
      configData={configData}
      landingPageData={landingPageData}
    />
    <NoSsr>
      <CookiesConsent text={configData?.cookies_text} />
    </NoSsr>
  </PushNotificationLayout>
);
export default LandingPage;
