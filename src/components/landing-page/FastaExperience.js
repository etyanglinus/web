import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import HeroTitleSection from "./hero-section/HeroTitleSection";
import AppLinks from "components/footer/footer-middle/AppLinks";
import { setAllData } from "redux/slices/storeRegistrationData";
import styles from "./FastaExperience.module.css";

export const plainText = (value = "") =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\$/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&bull;/g, "•")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
const enabled = (value) => Number(value) === 1;
export const usableAppLinks = (links) => ({
  play_store_link: links?.playstore_url,
  app_store_link: links?.apple_store_url,
  play_status:
    enabled(links?.playstore_url_status) &&
    /^https?:\/\//i.test(links?.playstore_url || "")
      ? 1
      : 0,
  app_status:
    enabled(links?.apple_store_url_status) &&
    /^https?:\/\//i.test(links?.apple_store_url || "")
      ? 1
      : 0,
});

const Picture = ({ src, alt, className, eager = false }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  ) : null;

export const OffersCarousel = ({ images = [] }) => {
  const slides = (Array.isArray(images) ? images : []).filter(
    (src) => typeof src === "string" && /^https?:\/\//i.test(src)
  );
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(true);
  const touchStart = useRef(null);
  const current = active % Math.max(1, slides.length);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing || interacting || !visible || slides.length < 2) return;
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % slides.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [playing, interacting, visible, slides.length]);
  if (!slides.length) return null;
  return (
    <section
      className={styles.offers}
      aria-label="Fasta offers"
      aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={(event) =>
        setInteracting(event.currentTarget.contains(document.activeElement))
      }
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setInteracting(event.currentTarget.matches(":hover"));
      }}
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.kicker}>A LITTLE SOMETHING FOR YOUR DAY</p>
          <h2>What’s on at Fasta</h2>
        </div>
        {slides.length > 1 && (
          <div className={styles.carouselControls}>
            <button
              type="button"
              aria-label="Previous offer"
              onClick={() =>
                setActive((current + slides.length - 1) % slides.length)
              }
            >
              ←
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause offers" : "Play offers"}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? "Ⅱ" : "▷"}
            </button>
            <button
              type="button"
              aria-label="Next offer"
              onClick={() => setActive((current + 1) % slides.length)}
            >
              →
            </button>
          </div>
        )}
      </div>
      <div
        className={styles.offerStage}
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
            setActive(
              (current + (dx < 0 ? 1 : slides.length - 1)) % slides.length
            );
        }}
      >
        {slides.map((src, index) => (
          <div
            className={`${styles.offerSlide} ${
              index === current ? styles.offerActive : ""
            }`}
            aria-hidden={index !== current}
            key={`${src}-${index}`}
          >
            <Picture
              src={src}
              alt={`Fasta promotion ${index + 1}`}
              eager={index === 0}
            />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className={styles.dots} aria-label="Choose an offer">
          {slides.map((src, index) => (
            <button
              type="button"
              key={`${src}-${index}`}
              aria-label={`Show offer ${index + 1} of ${slides.length}`}
              aria-pressed={index === current}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const PartnerSection = ({ data, configData }) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const seller = data?.seller_app_download_section;
  const delivery = data?.deliveryman_app_download_section;
  const rider = data?.rider_app_download_section;
  const panels = [
    enabled(seller?.download_seller_app_section_status) && {
      id: "business",
      label: "For businesses",
      title:
        seller?.download_seller_app_title ||
        "Your business. More possibilities.",
      text: seller?.download_seller_app_sub_title,
      image: seller?.download_seller_app_image_full_url,
      links: seller?.download_seller_app_links,
      cta:
        seller?.download_seller_app_content_button_title || "Become a partner",
      href: enabled(configData?.toggle_store_registration)
        ? "/store-registration?active=active"
        : null,
    },
    enabled(delivery?.download_deliveryman_app_section_status) && {
      id: "delivery",
      label: "For delivery partners",
      title: delivery?.download_dm_app_title || "Deliver with Fasta.",
      text: delivery?.download_dm_app_sub_title,
      image: delivery?.download_dm_app_image_full_url,
      links: delivery?.download_dm_app_links,
      cta: delivery?.download_dm_app_content_button_title || "Become a rider",
      href: enabled(configData?.toggle_dm_registration)
        ? "/deliveryman-registration"
        : null,
    },
    enabled(rider?.download_rider_app_section_status) && {
      id: "rider",
      label: "For riders",
      title: rider?.download_rider_app_title || rider?.download_dm_app_title,
      text:
        rider?.download_rider_app_sub_title || rider?.download_dm_app_sub_title,
      image:
        rider?.download_rider_app_image_full_url ||
        rider?.download_dm_app_image_full_url,
      links: rider?.download_rider_app_links || rider?.download_dm_app_links,
    },
  ].filter(Boolean);
  const selected = active < panels.length ? active : 0;
  const panel = panels[selected];
  if (!panel) return null;
  const links = usableAppLinks(panel.links);
  const handleKeys = (event, index) => {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % panels.length
        : event.key === "ArrowLeft"
        ? (index + panels.length - 1) % panels.length
        : event.key === "Home"
        ? 0
        : event.key === "End"
        ? panels.length - 1
        : null;
    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };
  return (
    <section
      className={styles.partner}
      id="fasta-partners"
      aria-labelledby="partner-heading"
    >
      <div className={styles.centerHeading}>
        <p className={styles.kicker}>LET’S GROW TOGETHER</p>
        <h2 id="partner-heading">There’s a place for you at Fasta.</h2>
        <p>Connect your business. Get on the road. Make your next move.</p>
      </div>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Partner opportunities"
      >
        {panels.map((item, index) => (
          <button
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            id={`partner-tab-${item.id}`}
            role="tab"
            aria-controls={`partner-panel-${item.id}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onKeyDown={(event) => handleKeys(event, index)}
            onClick={() => setActive(index)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.partnerPanels}>
        {panels.map((item, index) => (
          <div
            role="tabpanel"
            id={`partner-panel-${item.id}`}
            aria-labelledby={`partner-tab-${item.id}`}
            hidden={index !== selected}
            key={item.id}
            className={styles.partnerPanel}
          >
            <div className={styles.partnerPicture}>
              <Picture
                src={item.image}
                alt={
                  item.label === "For businesses"
                    ? "Fasta business partner"
                    : "Fasta delivery partner"
                }
              />
            </div>
            <div className={styles.partnerCopy}>
              <h3>{plainText(item.title)}</h3>
              <p>{plainText(item.text)}</p>
              {item.href && (
                <Link
                  className={styles.button}
                  href={item.href}
                  onClick={() => {
                    if (item.id === "business") dispatch(setAllData(null));
                  }}
                >
                  {plainText(item.cta)} <span aria-hidden="true">↗</span>
                </Link>
              )}
              {index === selected &&
                Boolean(links.play_status || links.app_status) && (
                  <div className={styles.partnerApps}>
                    <span>Already a partner? Get your app.</span>
                    <AppLinks align="flex-start" landingPageData={links} />
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FaqSection = ({ section }) => {
  const [category, setCategory] = useState("customer");
  const entries = [
    ...new Map(
      (section?.faq_list || [])
        .filter((item) => enabled(item.status))
        .map((item) => [
          `${item.user_type}:${plainText(item.question).toLowerCase()}`,
          item,
        ])
    ).values(),
  ];
  const groups = [
    { id: "customer", label: "Ordering" },
    { id: "vendor", label: "Businesses" },
    { id: "deliveryman", label: "Deliveries" },
  ].filter((group) => entries.some((item) => item.user_type === group.id));
  const selected = groups.some((group) => group.id === category)
    ? category
    : groups[0]?.id;
  if (!enabled(section?.faq_section_status) || !entries.length) return null;
  return (
    <section
      className={styles.faq}
      id="fasta-faq"
      aria-labelledby="faq-heading"
    >
      <div className={styles.centerHeading}>
        <p className={styles.kicker}>GOOD QUESTIONS. SIMPLE ANSWERS.</p>
        <h2 id="faq-heading">
          {plainText(section.faq_title) || "A little help before you start."}
        </h2>
      </div>
      <div className={styles.faqFilters} aria-label="Question categories">
        {groups.map((group) => (
          <button
            type="button"
            aria-pressed={selected === group.id}
            onClick={() => setCategory(group.id)}
            key={group.id}
          >
            {group.label}
          </button>
        ))}
      </div>
      <div className={styles.faqList} key={selected}>
        {entries
          .filter((item) => item.user_type === selected)
          .map((item) => (
            <details key={item.id}>
              <summary>
                {plainText(item.question)}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{plainText(item.answer)}</p>
            </details>
          ))}
      </div>
    </section>
  );
};

const FastaExperience = ({ configData, landingPageData: data }) => {
  const hero = data?.hero_section;
  const customerApp = data?.user_app_download_section;
  const appLinks = usableAppLinks(customerApp?.download_user_app_links);
  const zones = data?.available_zone_section;
  const heroImage = "/landingpage/fasta-everyday-hero.webp";
  const trust = enabled(data?.trust_section?.trust_section_status)
    ? (data.trust_section.cards || []).filter((card) => enabled(card.status))
    : [];
  const gallery = data?.gallery_section;
  return (
    <main className={styles.page} id="fasta-page-top">
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>YOUR EVERYDAY. DELIVERED.</p>
            <h1 id="hero-title">
              {plainText(hero?.header_title) ||
                "Your neighbourhood, delivered."}
            </h1>
            <p className={styles.heroDescription}>
              {plainText(hero?.header_sub_title) ||
                "Food, essentials and parcels. Discover what’s available near you."}
            </p>
            <div className={styles.address} id="fasta-discover">
              <h2>
                {plainText(hero?.pick_location_title) ||
                  "Where should we deliver?"}
              </h2>
              <HeroTitleSection landingPageData={hero} />
              <p>
                {plainText(hero?.header_tag_line) ||
                  "Enter your address to discover stores and services nearby."}
              </p>
            </div>
          </div>
          <div className={styles.heroPicture}>
            <div className={styles.heroCircle} />
            <Picture
              src={heroImage}
              alt="Fresh groceries, takeaway food and a parcel ready for Fasta delivery"
              eager
            />
            <span className={styles.heroPill}>
              <span aria-hidden="true">✓</span> From your local spots to your
              door
            </span>
          </div>
        </div>
      </section>
      {trust.length > 0 && (
        <section className={styles.trust} aria-label="Fasta in numbers">
          {trust.map((card, index) => (
            <div key={index}>
              <Picture src={card.image_full_url} alt="" />
              <div>
                <strong>{plainText(card.title)}</strong>
                <span>{plainText(card.sub_title)}</span>
              </div>
            </div>
          ))}
        </section>
      )}
      {enabled(
        data?.promotional_banner_section?.promotion_banner_section_status
      ) && (
        <OffersCarousel
          images={data.promotional_banner_section.promotion_banners_full_url}
        />
      )}
      <section className={styles.how}>
        <div className={styles.centerHeading}>
          <p className={styles.kicker}>FROM “I NEED IT” TO “IT’S HERE”</p>
          <h2>Getting started is simple.</h2>
        </div>
        <div className={styles.howGrid}>
          {[
            {
              n: "01",
              title: "Tell us where you are",
              text: "Set your delivery address to find what’s available in your area.",
              icon: "⌖",
            },
            {
              n: "02",
              title: "Find what you need",
              text: "Explore nearby stores and services, then place your order.",
              icon: "▤",
            },
            {
              n: "03",
              title: "We’ll take it from here",
              text: "Follow your order and get on with your day.",
              icon: "↗",
            },
          ].map((step) => (
            <div key={step.n}>
              <span className={styles.stepArt} aria-hidden="true">
                {step.icon}
              </span>
              <span className={styles.stepLabel}>STEP {step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <a className={styles.button} href="#fasta-discover">
          Explore near me <span aria-hidden="true">→</span>
        </a>
      </section>
      {enabled(zones?.available_zone_status) &&
        zones?.available_zone_list?.length > 0 && (
          <section className={styles.zones}>
            <div className={styles.centerHeading}>
              <p className={styles.kicker}>CLOSER THAN YOU THINK</p>
              <h2>
                {plainText(zones.available_zone_title) ||
                  "Find Fasta around you."}
              </h2>
              <p>
                Choose your delivery address to check the stores and services in
                your area.
              </p>
            </div>
            <div className={styles.zoneList}>
              {zones.available_zone_list.map((zone) => (
                <a href="#fasta-discover" key={zone.id}>
                  {zone.display_name || zone.name}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>
        )}
      {enabled(data?.popular_client_section?.popular_client_section_status) &&
        data.popular_client_section.cards?.length > 0 && (
          <section className={styles.clients}>
            <div className={styles.centerHeading}>
              <h2>
                {plainText(data.popular_client_section.popular_client_title)}
              </h2>
              <p>
                {plainText(
                  data.popular_client_section.popular_client_sub_title
                )}
              </p>
            </div>
            <div>
              {data.popular_client_section.cards.map((item, index) => (
                <Picture
                  src={item.image_full_url}
                  alt={`Partner ${index + 1}`}
                  key={index}
                />
              ))}
            </div>
          </section>
        )}
      {enabled(customerApp?.download_user_app_section_status) && (
        <section className={styles.app} id="fasta-app">
          <div className={styles.appPicture}>
            <Picture
              src={customerApp.download_user_app_image_full_url}
              alt="Fasta customer app on your phone"
            />
          </div>
          <div className={styles.appCopy}>
            <p className={styles.kicker}>FASTA, WHEREVER YOU ARE</p>
            <h2>
              {plainText(customerApp.download_user_app_title) ||
                "A simpler day starts with the app."}
            </h2>
            <p>{plainText(customerApp.download_user_app_sub_title)}</p>
            {Boolean(appLinks.play_status || appLinks.app_status) ? (
              <AppLinks align="flex-start" landingPageData={appLinks} />
            ) : (
              <a className={styles.button} href="#fasta-discover">
                Order on the website <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </section>
      )}
      <PartnerSection data={data} configData={configData} />
      {enabled(data?.highlight_section?.highlight_section_status) && (
        <section className={styles.highlight}>
          <Picture
            src={data.highlight_section.highlight_image_full_url}
            alt="Fasta delivery service"
          />
          <div>
            <p className={styles.kicker}>MADE FOR YOUR EVERYDAY</p>
            <h2>{plainText(data.highlight_section.highlight_title)}</h2>
            <p>{plainText(data.highlight_section.highlight_sub_title)}</p>
          </div>
        </section>
      )}
      {enabled(data?.banner_section?.banner_section_status) &&
        data.banner_section.banner_iamge_full_url && (
          <section className={styles.banner}>
            <Picture
              src={data.banner_section.banner_iamge_full_url}
              alt="Fasta delivery promotion"
            />
          </section>
        )}
      {enabled(gallery?.gallery_section_status) && (
        <section className={styles.gallery}>
          <div className={styles.centerHeading}>
            <h2>{plainText(gallery.gallery_content_title)}</h2>
            <p>{plainText(gallery.gallery_content_sub_title)}</p>
          </div>
          <div>
            {(gallery.cards || [])
              .filter((card) => enabled(card.status))
              .map((card, index) => (
                <Picture
                  src={card.image_full_url}
                  alt={`Fasta in action ${index + 1}`}
                  key={index}
                />
              ))}
          </div>
        </section>
      )}
      {enabled(data?.testimonial_section?.testimonial_section_status) &&
        data.testimonial_section.testimonial_list?.length > 0 && (
          <section className={styles.gallery}>
            <div className={styles.centerHeading}>
              <h2>{plainText(data.testimonial_section.testimonial_title)}</h2>
              <p>{plainText(data.testimonial_section.testimonial_sub_title)}</p>
            </div>
            <div>
              {data.testimonial_section.testimonial_list
                .filter((item) => enabled(item.status))
                .map((item) => (
                  <blockquote key={item.id}>
                    <Picture
                      src={item.reviewer_image_full_url}
                      alt={item.name || "Customer"}
                    />
                    <p>{plainText(item.review)}</p>
                    <cite>
                      {plainText(item.name)}
                      {item.designation
                        ? ` · ${plainText(item.designation)}`
                        : ""}
                    </cite>
                  </blockquote>
                ))}
            </div>
          </section>
        )}
      <FaqSection section={data?.faq_section} />
    </main>
  );
};
export default FastaExperience;
