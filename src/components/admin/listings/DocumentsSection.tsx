import { useEffect, useRef, useState } from "react";
import { FileText, LayoutPanelTop, Rotate3d, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FLOORPLAN_TYPES, useListingFiles, type AdminDocType, type AdminDocument } from "@/lib/listings/use-listing-files";
import { DocumentItem } from "./DocumentItem";
import { FieldRow, FormSection } from "./FieldRow";
import { PlanServiceHint } from "./PlanServiceHint";
import { FloorLevelPicker } from "./FloorLevelPicker";

type Props = { listingId: string | null; ensureListingId: (opts?: { open?: boolean }) => Promise<string> };

/** Floor plan PDF, full exposé and the 360° tour link (broker-admin.html). */
export function DocumentsSection({ listingId, ensureListingId }: Props) {
  const { t } = useTranslation();
  const files = useListingFiles(listingId);
  const [tour, setTour] = useState("");
  const savedTour = files.data?.tour?.url ?? "";
  useEffect(() => setTour(savedTour), [savedTour]);

  const fail = (e: unknown) => {
    const m = e instanceof Error ? e.message : String(e);
    toast.error(["not_pdf", "not_plan", "too_large"].includes(m) ? t(`admin.listings.docs.${m}`) : m);
  };

  async function commitTour() {
    if (tour.trim() === savedTour) return;
    if (tour.trim() && !/^https:\/\/\S+$/.test(tour.trim())) {
      toast.error(t("admin.listings.docs.tourInvalid"));
      return;
    }
    try {
      await files.saveTour(listingId ?? (await ensureListingId()), tour);
      toast.success(t("admin.listings.saved"));
    } catch (e) { fail(e); }
  }

  const docs = (type: AdminDocType) => files.data?.documents.filter((d) => d.type === type) ?? [];

  return (
    <FormSection icon={FileText} anchor="documents" title={t("admin.listings.sections.documents")}>
      <div className="grid gap-6 sm:grid-cols-2">
        {(["floorplan", "expose"] as const).map((type) => (
          <DocField key={type} type={type} docs={docs(type)} files={files}
            target={async () => listingId ?? (await ensureListingId())} onError={fail} />
        ))}
        <FieldRow className="sm:col-span-2" icon={Rotate3d} label={t("admin.listings.docs.tour")} help={t("admin.listings.docs.tourHelp")}>
          <Input type="url" inputMode="url" value={tour} placeholder="https://"
            onChange={(e) => setTour(e.target.value)} onBlur={() => void commitTour()} />
        </FieldRow>
        {docs("floorplan").length === 0 ? <PlanServiceHint /> : null}
      </div>
    </FormSection>
  );
}

function DocField({ type, docs, files, target, onError }: {
  type: AdminDocType;
  docs: AdminDocument[];
  files: ReturnType<typeof useListingFiles>;
  target: () => Promise<string>;
  onError: (e: unknown) => void;
}) {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<AdminDocument | null>(null);
  const multi = type === "floorplan";

  async function pick(list: FileList | null) {
    const picked = list ? Array.from(list) : [];
    if (picked.length === 0) return;
    setBusy(true);
    try {
      const id = await target();
      for (const file of picked) await files.upload(id, type, file);
    } catch (e) { onError(e); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }

  const single = docs[0] ?? null;
  const label = busy ? "uploading" : multi ? (docs.length ? "addPlan" : "uploadPlan") : single ? "replace" : "upload";

  return (
    <FieldRow icon={multi ? LayoutPanelTop : FileText} label={t(`admin.listings.docs.${type}`)} help={t(`admin.listings.docs.${type}Help`)}>
      {docs.length ? (
        <ul className="mb-2 space-y-2">
          {docs.map((d) => (
            <DocumentItem key={d.id} doc={d} onRemove={() => setConfirm(d)}>
              {multi ? (
                <FloorLevelPicker value={d.label} name={d.filename}
                  onSave={(v) => void files.setLabel(d, v).then(() => toast.success(t("admin.listings.saved"))).catch(onError)} />
              ) : null}
            </DocumentItem>
          ))}
        </ul>
      ) : null}
      <input ref={input} type="file" multiple={multi} accept={multi ? FLOORPLAN_TYPES.join(",") : "application/pdf"} hidden onChange={(e) => void pick(e.target.files)} />
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}>
        <Upload aria-hidden strokeWidth={1.75} className="size-4" />
        {t(`admin.listings.docs.${label}`)}
      </Button>
      {single && type === "expose" ? (
        <label className="mt-2 flex items-center gap-2 text-sm">
          <Switch checked={single.requires_lead}
            onCheckedChange={(v) => void files.setRequiresLead(single, v).catch(onError)} />
          {t("admin.listings.docs.afterEnquiry")}
        </label>
      ) : null}
      {confirm ? (
        <ConfirmDialog open onOpenChange={(o) => !o && setConfirm(null)}
          title={t("admin.listings.docs.removeTitle", { name: confirm.filename })}
          description={t("admin.listings.docs.removeBody")}
          confirmLabel={t("admin.listings.docs.remove")}
          onConfirm={() => files.remove(confirm).catch(onError)} />
      ) : null}
    </FieldRow>
  );
}
