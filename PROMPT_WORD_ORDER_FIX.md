# Prompt Word Order Fix - VisualStyle and Mood Positioning

## User Concern (Query 11)

User asked: "關於之前有些東西像魚眼也是放在最前面的，這個方案會不會複寫掉這個原先的調整？"

Translation: "About things like fisheye that were placed at the front before, will this solution overwrite that previous adjustment?"

## Analysis Result: NO CONFLICT ✅

After analyzing the codebase, **there is NO conflict** between the proposed VisualStyle/Mood positioning change and the existing special mode logic.

## Why There's No Conflict

### Current Architecture

The system has **TWO SEPARATE FLOWS**:

#### 1. Special Override Modes (in `utils/visualTranslators.ts`)
These modes **completely replace** the standard prompt assembly logic:

- **Macro Mode** (`isMacroMode()`)
  - Detected by keywords: 'macro', '微距', 'extreme close'
  - **Returns early** from `translatePromptState()` at line ~450
  - Custom composition order: `[MACRO SCALE] → [Macro Angle] → [DOF] → [VisualStyle]`
  - VisualStyle is placed at **position 4** (last)

- **Wide Shot Mode** (`isWideMode()`)
  - Detected by keywords: '大遠景', '極遠景', 'very long shot', 'extreme long shot'
  - **Returns early** from `translatePromptState()` at line ~550
  - Custom composition order: `[WIDE SCALE] → [Wide Angle] → [Subject] → [Environment] → [VisualStyle]`
  - VisualStyle is placed at **position 5** (last)

- **Fisheye Mode** (special optics)
  - Detected in lens string: '魚眼', 'fisheye', '8mm'
  - Handled by `translateFocalLength()` at line ~650
  - Returns: `'Fisheye lens perspective, extreme barrel distortion, 180-degree field of view, spherical projection'`
  - This description is placed in **Slot 3** (lens optics) of standard mode

#### 2. Standard Mode (in `utils/visualTranslators.ts` + `utils/promptAssembly.ts`)
This is the normal flow for all other cases:

- Current order (line ~700-750):
  ```
  [Camera Position] → [Lens Optics] → [Shot Scale] → [Composition Extras] → [VisualStyle]
  ```

- Proposed new order (to be implemented):
  ```
  [VisualStyle] → [Mood] → [Camera Position] → [Lens Optics] → [Shot Scale] → [Composition Extras]
  ```

### Key Insight: Early Returns Prevent Conflicts

```typescript
// In translatePromptState() - line ~430-550
if (isMacro) {
  // ... Macro mode logic ...
  return { composition, subject, environment, lighting, mood, style };
  // ⬆️ EARLY RETURN - Standard mode logic never runs
}

if (isWide) {
  // ... Wide mode logic ...
  return { composition, subject, environment, lighting, mood, style };
  // ⬆️ EARLY RETURN - Standard mode logic never runs
}

// Standard mode logic only runs if neither Macro nor Wide mode is active
// ⬇️ This is where we'll make changes
const compositionParts: string[] = [];
compositionParts.push(`camera positioned at ${cameraPositionDesc}`);
// ... rest of standard mode logic
```

## Implementation Plan

### Changes Needed

1. **Expand `VISUAL_STYLES` in `constants.tsx`**
   - Add ~20-25 categorized options (Film Noir, Cyberpunk, Sin City, Blade Runner, etc.)
   - Organize into 4 categories: 電影風格, 藝術運動, 攝影類型, 視覺質感

2. **Update `StyleSection.tsx`**
   - Display categorized buttons instead of single grid
   - Keep parameter-driven approach (no textarea)

3. **Update `utils/promptAssembly.ts` - `assembleFinalPrompt()`**
   - Move VisualStyle and Mood sections BEFORE composition
   - New order:
     ```
     [VisualStyle] [Mood] [Camera Setup] of [Subject] in [Environment] lit by [Lighting] with [Processing]
     ```

4. **IMPORTANT: Do NOT modify `utils/visualTranslators.ts`**
   - Special mode logic (Macro, Wide, Fisheye) stays unchanged
   - Standard mode composition assembly stays unchanged
   - Only `assembleFinalPrompt()` changes the final assembly order

### Why This Works

- **Macro/Wide modes**: Already have their own custom logic with early returns
- **Fisheye mode**: Handled in lens optics slot, not affected by word order changes
- **Standard mode**: Will benefit from VisualStyle/Mood being placed first
- **No overlap**: The three modes are mutually exclusive

## Verification Checklist

Before implementation:
- [x] Confirm Macro mode has early return
- [x] Confirm Wide mode has early return
- [x] Confirm Fisheye is handled in lens optics slot
- [x] Confirm Standard mode is the only flow affected by `assembleFinalPrompt()` changes

After implementation:
- [ ] Test Macro mode: Verify VisualStyle still appears at position 4
- [ ] Test Wide mode: Verify VisualStyle still appears at position 5
- [ ] Test Fisheye lens: Verify fisheye description appears in lens optics slot
- [ ] Test Standard mode: Verify VisualStyle/Mood appear at beginning
- [ ] Run existing tests: `utils/macroMode.test.ts`, `utils/wideShot.test.ts`

## Conclusion

**The proposed VisualStyle/Mood positioning change will NOT affect special modes** because:

1. Macro and Wide modes use completely separate logic with early returns
2. Fisheye is a lens characteristic, not a mode, and is handled in a different slot
3. Only Standard mode will be affected by the word order change
4. This is exactly what we want: strong style tags (Film Noir, Cyberpunk) at the front for normal shots, while special modes maintain their optimized structures

**Proceed with implementation safely!** ✅
