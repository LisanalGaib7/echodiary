## Plan: WeeklyGoal-Journal Separation — Options B & C Visual Comparison

### Context
The user wants to visually compare two design options (B and C) for separating the WeeklyGoal section from the journal writing card below it, without using a horizontal line.

**Option B — Floating Overlap Card:**
- Convert the WeeklyGoal section into a compact, rounded card with a soft shadow.
- The card slightly overlaps the top edge of the journal card below it, creating depth/layering.
- Background: subtle tint or white with shadow. The journal card sits behind it.
- Effect: dimensional, tactile, like a sticky note or badge sitting on top of the journal.

**Option C — Typography Scale Jump:**
- Remove all separator lines completely.
- Shrink the WeeklyGoal section dramatically (compact row or minimal stats line).
- Add generous whitespace (py-10+) between the goal section and the journal card.
- Effect: airy, Swiss/editorial minimalism. Separation achieved purely through scale contrast and negative space.

### Implementation Steps
1. **Capture baseline:** Branch from current WeeklyGoal.tsx state (border-y separator, hairline divider inside).
2. **Build Option B prototype:** Restyle WeeklyGoal as a floating rounded card (`rounded-2xl`, `shadow-lg`, `bg-background`, slight negative margin-bottom to overlap journal card). Adjust journal card top padding to accommodate overlap. Keep goal/streak content inside but more compact.
3. **Build Option C prototype:** Remove `border-y` and internal hairline. Shrink goal section to a single compact row with small typography. Add large vertical gap (`gap-12` or `py-10`) between WeeklyGoal and journal card. Goal number becomes small label-like; streak becomes inline.
4. **Preview both:** Deploy both variations as toggleable states (or sequential commits) so the user can view each in the live preview.
5. **User selection:** Ask user which option they prefer, or if they want a hybrid.
6. **Finalize:** Apply the chosen option, remove the unused variant code, and verify visual hierarchy with the journal card.

### Files to modify
- `src/components/WeeklyGoal.tsx` (primary)
- `src/routes/index.tsx` (gap/spacing between WeeklyGoal and journal card)
- `src/styles.css` (if new shadow/background tokens needed)

### Out of scope
- No changes to goal/streak logic, localStorage, or progress bar mechanics.
- No backend changes.