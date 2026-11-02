/**
 * Single source of truth for which login options the config API has enabled.
 *
 * The trap this exists to close: `configData.social_login` / `apple_login` are
 * provider *catalogues* — the backend ships them with `status: true` whatever
 * the admin panel says. What actually turns a provider on is the matching flag
 * in `configData.centralize_login`. Deciding visibility from the array length
 * alone renders a "Continue With" heading and an OR divider above zero buttons.
 */

interface SocialLoginItem {
  login_medium?: string;
  status?: boolean;
  [key: string]: unknown;
}

interface CentralizeLogin {
  manual_login_status?: number;
  otp_login_status?: number;
  social_login_status?: number;
  google_login_status?: number;
  facebook_login_status?: number;
  apple_login_status?: number;
  [key: string]: unknown;
}

interface ConfigDataLike {
  centralize_login?: CentralizeLogin | null;
  social_login?: SocialLoginItem[] | null;
  apple_login?: SocialLoginItem[] | null;
  guest_checkout_status?: number | null;
  [key: string]: unknown;
}

/**
 * The social providers that will actually render a button, each merged with the
 * centralize_login flags the way the button components expect to receive them.
 *
 * Note: the per-provider flags are the gate, not the `social_login_status`
 * master flag — that mirrors the rule this was extracted from, so installs
 * where the master flag lags behind the per-provider ones keep working.
 */
export const getEnabledSocialLogins = (
  configData?: ConfigDataLike | null,
): SocialLoginItem[] => {
  const centralize = configData?.centralize_login;

  return [...(configData?.social_login ?? []), ...(configData?.apple_login ?? [])]
    .map((item) => ({ ...item, ...(centralize ?? {}) }))
    .filter((item) => {
      if (item?.login_medium === "google") {
        return item?.status === true && centralize?.google_login_status === 1;
      }
      if (item?.login_medium === "facebook") {
        return item?.status === true && centralize?.facebook_login_status === 1;
      }
      if (item?.login_medium === "apple") {
        return item?.status === true && centralize?.apple_login_status === 1;
      }
      return true;
    });
};

export const hasEnabledSocialLogins = (
  configData?: ConfigDataLike | null,
): boolean => getEnabledSocialLogins(configData).length > 0;

export const isManualLoginEnabled = (
  configData?: ConfigDataLike | null,
): boolean => configData?.centralize_login?.manual_login_status === 1;

export const isOtpLoginEnabled = (
  configData?: ConfigDataLike | null,
): boolean => configData?.centralize_login?.otp_login_status === 1;

export const isGuestCheckoutEnabled = (
  configData?: ConfigDataLike | null,
): boolean => configData?.guest_checkout_status === 1;
