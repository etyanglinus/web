# BrandSite custom domain ingress

Use a dedicated public IPv4 ingress running the supplied Caddy configuration. Bind Next.js to loopback on port 3017 or adapt the private upstream addresses. Keep Next.js and the Caddy permission endpoint off the public ingress. Use the marketplace's canonical HTTPS URL for `BRANDSITE_WEB_ORIGIN` and configure `NEXT_PUBLIC_BASE_URL` with the Admin API origin.

- Set the same random secret of at least 32 characters as `BRANDSITE_INGRESS_SECRET` in Caddy, Next.js and Admin. Keep it out of client bundles and logs.
- Set `BRANDSITE_INGRESS_HOST` and `BRANDSITE_INGRESS_IP` in Admin. The ingress hostname must have one public IPv4 address matching that IP. This setup supports seller subdomains with direct CNAME records.
- Apply the BrandSite domain activation migration and run Laravel's scheduler every minute. Its hourly task rechecks DNS ownership and routing. The lookup refuses routes whose DNS check is over 48 hours old.
- Open ports 80 and 443 on the dedicated ingress and give Caddy persistent certificate storage. Validate the Caddy configuration and verify certificate issuance with a staging domain before production rollout.

The seller publishes their site, adds a hostname, sets the displayed TXT and CNAME records, then selects **Verify DNS and check HTTPS**. The check connects to the configured ingress IP with the seller hostname and validates the certificate and a signed response. Successful checks activate the hostname. Removing the domain or suspending its site blocks storefront routing. Caddy consults the permission endpoint before issuing a new certificate on demand.
