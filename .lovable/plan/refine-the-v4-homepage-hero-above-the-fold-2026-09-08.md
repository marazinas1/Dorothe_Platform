# Refine the V4 homepage hero above the fold

## Outcome
Keep Dorothe’s portrait large while ensuring the complete headline, supporting text, and both actions are visible immediately on typical laptop screens. Use the third reference composition: the portrait continues close to the fold, with Dorothe’s name and role directly beneath it as a natural continuation into the page.

## Changes
- Reduce only the desktop top gap between the fixed navigation and the two-column hero.
- Preserve the portrait’s current 4:5 proportion and visual prominence rather than shrinking it substantially.
- Rebalance the hero’s desktop vertical spacing so the left column, including both actions, fits within a short laptop viewport.
- Keep Dorothe’s name and role below the portrait; allow them to sit at or just beyond the fold on the shortest screens rather than compressing the portrait or copy.
- Leave mobile stacking and all admin-managed text/image sources unchanged.

## Verification
- Check the hero at short laptop, standard desktop, and mobile sizes.
- Confirm both actions are fully visible without scrolling on desktop/laptop.
- Confirm the portrait is not noticeably reduced, the caption remains attached to it, and no content overlaps the fixed navigation.
- Confirm the next content still begins naturally below the hero and there is no horizontal overflow.

## Technical details
- Scope the adjustment to the H1/V4 hero presentation component.
- Use responsive spacing constraints rather than viewport-scaled typography or a fixed-height crop.
- Preserve semantic design tokens, Fraunces/IBM Plex Sans typography, and backend-driven content.
