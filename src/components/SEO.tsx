import { useEffect } from "react";

/**
 * Canonical hostname for ExpenseDesk's public surface (used in canonical URLs,
 * absolute OG/Twitter image references, and the sitemap). When the real
 * production domain is known, update this constant in one place.
 */
export const SITE_URL = "https://expensedesk.app";
export const SITE_NAME = "ExpenseDesk";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/social-card.svg`;
export const DEFAULT_OG_IMAGE_ALT =
  "ExpenseDesk dashboard preview with expense submissions, approvals, and reporting panels.";

type JsonLdValue = string | number | boolean | null | JsonLd | JsonLdValue[];
type JsonLd = { [key: string]: JsonLdValue };

type SEOProps = {
  title: string;
  description?: string;
  path?: string;
  /** When true, emits a robots meta tag of "noindex, nofollow". */
  noindex?: boolean;
  /**
   * Optional override for the OG/Twitter image URL. Should be an absolute
   * URL. Falls back to the site's social card.
   */
  image?: string;
  /** Optional alt text companion to {@link image}. */
  imageAlt?: string;
  /**
   * Optional JSON-LD payload (object or array) to inject as
   * <script type="application/ld+json"> in the head. The script is keyed
   * by a stable attribute so re-renders update the same element and
   * unmount removes it cleanly.
   */
  jsonLd?: JsonLd | JsonLd[];
};

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

/**
 * Builds the site-wide structured data graph (Organization + WebSite +
 * SoftwareApplication). Kept in sync with the inline JSON-LD block in
 * index.html — that copy is for JS-disabled crawlers, this copy is
 * available to per-page consumers that want to extend the graph.
 */
export function buildSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description:
          "Submit, approve, report, and analyze team expenses in one workspace.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "FinanceApplication",
        operatingSystem: "Web",
        description:
          "Expense management workspace for submissions, approvals, finance reporting, and AI-assisted expense analysis.",
        image: DEFAULT_OG_IMAGE,
        publisher: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}

/**
 * Convenience builder for a BreadcrumbList JSON-LD entry. Pass items in
 * crawl order (root first).
 */
export function buildBreadcrumbList(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * Tiny, dependency-free SEO helper. Updates document.title, description,
 * canonical URL, OG/Twitter mirrors, optional per-page image, optional
 * JSON-LD payload, and an optional noindex robots tag.
 *
 * Note: SITE_URL defaults to https://expensedesk.app. Replace with the real
 * production hostname when known.
 */
export function SEO({
  title,
  description,
  path = "/",
  noindex = false,
  image,
  imageAlt,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    upsertLink("canonical", url);

    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", SITE_NAME);

    const resolvedImage = image ?? DEFAULT_OG_IMAGE;
    upsertMeta("property", "og:image", resolvedImage);
    upsertMeta("name", "twitter:image", resolvedImage);
    const resolvedAlt = imageAlt ?? DEFAULT_OG_IMAGE_ALT;
    upsertMeta("property", "og:image:alt", resolvedAlt);
    upsertMeta("name", "twitter:image:alt", resolvedAlt);

    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );

    // Manage an optional per-page JSON-LD script. We tag it with a stable
    // data attribute so subsequent SEO mounts replace rather than stack.
    const JSON_LD_KEY = "expensedesk-page";
    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.head.querySelector<HTMLScriptElement>(
        `script[type="application/ld+json"][data-seo="${JSON_LD_KEY}"]`,
      );
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-seo", JSON_LD_KEY);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [title, description, path, noindex, image, imageAlt, jsonLd]);

  return null;
}

export default SEO;
