import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./FastaLanding.module.css";

const steps = [
  { number: "01", title: "Make it local.", text: "Choose your address to see the stores and services available around you.", icon: "⌖" },
  { number: "02", title: "Find your favourite.", text: "Explore your options, choose what you need and place your order.", icon: "♡" },
  { number: "03", title: "Get on with your day.", text: "Follow your order in Fasta while we take care of the delivery.", icon: "↗" },
];
const FastaHowItWorks = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.how} aria-labelledby="fasta-how-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>{t("LESS TO DO. MORE TO ENJOY.")}</p><h2 id="fasta-how-title">{t("Your day, made easier.")}</h2></div>
        <Link href="/track-order" className={styles.textLink}>{t("Track an order")} <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={styles.steps}>{steps.map((step) => <article className={styles.step} key={step.number}>
        <div className={styles.stepTop}><span className={styles.stepIcon} aria-hidden="true">{step.icon}</span><span>{step.number} /</span></div>
        <h3>{t(step.title)}</h3><p>{t(step.text)}</p>
      </article>)}</div>
    </section>
  );
};
export default FastaHowItWorks;
