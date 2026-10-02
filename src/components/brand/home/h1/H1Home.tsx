import type { Step } from "@/components/brand/NumberedSteps";
import { SoldStrip } from "@/components/brand/SoldStrip";
import { HomeArticles } from "../HomeArticles";
import { useTranslation } from "react-i18next";

import { HomeListings } from "../HomeListings";
import { HomeTestimonials } from "../HomeTestimonials";
import type { HomeTemplateProps } from "../types";
import { H1Credentials } from "./H1Credentials";
import { H1Hero } from "./H1Hero";
import { H1Paths } from "./H1Paths";
import { H1Valuation } from "./H1Valuation";
import { H1SaleProcess } from "./H1SaleProcess";

/**
 * Design H1 — "direct": amber, ink and paper. Claim first, then the split,
 * qualification, client voices, and only then the properties.
 */
export function H1Home(props: HomeTemplateProps) {
  const { t } = useTranslation();
  const { locale, settings, copy, featured, sold, hideSoldPrice, testimonials, posts } = props;
  const steps = (t("pages.selling.steps", { returnObjects: true }) as Step[]).slice(0, 4);
  return (
    <>
      <H1Hero {...props} />
      <H1Paths {...props} />
      <H1Credentials {...props} />
      <HomeListings
        locale={locale}
        settings={settings}
        items={featured}
        title={copy.text("listings_title")}
        note={copy.text("listings_note")}
      />
      <H1SaleProcess locale={locale} steps={steps} />
      <HomeTestimonials items={testimonials} title={copy.text("testi_title")} locale={locale} tone="paper" />
      <H1Valuation {...props} />
      <SoldStrip locale={locale} items={sold} settings={settings} hidePrice={hideSoldPrice} />
      <HomeArticles locale={locale} posts={posts} />
    </>
  );
}
