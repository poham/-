# Project Structure

## Root Files

- `App.tsx`: Main application orchestrator (< 200 lines, composition only)
- `index.tsx`: React app entry point
- `types.ts`: TypeScript interfaces and enums for all data structures
- `constants.tsx`: Default configurations, tag groups, preset data, and option arrays
- `presets.ts`: Preset series definitions and curated photography configurations

## Component Organization

### `/hooks`

Custom React hooks for state management:
- `usePromptState.ts`: Main prompt configuration state management
- `useSidebarState.ts`: Sidebar collapse state with responsive behavior
- `useCustomTags.ts`: User-defined tags management with LocalStorage
- `useUserPresets.ts`: User preset collections management
- `useWindowSize.ts`: Real-time window size tracking for responsive behavior

### `/utils`

Pure utility functions:
- `responsive.ts`: Device type detection and responsive breakpoint logic
- `storage.ts`: Safe LocalStorage operations with error handling
- `promptAssembly.ts`: Prompt string assembly and formatting logic

### `/components`

Top-level reusable components:
- `PresetManager.tsx`: Gallery interface for browsing and managing preset collections
- `SectionHeader.tsx`: Shared header component for sections
- `TagInput.tsx`: Custom tag input component with add/remove functionality

### `/components/layout`

Main layout components:
- `NavigationSidebar.tsx`: Left navigation panel with step indicators
- `ProtocolDeck.tsx`: Right protocol preview panel with live prompt display
- `MainContentArea.tsx`: Central content area with section routing

### `/components/sections`

Modular workflow sections (one per tab):
- `CategorySection.tsx`: Theme/aesthetic selection (Step 01)
- `SubjectSection.tsx`: Subject details and materials (Step 02)
- `BackgroundSection.tsx`: Scene and environment configuration (Step 03)
- `CameraSection.tsx`: Camera parameters and composition (Step 04)
- `OpticsSection.tsx`: Lighting physics and studio setups (Step 05)
- `StyleSection.tsx`: Post-processing and film simulation (Step 06)
- `ShareSection.tsx`: Export and prompt display (Step 07)
- `SettingsSection.tsx`: Import/export user data (Settings)

### `/components/visuals`

Interactive visualization components:
- `CompositionGrid.tsx`: Rule of thirds / golden ratio overlay
- `DOFVisualizer.tsx`: Depth of field preview
- `FramingVisualizer.tsx`: Shot type and framing guide
- `LensFOV.tsx`: Lens field of view visualization
- `PortraitLightingVisualizer.tsx`: Studio lighting setup preview

## Data Flow

1. User navigates through tabs in `App.tsx`
2. Each section component receives state slice and update callback
3. Changes update centralized `PromptState` in `App.tsx`
4. Live protocol deck displays real-time prompt assembly
5. Final prompt can be copied and used with any AI image generation platform

## Naming Conventions

- Components: PascalCase (e.g., `PresetManager.tsx`)
- Types/Interfaces: PascalCase (e.g., `PromptState`, `CategoryType`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_STATE`, `SHOT_TYPES`)
- Functions: camelCase (e.g., `assemblePromptParts`)

## Styling Approach

Inline Tailwind utility classes with custom design system:
- Dark theme: `bg-[#020617]`, `bg-[#080c18]`, `bg-[#0f172a]`
- Accent colors: Blue (`blue-500`, `blue-600`) and Orange (`orange-500`)
- Typography: Black font weights, uppercase tracking, monospace for metadata
- Rounded corners: Large radius values (`rounded-[2.5rem]`, `rounded-[4rem]`)
