import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FLOOR_LEVELS, isFloorLevel } from "@/lib/listings/floor-levels";

const CUSTOM = "__custom";
const NONE = "__none";

/** Which storey a floor plan shows; presets translate, "Other" takes free text. */
export function FloorLevelPicker({ value, onSave, name }: {
  value: string | null;
  onSave: (label: string | null) => void;
  name: string;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(value ? (isFloorLevel(value) ? value : CUSTOM) : NONE);
  const [text, setText] = useState(value && !isFloorLevel(value) ? value : "");
  useEffect(() => {
    setMode(value ? (isFloorLevel(value) ? value : CUSTOM) : NONE);
    setText(value && !isFloorLevel(value) ? value : "");
  }, [value]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={mode}
        onValueChange={(v) => {
          setMode(v);
          if (v === NONE) onSave(null);
          else if (v !== CUSTOM) onSave(v);
        }}
      >
        <SelectTrigger className="h-9 w-48" aria-label={`${t("floorLevels.label")}: ${name}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>{t("floorLevels.none")}</SelectItem>
          {FLOOR_LEVELS.map((k) => (
            <SelectItem key={k} value={k}>{t(`floorLevels.${k}`)}</SelectItem>
          ))}
          <SelectItem value={CUSTOM}>{t("floorLevels.custom")}</SelectItem>
        </SelectContent>
      </Select>
      {mode === CUSTOM ? (
        <Input
          className="h-9 w-56"
          value={text}
          maxLength={60}
          placeholder={t("floorLevels.customPlaceholder")}
          aria-label={t("floorLevels.custom")}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => text.trim() !== (value ?? "") && onSave(text.trim() || null)}
        />
      ) : null}
    </div>
  );
}
