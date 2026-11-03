import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setAllData } from "redux/slices/storeRegistrationData";
import Subscribe from "./footer-top/Subscribe";
import {
  Facebook,
  Instragram,
  LinkedIn,
  Pinterest,
  Twitter,
} from "./footer-middle/Icon";
import styles from "./FastaFooter.module.css";

const LocationViewOnMap = dynamic(
  () => import("../Map/location-view/LocationViewOnMap"),
  { ssr: false }
);
const icons = {
  facebook: Facebook,
  instagram: Instragram,
  linkedin: LinkedIn,
  pinterest: Pinterest,
  twitter: Twitter,
  x: Twitter,
};
const validUrl = (value) =>
  typeof value === "string" && /^https?:\/\//i.test(value);
export const getFooterAppLinks = (data) => {
  const links = data?.user_app_download_section?.download_user_app_links;
  return [
    {
      label: "Google Play",
      href: links?.playstore_url,
      enabled: links?.playstore_url_status,
    },
    {
      label: "App Store",
      href: links?.apple_store_url,
      enabled: links?.apple_store_url_status,
    },
  ].filter((link) => Number(link.enabled) === 1 && validUrl(link.href));
};
const FastaFooter = ({ configData, landingPageData, bottomSpace = 0 }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mapOpen, setMapOpen] = useState(false);
  const apps = getFooterAppLinks(landingPageData);
  const socials = (configData?.social_media || []).filter((item) =>
    validUrl(item.link)
  );
  const policies = [
    { label: "Terms", href: "/terms-and-conditions", show: true },
    { label: "Privacy", href: "/privacy-policy", show: true },
    {
      label: "Refunds",
      href: "/refund-policy",
      show: Number(configData?.refund_policy) !== 0,
    },
    {
      label: "Cancellations",
      href: "/cancellation-policy",
      show: Number(configData?.cancelation_policy) !== 0,
    },
    {
      label: "Shipping",
      href: "/shipping-policy",
      show: Number(configData?.shipping_policy) !== 0,
    },
  ].filter((item) => item.show);
  return (
    <div
      id="site-footer"
      className={styles.footer}
      style={{ "--footer-bottom-space": bottomSpace }}
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link
              href="/"
              aria-label={configData?.business_name || "Fasta Deliveries"}
            >
              {configData?.logo_full_url ? (
                <img
                  src={configData.logo_full_url}
                  alt={configData.business_name || "Fasta Deliveries"}
                  width="164"
                  height="55"
                  loading="lazy"
                />
              ) : (
                <strong>Fasta Deliveries</strong>
              )}
            </Link>
            <p>
              {landingPageData?.footer_section?.fixed_footer_description ||
                "Your everyday. Delivered."}
            </p>
            {socials.length > 0 && (
              <nav className={styles.socials} aria-label="Follow Fasta">
                {socials.map((item, index) => {
                  const Icon = icons[item.name?.toLowerCase()];
                  return (
                    <a
                      key={`${item.name}-${index}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Fasta on ${item.name}`}
                    >
                      {Icon ? <Icon /> : item.name}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
          <nav aria-label="Explore Fasta">
            <h2>Explore Fasta</h2>
            <Link
              href={
                router.pathname === "/" ? "#fasta-discover" : "/#fasta-discover"
              }
            >
              Order near you
            </Link>
            <Link href="/track-order">Track an order</Link>
            <Link href="/about-us">About us</Link>
          </nav>
          <nav aria-label="Partner with Fasta">
            <h2>Grow with us</h2>
            {Number(configData?.toggle_store_registration) === 1 && (
              <Link
                href="/store-registration?active=active"
                onClick={() => dispatch(setAllData(null))}
              >
                Register your business
              </Link>
            )}
            {Number(configData?.toggle_dm_registration) === 1 && (
              <Link href="/deliveryman-registration">
                Become a delivery partner
              </Link>
            )}
            {apps.map((app) => (
              <a
                key={app.label}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {app.label} ↗
              </a>
            ))}
          </nav>
          <div className={styles.help}>
            <h2>Here to help</h2>
            <Link href="/help-and-support">Help & support ↗</Link>
            {configData?.email && (
              <a href={`mailto:${configData.email}`}>{configData.email}</a>
            )}
            {configData?.phone && (
              <a href={`tel:${configData.phone}`} dir="ltr">
                {configData.phone}
              </a>
            )}
            {configData?.address && (
              <button type="button" onClick={() => setMapOpen(true)}>
                {configData.address} ↗
              </button>
            )}
          </div>
        </div>
        <details className={styles.newsletter}>
          <summary>
            {landingPageData?.footer_section?.fixed_newsletter_title ||
              "Stay updated"}
            <span aria-hidden="true">+</span>
          </summary>
          <div>
            <p>
              {landingPageData?.footer_section?.fixed_newsletter_sub_title ||
                "Subscribe for Fasta news and updates."}
            </p>
            <Subscribe />
          </div>
        </details>
        <div className={styles.bottom}>
          <p>{configData?.footer_text || "Fasta Deliveries"}</p>
          <nav aria-label="Policies">
            {policies.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {mapOpen && (
        <LocationViewOnMap
          open={mapOpen}
          handleClose={() => setMapOpen(false)}
          latitude={configData?.default_location?.lat}
          longitude={configData?.default_location?.lng}
          address={configData?.address}
          isFooter
        />
      )}
    </div>
  );
};
export default FastaFooter;
