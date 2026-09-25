import { useTranslation } from "react-i18next";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { pageMediaPath } from "@/lib/branding/media-paths";
import { siteSettingsQueryOptions, updateSiteSettings } from "@/lib/config/site-settings.functions";
import { setMediaDefault } from "@/lib/media/media-defaults.functions";
import { MEDIA_SLOTS, resolveMedia, type MediaSlotKey } from "@/lib/media/slots";

import { MediaSlotCard } from "./MediaSlotCard";

type Props = {
  slotKey: MediaSlotKey;
  /** Unsaved owner choice held by a surrounding form, if any. */
  chosen?: string | null;
  /** Hand the owner choice to a surrounding form instead of saving directly. */
  onChoose?: (url: string | null) => void;
};

/** A catalogue photograph wired to its storage, save and studio default. */
export function SiteMediaSlot({ slotKey, chosen, onChoose }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: settings } = useSuspenseQuery(siteSettingsQueryOptions);
  const def = MEDIA_SLOTS[slotKey];
  const media = resolveMedia(settings, slotKey, chosen !== undefined ? { chosen } : {});
  const refresh = () => qc.invalidateQueries({ queryKey: siteSettingsQueryOptions.queryKey });

  async function choose(url: string | null) {
    if (onChoose) return onChoose(url);
    if (slotKey === "about:portrait") {
      await updateSiteSettings({ data: { tab: "agent_portrait", values: { primary_agent_photo_url: url } } });
      await refresh();
    }
  }

  return (
    <MediaSlotCard
      label={t(`admin.media.slots.${def.page}_${def.slot}.label`)}
      help={t(`admin.media.slots.${def.page}_${def.slot}.help`)}
      aspect={def.aspect}
      media={media}
      uploadPath={pageMediaPath(def.page, def.slot)}
      studioPath={pageMediaPath(`${def.page}-default`, def.slot)}
      onChoose={choose}
      onStudio={async (url) => {
        await setMediaDefault({ data: { key: slotKey, url } });
        await refresh();
      }}
    />
  );
}
