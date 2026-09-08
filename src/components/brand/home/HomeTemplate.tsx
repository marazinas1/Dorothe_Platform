import type { HomeTemplateKey } from "@/lib/home/templates";

import { H1Home } from "./h1/H1Home";
import { H2Home } from "./h2/H2Home";
import { H3Home } from "./h3/H3Home";
import { H4Home } from "./h4/H4Home";
import { H5Home } from "./h5/H5Home";
import type { HomeTemplateProps } from "./types";

/** Single switch from a design key to its page. Nothing else decides this. */
export function HomeTemplateView({
  template,
  ...props
}: HomeTemplateProps & { template: HomeTemplateKey }) {
  if (template === "h2") return <H2Home {...props} />;
  if (template === "h3") return <H3Home {...props} />;
  if (template === "h4") return <H4Home {...props} />;
  if (template === "h5") return <H5Home {...props} />;
  return <H1Home {...props} />;
}
