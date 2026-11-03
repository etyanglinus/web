import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import HeroTitleSection from "./HeroTitleSection";
import DollarSignHighlighter from "components/DollarSignHighlighter";
import DeliveryIllustration from "./DeliveryIllustration";
import styles from "../FastaLanding.module.css";

const HeroSection = ({ landingPageDataheroSection }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <section className={styles.hero} aria-labelledby="fasta-hero-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.statusDot} />{t("YOUR NEIGHBOURHOOD. DELIVERED.")}</p>
          <h1 id="fasta-hero-title" className={styles.title}>
            {landingPageDataheroSection?.header_title ? <DollarSignHighlighter theme={theme} text={landingPageDataheroSection.header_title} /> : <>{t("A little less running.")}<br /><span>{t("A lot more living.")}</span></>}
          </h1>
          <p className={styles.description}>{landingPageDataheroSection?.header_sub_title || t("Your favourite meals, everyday essentials and local finds. Bring your neighbourhood to your doorstep with Fasta.")}</p>
          <a className={styles.primaryLink} href="#fasta-discover">{t("Find what you need")} <span aria-hidden="true">↗</span></a>
          <div className={styles.heroNote}><span aria-hidden="true">✳</span> {t("More time for the things you love.")}</div>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <DeliveryIllustration />
          <div className={styles.artLabel}><span className={styles.labelIcon}>↗</span><div><strong>{t("A local connection.")}</strong><span>{t("From their door to yours.")}</span></div></div>
          <span className={styles.artStamp}>FASTA<br />{t("ON THE MOVE")}</span>
        </div>
      </div>
      <div id="fasta-discover" className={styles.discover}>
        <div className={styles.discoverHeading}>
          <span className={styles.stepNumber}>01 /</span>
          <div><h2>{t("What’s happening around you?")}</h2><p>{landingPageDataheroSection?.header_tag_line || t("Set your delivery address to discover available services.")}</p></div>
          <span className={styles.discoverArrow} aria-hidden="true">↘</span>
        </div>
        <HeroTitleSection landingPageData={landingPageDataheroSection} />
      </div>
    </section>
  );
};
export default HeroSection;
