import type { ReactElement } from "react";

import { applies } from "@/lib/listings/field-visibility";
import type { ListingFormApi } from "./listing-form-state";
import type { ImageRecord } from "./ImageCard";
import { BasicsSection } from "./BasicsSection";
import { ChecklistRail } from "./ChecklistRail";
import { EnergySection } from "./EnergySection";
import { EquipmentSection } from "./EquipmentSection";
import { FiguresSection } from "./FiguresSection";
import { SectionStep } from "./FieldRow";
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
  ].filter((node): node is ReactElement => node !== null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-6">
        {sections.map((node, index) => (
          <SectionStep key={node.key} value={index + 1}>{node}</SectionStep>
        ))}
      </div>
      <ChecklistRail checklist={props.checklist} />
    </div>
  );
}