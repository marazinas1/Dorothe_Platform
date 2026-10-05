import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POST_TOPICS, type PostTopic } from "@/lib/posts/types";

const NONE = "none";

/** The article's subject, shown as a label on the public guide cards. */
export function TopicField({
  value,
  onChange,
}: {
  value: PostTopic | null;
  onChange: (topic: PostTopic | null) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1.5">
      <Label htmlFor="post-topic">{t("admin.posts.topic")}</Label>
      <Select
        value={value ?? NONE}
        onValueChange={(v) => onChange(v === NONE ? null : (v as PostTopic))}
      >
        <SelectTrigger id="post-topic">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>{t("admin.posts.topicNone")}</SelectItem>
          {POST_TOPICS.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {t(`blog.topics.${topic}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
