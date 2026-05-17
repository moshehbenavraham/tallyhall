import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import {
  SEO,
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  buildSiteJsonLd,
  buildBreadcrumbList,
} from "@/components/SEO";

function metaContent(selector: string) {
  return document.head.querySelector<HTMLMetaElement>(selector)?.getAttribute("content") ?? null;
}

function linkHref(rel: string) {
  return document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)?.getAttribute("href") ?? null;
}

describe("SEO", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    cleanup();
  });

  it("sets document.title with the site name suffix when omitted", () => {
    render(<SEO title="Sign in" description="Login page" path="/login" />);
    expect(document.title).toBe(`Sign in — ${SITE_NAME}`);
  });

  it("preserves a title that already includes the site name", () => {
    const explicit = `${SITE_NAME} — Expense management for modern teams`;
    render(<SEO title={explicit} path="/" />);
    expect(document.title).toBe(explicit);
  });

  it("upserts canonical, description, OG and Twitter mirrors with absolute URLs", () => {
    render(
      <SEO
        title="Sign up"
        description="Create an ExpenseDesk account"
        path="/signup"
      />,
    );

    expect(linkHref("canonical")).toBe(`${SITE_URL}/signup`);
    expect(metaContent('meta[name="description"]')).toBe("Create an ExpenseDesk account");
    expect(metaContent('meta[property="og:url"]')).toBe(`${SITE_URL}/signup`);
    expect(metaContent('meta[property="og:image"]')).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent('meta[name="twitter:image"]')).toBe(DEFAULT_OG_IMAGE);
    expect(metaContent('meta[property="og:image:alt"]')).toMatch(/ExpenseDesk/);
  });

  it("emits noindex robots when requested", () => {
    render(<SEO title="Page not found" path="/missing" noindex />);
    expect(metaContent('meta[name="robots"]')).toBe("noindex, nofollow");
  });

  it("injects per-page JSON-LD and removes it on unmount", () => {
    const { unmount } = render(
      <SEO
        title="Sign in"
        path="/login"
        jsonLd={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Sign in", path: "/login" },
        ])}
      />,
    );

    const script = document.head.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"][data-seo="expensedesk-page"]',
    );
    expect(script).not.toBeNull();
    const payload = JSON.parse(script!.textContent || "{}");
    expect(payload["@type"]).toBe("BreadcrumbList");
    expect(payload.itemListElement).toHaveLength(2);
    expect(payload.itemListElement[1].item).toBe(`${SITE_URL}/login`);

    unmount();
    expect(
      document.head.querySelector(
        'script[type="application/ld+json"][data-seo="expensedesk-page"]',
      ),
    ).toBeNull();
  });

  it("builds a site-wide JSON-LD graph with Organization, WebSite and SoftwareApplication", () => {
    const graph = buildSiteJsonLd();
    expect(graph["@context"]).toBe("https://schema.org");
    const nodes = graph["@graph"] as Array<{ "@type": string }>;
    const types = nodes.map(n => n["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["Organization", "WebSite", "SoftwareApplication"]),
    );
  });
});
