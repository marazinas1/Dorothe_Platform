import type { ReactElement } from "react";

import { applies } from "@/lib/listings/field-visibility";
import type { ListingFormApi } from "./listing-form-state";
import type { ImageRecord } from "./ImageCard";
import { BasicsSection } from "./BasicsSection";
import { ChecklistRail } from "./ChecklistRail";
import { EnergySection } from "./EnergySection";
import { EquipmentSection } from "./EquipmentSection";
import { FiguresSection } from "./FiguresSection";
import { useTranslation } from "react-i18next";
import { SectionNav, sectionAnchorId } from "./SectionNav";
import { DocumentsSection } from "./DocumentsSection";
import { ImageManager } from "./ImageManager";
import { LocationSection } from "./LocationSection";
import { MoreDetailsSection } from "./MoreDetailsSection";
import { TranslatableBlock } from "./TranslatableBlock";

type Props = {
  form: ListingFormApi;
  lang: string;
  locales: string[];
  primaryLocale: string;
  listingId: string | null;
  navLocale: string;
  publishedEver: boolean;
  images: ImageRecord[];
  checklist: ReturnType<typeof import("@/lib/listings/publish-checklist").buildPublishChecklist>;
  setLang: (locale: string) => void;
  ensureListingId: () => Promise<string>;
  refreshListing: () => void;
  onError: (message: string) => void;
};

export function ListingEditorSections(props: Props) {
  const { t } = useTranslation();
  const shape = {
    property_type: props.form.values.property_type,
    deal_type: props.form.values.deal_type,
  };
  const sections = [
    <BasicsSection key="basics" form={props.form} />,
    <FiguresSection key="figures" form={props.form} />,
    <LocationSection key="location" form={props.form} />,
    <EquipmentSection key="equipment" form={props.form} />,
    <TranslatableBlock
      key="texts"
      form={props.form}
      lang={props.lang}
      locales={props.locales}
      primaryLocale={props.primaryLocale}
      onLangChange={props.setLang}
      listingId={props.listingId}
      publicLocale={props.navLocale}
      onError={props.onError}
    />,
    applies(shape, "energy") ? <EnergySection key="energy" form={props.form} /> : null,
    <MoreDetailsSection
      key="more"
      form={props.form}
      lang={props.lang}
      publishedEver={props.publishedEver}
    />,
    <ImageManager
      key="images"
      listingId={props.listingId}
      images={props.images}
      refresh={props.refreshListing}
      ensureListingId={props.ensureListingId}
    />,
    <DocumentsSection
      key="documents"
      listingId={props.listingId}
      ensureListingId={props.ensureListingId}
    />,
  ].filter((node): node is ReactElement => node !== null);

  const labelKey: Record<string, string> = {
    basics: "basics",
    figures: "figures",
    location: "location",
    equipment: "equipment",
    texts: "translated",
    energy: "energy",
    more: "more",
    images: "images",
    documents: "documents",
  };
  const nav = sections.map((node) => ({
    key: String(node.key),
    label: t(`admin.listings.sections.${labelKey[String(node.key)]}`),
  }));

  return (
    <div className="w-full min-w-0 space-y-6">
      <ChecklistRail checklist={props.checklist} />
      <SectionNav sections={nav} />
      {sections.map((node) => (
        <div key={node.key} id={sectionAnchorId(String(node.key))} className="scroll-mt-32">
          {node}
        </div>
      ))}
    </div>
  );
}