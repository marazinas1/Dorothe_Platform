import { useEffect, useRef, useState } from "react";
import { FileText, LayoutPanelTop, Rotate3d, Upload, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FLOORPLAN_TYPES, useListingFiles, type AdminDocType, type AdminDocument } from "@/lib/listings/use-listing-files";
import { FieldRow, FormSection } from "./FieldRow";
import { PlanServiceHint } from "./PlanServiceHint";

type Props = { listingId: string | null; ensureListingId: () => Promise<string> };

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

  const doc = (type: AdminDocType) => files.data?.documents.find((d) => d.type === type) ?? null;

  return (
    <FormSection icon={FileText} anchor="documents" title={t("admin.listings.sections.documents")}>
      <div className="grid gap-6 sm:grid-cols-2">
        {(["floorplan", "expose"] as const).map((type) => (
          <DocField key={type} type={type} doc={doc(type)} files={files}
            target={async () => listingId ?? (await ensureListingId())} onError={fail} />
        ))}
        <FieldRow className="sm:col-span-2" icon={Rotate3d} label={t("admin.listings.docs.tour")} help={t("admin.listings.docs.tourHelp")}>
          <Input type="url" inputMode="url" value={tour} placeholder="https://"
            onChange={(e) => setTour(e.target.value)} onBlur={() => void commitTour()} />
        </FieldRow>
        <PlanServiceHint />
      </div>
    </FormSection>
  );
}

function DocField({ type, doc, files, target, onError }: {
  type: AdminDocType;
  doc: AdminDocument | null;
  files: ReturnType<typeof useListingFiles>;
  target: () => Promise<string>;
  onError: (e: unknown) => void;
}) {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try { await files.upload(await target(), type, file); } catch (e) { onError(e); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }

  return (
    <FieldRow icon={type === "floorplan" ? LayoutPanelTop : FileText} label={t(`admin.listings.docs.${type}`)} help={t(`admin.listings.docs.${type}Help`)}>
      <div className="flex flex-wrap items-center gap-2">
        {doc ? <Badge variant="outline" className="max-w-[16rem] truncate">{doc.filename}</Badge> : null}
        <input ref={input} type="file" accept={type === "floorplan" ? FLOORPLAN_TYPES.join(",") : "application/pdf"} hidden onChange={(e) => void pick(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}>
          <Upload aria-hidden strokeWidth={1.75} className="size-4" />
          {busy ? t("admin.listings.docs.uploading") : t(doc ? "admin.listings.docs.replace" : type === "floorplan" ? "admin.listings.docs.uploadPlan" : "admin.listings.docs.upload")}
        </Button>
        {doc ? (
          <Button type="button" variant="ghost" size="sm" aria-label={t("admin.listings.docs.remove")} onClick={() => setConfirm(true)}>
            <Trash2 aria-hidden strokeWidth={1.75} className="size-4" />
          </Button>
        ) : null}
      </div>
      {doc && type === "expose" ? (
        <label className="mt-2 flex items-center gap-2 text-sm">
          <Switch checked={doc.requires_lead}
            onCheckedChange={(v) => void files.setRequiresLead(doc, v).catch(onError)} />
          {t("admin.listings.docs.afterEnquiry")}
        </label>
      ) : null}
      {doc ? (
        <ConfirmDialog open={confirm} onOpenChange={setConfirm}
          title={t("admin.listings.docs.removeTitle", { name: doc.filename })}
          description={t("admin.listings.docs.removeBody")}
          confirmLabel={t("admin.listings.docs.remove")}
          onConfirm={() => files.remove(doc).catch(onError)} />
      ) : null}
    </FieldRow>
  );
}
