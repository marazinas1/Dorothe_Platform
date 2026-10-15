import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

type Props = { url: string; page: number; label: string };

/** Renders one PDF page to an image in the browser (pdf.js loaded lazily). */
export function PdfPagePreview({ url, page, label }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = worker;
        const pdf = await pdfjs.getDocument({ url }).promise;
        if (page > pdf.numPages) {
          if (!cancelled) setState("missing");
          return;
        }
        const p = await pdf.getPage(page);
        const viewport = p.getViewport({ scale: 3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await p.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        if (!cancelled) {
          setSrc(canvas.toDataURL("image/png"));
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("missing");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url, page]);

  return (
    <figure className="space-y-2">
      <figcaption className="admin-label text-muted-foreground">{label}</figcaption>
      <div className="admin-media-frame aspect-[85/55] w-full bg-muted">
        {state === "ready" && src ? (
          <img src={src} alt={label} className="h-full w-full object-contain" />
        ) : state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
        ) : (
          <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
    </figure>
  );
}
