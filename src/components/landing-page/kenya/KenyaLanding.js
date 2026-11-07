/**
 * Fasta landing page, designed for Kenya.
 *
 * Content comes from our own copy (landingContent.js), with admin-editable text used only when it
 * is real Fasta content: 6amMart demo text is ignored automatically. The only admin images used are
 * the promotional offers, so uploading real offers is the one thing to keep up to date.
 */
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import HeroTitleSection from "../hero-section/HeroTitleSection";
import AppLinks from "components/footer/footer-middle/AppLinks";
import { setAllData } from "redux/slices/storeRegistrationData";
import { OffersCarousel, usableAppLinks } from "../FastaExperience";
import Icon from "./Icon";
import {
  CATEGORIES,
  COPY,
  DEFAULT_FAQS,
  PAYMENTS,
  PROMISES,
  STEPS,
  formatKenyanPhone,
  isDemoText,
  isOwnUpload,
  kenyanWhatsApp,
  mergeFaqs,
  pick,
  plainText,
} from "./landingContent";
import styles from "./KenyaLanding.module.css";

const enabled = (v) => Number(v) === 1;

const Hero = ({ hero }) => (
  <section className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.heroInner}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>{COPY.heroKicker}</p>
        <h1 id="hero-title">{pick(hero?.header_title, COPY.heroTitle)}</h1>
        <p className={styles.lead}>{pick(hero?.header_sub_title, COPY.heroText)}</p>
        <div className={styles.locate} id="fasta-discover">
          <h2>{pick(hero?.pick_location_title, COPY.pickTitle)}</h2>
          <HeroTitleSection landingPageData={hero} />
          <p className={styles.locateHint}>
            <Icon name="pin" size={14} /> {pick(hero?.header_tag_line, COPY.pickHint)}
          </p>
        </div>
        <ul className={styles.heroChips} aria-label="Why customers use Fasta">
          <li><Icon name="phone" size={16} /> Pay with M-Pesa</li>
          <li><Icon name="route" size={16} /> Live tracking</li>
          <li><Icon name="tag" size={16} /> Prices in KSh</li>
        </ul>
      </div>
      <div className={styles.heroArt}>
        <div className={styles.heroBlob} aria-hidden="true" />
        <img
          src="/landingpage/fasta-everyday-hero.webp"
          alt="A shopping bag of fresh groceries, a takeaway meal and a parcel ready for delivery"
          width="520"
          height="520"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <div className={`${styles.floatCard} ${styles.floatTop}`} aria-hidden="true">
          <span className={styles.floatIcon}><Icon name="bike" size={20} /></span>
          <span><strong>Your rider is on the way</strong><small>Arriving in about 12 min</small></span>
        </div>
        <div className={`${styles.floatCard} ${styles.floatBottom}`} aria-hidden="true">
          <span className={`${styles.floatIcon} ${styles.floatMpesa}`}><Icon name="check" size={18} strokeWidth={2.4} /></span>
          <span><strong>M-Pesa payment received</strong><small>Order confirmed</small></span>
        </div>
      </div>
    </div>
  </section>
);

const SectionHead = ({ kicker, title, text, id, center = true }) => (
  <div className={center ? styles.headCenter : styles.head}>
    {kicker && <p className={styles.kicker}>{kicker}</p>}
    <h2 id={id}>{title}</h2>
    {text && <p className={styles.headText}>{text}</p>}
  </div>
);

const Categories = () => (
  <section className={styles.section} aria-labelledby="cat-title">
    <SectionHead kicker="ONE APP, EVERYDAY NEEDS" title="What can we bring you today?" id="cat-title" />
    <div className={styles.catGrid}>
      {CATEGORIES.map((c) => (
        <a className={styles.catCard} href="#fasta-discover" key={c.id}>
          <span className={styles.catIcon}><Icon name={c.icon} size={28} /></span>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
          <span className={styles.catLink}>Find near me <Icon name="arrow" size={16} /></span>
        </a>
      ))}
    </div>
  </section>
);

