import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/admin/settings/SaveButton";
import { pickLocalized } from "@/lib/listings/format";
import {
  APPOINTMENT_KINDS,
  APPOINTMENT_STATUSES,
  shortTime,
  type AppointmentRow,
} from "@/lib/calendar/types";

export interface AppointmentDraft {
  id?: string;
  day: string;
  start_time: string;
  end_time: string;
  kind: string;
  status: string;
  listing_id: string;
  client_name: string;
  client_phone: string;
  location: string;
  note: string;
}

export function toAppointmentDraft(day: string, row?: AppointmentRow): AppointmentDraft {
  return {
    id: row?.id,
    day: row?.day ?? day,
    start_time: shortTime(row?.start_time ?? "10:00"),
    end_time: shortTime(row?.end_time ?? null),
    kind: row?.kind ?? "viewing",
    status: row?.status ?? "planned",
    listing_id: row?.listing_id ?? "",
    client_name: row?.client_name ?? "",
    client_phone: row?.client_phone ?? "",
    location: row?.location ?? "",
    note: row?.note ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListingOption = { id: string; title: any; address_city: string | null };

interface Props {
  initial: AppointmentDraft;
  listings: ListingOption[];
  locale: string;
  onSave: (draft: AppointmentDraft) => Promise<void>;
  onCancel: () => void;
}

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

/** One entry: when, what kind, which property, who is coming. */
export function AppointmentForm({ initial, listings, locale, onSave, onCancel }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(initial);
  const set = (patch: Partial<AppointmentDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.day")}</Label>
          <Input
            type="date"
            value={draft.day}
            onChange={(e) => set({ day: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.start")}</Label>
          <Input
            type="time"
            value={draft.start_time}
            onChange={(e) => set({ start_time: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.end")}</Label>
          <Input
            type="time"
            value={draft.end_time}
            onChange={(e) => set({ end_time: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.kind")}</Label>
          <select
            className={selectClass}
            value={draft.kind}
            onChange={(e) => set({ kind: e.target.value })}
          >
            {APPOINTMENT_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {t(`admin.calendar.kind.${kind}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.status")}</Label>
          <select
            className={selectClass}
            value={draft.status}
            onChange={(e) => set({ status: e.target.value })}
          >
            {APPOINTMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`admin.calendar.status.${status}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t("admin.calendar.field.listing")}</Label>
        <select
          className={selectClass}
          value={draft.listing_id}
          onChange={(e) => set({ listing_id: e.target.value })}
        >
          <option value="">{t("admin.calendar.field.noListing")}</option>
          {listings.map((listing) => (
            <option key={listing.id} value={listing.id}>
              {[pickLocalized(listing.title, locale), listing.address_city]
                .filter(Boolean)
                .join(" — ")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.clientName")}</Label>
          <Input
            value={draft.client_name}
            onChange={(e) => set({ client_name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t("admin.calendar.field.clientPhone")}</Label>
          <Input
            value={draft.client_phone}
            onChange={(e) => set({ client_phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t("admin.calendar.field.location")}</Label>
        <Input value={draft.location} onChange={(e) => set({ location: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <Label>{t("admin.calendar.field.note")}</Label>
        <Textarea
          rows={3}
          value={draft.note}
          onChange={(e) => set({ note: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <SaveButton onSubmit={() => onSave(draft)} />
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("admin.calendar.cancel")}
        </Button>
      </div>
    </div>
  );
}
