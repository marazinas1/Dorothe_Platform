# Public UI binding rules (Deerva Noir family)

Every new public module follows these. No module invents its own look.

1. **Two token blocks, no third.** Public tokens live in `:root`, admin tokens in `[data-admin-theme="noir"]` (both in `src/styles.css`). Nothing else defines colour, font or radius.
2. **No raw values in components.** No hex colours, font names, pixel radii or Tailwind palette classes (`bg-black`, `text-white`, `text-gray-*`, `bg-amber-*`). Tokens only; over photos use `on-media` / `scrim`.
3. **One Button component.** `ui/Button.tsx`: primary, secondary, outline, ghost, link (admin adds destructive). Links styled as buttons use `buttonClass` / `ActionLink` / `QuietLink`. No hand-styled buttons.
4. **One primary per region.** A screen region has at most one primary action; everything else is secondary, outline, ghost or link.
5. **44px targets, visible focus.** Every control at least 44px tall (icon buttons 44x44 with `aria-label`). Focus shows a 2px ring with 2px offset; never remove outlines without a replacement.
6. **Fonts by layer.** Urbanist for the public site; admin and sign-in use the admin font only; the script font (Tangerine) only for the signature.
7. **Contrast before colour.** Text on any filled surface reaches 4.5:1. If a brand colour fails, use its deeper shade for fills and keep the original for accents.
8. **Fixed vocabulary.** Seven listing statuses with fixed words and colours. An action keeps its name through the flow: Publish produces Published.
