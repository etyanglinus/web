import { NoSsr } from "@mui/material";
import CookiesConsent from "../CookiesConsent";
import PushNotificationLayout from "../PushNotificationLayout";
import KenyaLanding from "./kenya/KenyaLanding";
import { isDemoText } from "./kenya/landingContent";

const LandingPage = ({ configData, landingPageData }) => (
  <PushNotificationLayout>
    <KenyaLanding configData={configData} landingPageData={landingPageData} />
    <NoSsr>
      <CookiesConsent
        text={
          isDemoText(configData?.cookies_text)
            ? "We use cookies to keep you signed in, remember your delivery location and improve Fasta. See our privacy policy for details."
            : configData?.cookies_text
        }
      />
    </NoSsr>
  </PushNotificationLayout>
);
export default LandingPage;
