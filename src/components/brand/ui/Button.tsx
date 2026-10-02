import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one public button (Deerva Noir family). Five variants, nothing else:
 * primary, secondary, outline, ghost, link. `inverse` flips colours for
 * inverted bands and photography; `size="icon"` is the 44x44 icon target.
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "icon";

const BASE =
  "relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] text-center transition-[background-color,color,border-color,opacity,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 motion-reduce:transform-none motion-reduce:active:scale-100";

const LIFT = "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0";

const VARIANTS: Record<ButtonVariant, { normal: string; inverse: string }> = {
  primary: {
    normal: `btn-noir border border-primary bg-primary text-primary-foreground hover:bg-primary/90 ${LIFT}`,
    inverse: `btn-noir border border-background bg-background text-foreground hover:bg-background/90 ${LIFT}`,
  },
  secondary: {
    normal: `btn-noir border border-border bg-card text-foreground hover:border-foreground ${LIFT}`,
    inverse: `btn-noir border border-footer-muted bg-transparent text-footer-foreground hover:border-footer-foreground ${LIFT}`,
  },
  outline: {
    normal: `btn-noir border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background ${LIFT}`,
    inverse: `btn-noir border border-on-media bg-transparent text-on-media hover:bg-on-media hover:text-foreground ${LIFT}`,
  },
  ghost: {
    normal: "border border-transparent bg-transparent text-foreground hover:bg-card",
    inverse: "border border-transparent bg-transparent text-on-media hover:bg-scrim-soft",
  },
  link: {
    normal:
      "btn-noir min-h-11 underline decoration-1 underline-offset-[6px] text-foreground hover:opacity-70 active:scale-100",
    inverse:
      "btn-noir min-h-11 underline decoration-1 underline-offset-[6px] text-on-media hover:opacity-70 active:scale-100",
  },
};

const SIZES: Record<ButtonSize, string> = {
  default: "h-12 px-8",
  sm: "h-11 px-5",
  icon: "size-11 p-0",
};

export function buttonClass({
  variant = "primary",
  size = "default",
  inverse = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  inverse?: boolean;
  className?: string;
} = {}) {
  return cn(
    BASE,
    VARIANTS[variant][inverse ? "inverse" : "normal"],
    variant === "link" ? "h-auto px-0" : SIZES[size],
    className,
  );
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  inverse?: boolean;
  /** Shows a spinner in place of the label without changing the width. */
  loading?: boolean;
  children?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant, size, inverse, loading = false, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, inverse, className })}
      {...rest}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
      {loading ? (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        </span>
      ) : null}
    </button>
  );
});
