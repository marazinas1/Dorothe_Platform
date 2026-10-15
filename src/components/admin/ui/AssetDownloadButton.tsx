import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/download";

/** Download any stored asset (photo, cover, logo) under a readable name. */
export function AssetDownloadButton({ url, name }: { url: string; name: string }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const clean = url.split("?")[0] ?? url;
      const ext = clean.match(/\.(\w{3,4})$/)?.[1] ?? "webp";
      await downloadFile(url, `${name}.${ext}`);
    } catch {
      toast.error(t("admin.settings.brand.downloadError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void run()}>
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      {t("admin.settings.brand.download")}
    </Button>
  );
}
