import { useEffect } from "react";

/** Keeps portalled controls inside the same fixed Noir theme as admin/auth. */
export function AdminThemeScope({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const previous = document.body.dataset.adminTheme;
    document.body.dataset.adminTheme = "noir";
    return () => {
      if (previous) document.body.dataset.adminTheme = previous;
      else delete document.body.dataset.adminTheme;
    };
  }, []);

  return <div data-admin-theme="noir">{children}</div>;
}