const HowItWorks = () => (
  <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="how-title">
    <SectionHead kicker="SIMPLE FROM START TO FINISH" title="How Fasta works" id="how-title" />
    <ol className={styles.steps}>
      {STEPS.map((s, i) => (
        <li key={s.title}>
          <span className={styles.stepNum}>{i + 1}</span>
          <span className={styles.stepIcon}><Icon name={s.icon} size={26} /></span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
    <div className={styles.centerCta}>
      <a className={styles.btn} href="#fasta-discover">Start your order <Icon name="arrow" size={18} /></a>
    </div>
  </section>
);

const Payments = () => (
  <section className={styles.section} aria-labelledby="pay-title">
    <div className={styles.payWrap}>
      <div className={styles.payCopy}>
        <p className={styles.kicker}>PAY YOUR WAY</p>
        <h2 id="pay-title">Pay the way you already do.</h2>
        <p className={styles.headText}>
          M-Pesa and card payments are processed securely by Paystack. You see the full amount in KSh,
          including delivery, before you confirm.
        </p>
        <p className={styles.secure}><Icon name="shield" size={18} /> Secure checkout. We never see your M-Pesa PIN or card details.</p>
      </div>
      <ul className={styles.payList}>
        {PAYMENTS.map((p) => (
          <li key={p.title}>
            <span className={styles.payIcon}><Icon name={p.icon} size={24} /></span>
            <span><strong>{p.title}</strong><small>{p.text}</small></span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const Promises = () => (
  <section className={`${styles.section} ${styles.dark}`} aria-labelledby="why-title">
    <SectionHead kicker="WHY FASTA" title="Built for how Kenya shops." id="why-title" />
    <div className={styles.promiseGrid}>
      {PROMISES.map((p) => (
        <div className={styles.promise} key={p.title}>
          <span className={styles.promiseIcon}><Icon name={p.icon} size={24} /></span>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </div>
      ))}
    </div>
  </section>
);

const Areas = ({ zones }) => {
  const list = enabled(zones?.available_zone_status) && Array.isArray(zones?.available_zone_list) ? zones.available_zone_list : [];
  return (
    <section className={styles.section} aria-labelledby="area-title">
      <div className={styles.areaCard}>
        <div>
          <p className={styles.kicker}>WHERE WE DELIVER</p>
          <h2 id="area-title">{list.length ? "Delivering near you" : "Growing across Nairobi"}</h2>
          <p className={styles.headText}>
            {list.length
              ? "Fasta delivers in these areas, with more neighbourhoods added regularly. Enter your location to see the stores that deliver to you."
              : "We’re adding new neighbourhoods all the time. Enter your location to see the stores that already deliver to you."}
          </p>
          <a className={styles.btn} href="#fasta-discover">Check my area <Icon name="pin" size={18} /></a>
        </div>
        {list.length > 0 && (
          <ul className={styles.areaList}>
            {list.map((z) => (
              <li key={z.id}><Icon name="pin" size={14} /> {plainText(z.display_name || z.name)}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

const Partners = ({ data, configData }) => {
  const dispatch = useDispatch();
  const seller = data?.seller_app_download_section;
  const dm = data?.deliveryman_app_download_section;
  const cards = [
    {
      id: "business",
      icon: "store",
      kicker: "FOR BUSINESSES",
      title: pick(seller?.download_seller_app_title, "Sell to more customers near you."),
      text: pick(seller?.download_seller_app_sub_title, "List your shop, restaurant or pharmacy on Fasta. We bring you orders and delivery; you focus on your customers."),
      points: ["Your own online store, free to set up", "Orders, payouts and reports in one app", "Riders handle the delivery"],
      cta: "Register your business",
      href: enabled(configData?.toggle_store_registration) ? "/store-registration?active=active" : null,
      links: usableAppLinks(seller?.download_seller_app_links),
    },
    {
      id: "rider",
      icon: "bike",
      kicker: "FOR RIDERS",
      title: pick(dm?.download_dm_app_title, "Earn with every delivery."),
      text: pick(dm?.download_dm_app_sub_title, "Deliver with your motorbike, bicycle or car on your own schedule, close to where you live."),
      points: ["Choose when you work", "See your earnings in the app", "Get paid regularly"],
      cta: "Become a rider",
      href: enabled(configData?.toggle_dm_registration) ? "/deliveryman-registration" : null,
      links: usableAppLinks(dm?.download_dm_app_links),
    },
  ];
  return (
    <section className={`${styles.section} ${styles.tinted}`} id="fasta-partners" aria-labelledby="partner-title">
      <SectionHead kicker="GROW WITH FASTA" title="Partner with us" id="partner-title" />
      <div className={styles.partnerGrid}>
        {cards.map((c) => (
          <article className={styles.partner} key={c.id}>
            <span className={styles.partnerIcon}><Icon name={c.icon} size={28} /></span>
            <p className={styles.kicker}>{c.kicker}</p>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <ul>
              {c.points.map((pt) => (
                <li key={pt}><Icon name="check" size={16} strokeWidth={2.2} /> {pt}</li>
              ))}
            </ul>
            <div className={styles.partnerActions}>
              {c.href && (
                <Link className={styles.btn} href={c.href} onClick={() => c.id === "business" && dispatch(setAllData(null))}>
                  {c.cta} <Icon name="arrow" size={18} />
                </Link>
              )}
              {Boolean(c.links.play_status || c.links.app_status) && (
                <div className={styles.partnerApps}>
                  <small>Already a partner? Get the app:</small>
                  <AppLinks align="flex-start" landingPageData={c.links} />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const AppBand = ({ section }) => {
  const links = usableAppLinks(section?.download_user_app_links);
  const hasApp = Boolean(links.play_status || links.app_status);
  return (
    <section className={styles.section} aria-labelledby="app-title">
      <div className={styles.appBand}>
        <div>
          <p className={styles.kickerLight}>FASTA ON YOUR PHONE</p>
          <h2 id="app-title">{hasApp ? "Order faster with the Fasta app." : "Order from any phone, no download needed."}</h2>
          <p>
            {hasApp
              ? "Save your addresses, reorder favourites in a tap and get live updates on every delivery."
              : "Fasta works in your phone’s browser. Save it to your home screen for one-tap ordering."}
          </p>
          {hasApp ? (
            <AppLinks align="flex-start" landingPageData={links} />
          ) : (
            <a className={styles.btnLight} href="#fasta-discover">Start ordering <Icon name="arrow" size={18} /></a>
          )}
        </div>
        <div className={styles.phoneArt} aria-hidden="true">
          <div className={styles.phone}>
            <div className={styles.phoneBar} />
            <div className={styles.phoneRow}><Icon name="basket" size={18} /> <span>Groceries</span></div>
            <div className={styles.phoneRow}><Icon name="bowl" size={18} /> <span>Restaurants</span></div>
            <div className={styles.phoneRow}><Icon name="pill" size={18} /> <span>Pharmacy</span></div>
            <div className={styles.phoneTotal}><span>Total</span><strong>KSh 1,250</strong></div>
            <div className={styles.phonePay}>Pay with M-Pesa</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Faq = ({ section }) => {
  const fromAdmin = enabled(section?.faq_section_status)
    ? (section?.faq_list || []).filter((f) => enabled(f.status) && !isDemoText(f.question) && !isDemoText(f.answer))
    : [];
  const faqs = mergeFaqs(fromAdmin, DEFAULT_FAQS);
  const groups = [
    { id: "customer", label: "Ordering" },
    { id: "vendor", label: "Businesses" },
    { id: "deliveryman", label: "Riders" },
  ].filter((g) => faqs.some((f) => f.user_type === g.id));
  const [tab, setTab] = useState(groups[0]?.id || "customer");
  return (
    <section className={styles.section} id="fasta-faq" aria-labelledby="faq-title">
      <SectionHead kicker="QUESTIONS" title="Good to know" id="faq-title" />
      {groups.length > 1 && (
        <div className={styles.faqTabs} role="group" aria-label="Question categories">
          {groups.map((g) => (
            <button type="button" key={g.id} aria-pressed={tab === g.id} onClick={() => setTab(g.id)}>{g.label}</button>
          ))}
        </div>
      )}
      <div className={styles.faqList}>
        {faqs.filter((f) => f.user_type === tab).map((f) => (
          <details key={f.id}>
            <summary>{plainText(f.question)}<span aria-hidden="true" /></summary>
            <p>{plainText(f.answer)}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

const Support = ({ configData }) => {
  const wa = kenyanWhatsApp(configData?.phone);
  const email = /@/.test(configData?.email || "") && !/admin@admin\.com/i.test(configData.email) ? configData.email : null;
  return (
    <section className={styles.section} aria-labelledby="help-title">
      <div className={styles.help}>
        <div>
          <h2 id="help-title">Need a hand?</h2>
          <p>Our team is here to help with orders, payments and partnerships.</p>
        </div>
        <div className={styles.helpActions}>
          {wa && (
            <a className={styles.btn} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} /> WhatsApp {formatKenyanPhone(configData.phone)}
            </a>
          )}
          {email && <a className={styles.btnGhost} href={`mailto:${email}`}>{email}</a>}
          <Link className={styles.btnGhost} href="/help-and-support">Help & support</Link>
        </div>
      </div>
    </section>
  );
};

const KenyaLanding = ({ configData, landingPageData: data }) => {
  const promos = data?.promotional_banner_section;
  const offers = (promos?.promotion_banners_full_url || []).filter(isOwnUpload);
  return (
    <main className={styles.page} id="fasta-page-top">
      <Hero hero={data?.hero_section} />
      <Categories />
      {enabled(promos?.promotion_banner_section_status) && offers.length > 0 && (
        <div className={styles.offers}>
          <OffersCarousel images={offers} />
        </div>
      )}
      <HowItWorks />
      <Payments />
      <Promises />
      <Areas zones={data?.available_zone_section} />
      <Partners data={data} configData={configData} />
      <AppBand section={data?.user_app_download_section} />
      <Faq section={data?.faq_section} />
      <Support configData={configData} />
    </main>
  );
};

export default KenyaLanding;
