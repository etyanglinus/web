# BrandSite themes — version 1

Theme files use JSON and the `.brandsite.json` filename suffix. The Next.js React renderer is written in JavaScript/JSX with CSS; Laravel/PHP validates imported files. Sellers do not need to write React or PHP.

In My BrandSite, open the visual editor, expand **Import or export a theme**, download the example, edit it, then upload it. Save existing edits first. A successful import saves a private draft and updates the preview. Publish separately when ready. Export includes current editor settings, including unsaved edits.

The example in `public/brandsite/themes/starter.brandsite.json` documents every supported field. Version 1 supports title (120 characters), description (600 characters), six-digit hex accent, motion (`none`, `fade`, `rise`), and an ordered list containing `hero`, `catalog`, or both, without duplicates. Files must be at most 4 KB in the editor. Images/products remain tied to the receiving store. Unknown fields and unsupported versions are rejected by the server. Imported files cannot set store ownership, subscription, checkout, publication status or revision.

This is a settings-based theme format. Arbitrary HTML, CSS, JavaScript, PHP and ZIP theme packages are not supported. New section types require a renderer and a versioned schema update. Domain activation, billing and payments are separate features.

Verification: test import on an entitled staging store; verify draft preview changes while the published site stays unchanged; publish and check the storefront; try an invalid version, extra script field, duplicate sections and an expired session. Two open editors must produce a conflict when the older editor saves. No database migration is required for theme imports.
