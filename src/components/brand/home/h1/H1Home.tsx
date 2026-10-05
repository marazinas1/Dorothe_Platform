import type { Step } from "@/components/brand/NumberedSteps";
import { SoldStrip } from "@/components/brand/SoldStrip";
import { HomeArticles } from "../HomeArticles";
import { useTranslation } from "react-i18next";

import { HomeListings } from "../HomeListings";
import { HomeTestimonials } from "../HomeTestimonials";
import type { HomeTemplateProps } from "../types";
import { HomeBroker } from "../HomeBroker";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import { H1Hero } from "./H1Hero";
import { H1Paths } from "./H1Paths";
import { H1Valuation } from "./H1Valuation";
import { H1SaleProcess } from "./H1SaleProcess";

/** Home order per the book: hero, paths, broker, listings, process, voices, valuation, sold, guides. */
export function H1Home(props: HomeTemplateProps) {
  const { t } = useTranslation();
  const { locale, settings, copy, featured, sold, hideSoldPrice, testimonials, posts } = props;
  const blogOn = useFeatureFlag("blog");
  const steps = t("home.sale_process_steps", { returnObjects: true }) as Step[];
  return (
    <>
      <H1Hero {...props} />
      <H1Paths {...props} />
      <HomeBroker {...props} />
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
      {blogOn && posts.length > 0 ? <HomeArticles locale={locale} posts={posts} /> : null}
    </>
  );
}
