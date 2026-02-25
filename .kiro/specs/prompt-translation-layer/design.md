# Design Document: Prompt Translation Layer

## Overview

The Prompt Translation Layer is a pure functional module that converts technical photography parameters (numerical angles, hex codes, focal lengths) into visual descriptions that AI image generation models can interpret. This design maintains backward compatibility with existing UI controls and data structures while transforming the final prompt output to use human-readable, visually descriptive language.

The translation layer operates as a thin adapter between the existing `PromptState` interface and the final prompt string assembly, requiring no changes to UI components or state management logic.

## Architecture

### System Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  (Sliders, Color Pickers, Dropdowns - UNCHANGED)            │
└────────────────────┬────────────────────────────────────────┘
                     │ PromptState (TypeScript Interface)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Translation Layer (NEW)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Lens Translator                                     │   │
│  │  Light Direction Translator                          │   │
│  │  Color Translator                                    │   │
│  │  Shot Type Translator                                │   │
│  │  Camera Angle Translator                             │   │
│  │  Studio Setup Translator                             │   │
│  │  Intensity Translator                                │   │
│  │  Aperture Translator                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ Visual Descriptions (Strings)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Prompt Assembly (MODIFIED)                      │
│  - Applies Golden Order                                      │
│  - Combines translated descriptions                          │
│  - Outputs final prompt string                               │
└────────────────────┬────────────────────────────────────────┘
                     │ Final Prompt String
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ShareSection Display & Copy                     │
│  - Display optimized prompt                                  │
│  - Copy to clipboard                                         │
│  - User uses prompt with any AI platform                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Pure Functions**: All translators are pure functions with no side effects
2. **Single Responsibility**: Each translator handles one parameter type
3. **Composability**: Translators can be combined and tested independently
4. **Backward Compatibility**: Existing `PromptState` interface remains unchanged
5. **Zero UI Impact**: No changes required to UI components

## Components and Interfaces

### Translation Function Signatures

All translation functions follow a consistent pattern:

```typescript
type TranslatorFunction<T> = (input: T) => string;
```

### 1. Lens Focal Length Translator

**Purpose**: Convert focal length values to visual perspective descriptions

**Interface**:
```typescript
function translateFocalLength(lens: string): string
```

**Input**: Lens string from `FOCAL_LENGTHS` constant (e.g., "50mm 標準", "200mm 特寫")

**Output**: Visual description string

**Translation Rules**:
- Extract numerical focal length from string
- Map to perspective category:
  - 8mm: "Extreme fisheye distortion, 180-degree field of view, spherical warping"
  - 14-24mm: "Wide angle lens, dynamic perspective, barrel distortion, expansive view"
  - 35-50mm: "Natural human eye view, zero distortion, standard perspective"
  - 85-135mm: "Portrait lens, subtle compression, flattering perspective, subject isolation"
  - 200mm+: "Telephoto lens, strong compression effect, flattened background layers, narrow field of view"

### 2. Light Direction Translator

**Purpose**: Convert azimuth/elevation angles to directional lighting descriptions

**Interface**:
```typescript
function translateLightDirection(
  azimuth: number,
  elevation: number,
  lightType: 'Key' | 'Fill' | 'Rim'
): string
```

**Input**: 
- `azimuth`: 0-360 degrees (horizontal rotation)
- `elevation`: -90 to 90 degrees (vertical angle)
- `lightType`: Type of light source

**Output**: Directional description string

**Translation Rules** (based on research from [photography lighting patterns](https://photographyicon.com)):

**Azimuth Zones**:
- 0° ± 15°: "Front"
- 30-60°: "Side from upper angle"
- 90° ± 15°: "Hard side, split lighting"
- 120-150°: "Three-quarter back"
- 180° ± 30°: "Backlit, rim lighting"

**Elevation Zones**:
- 70-90°: "Top-down, overhead"
- 40-60°: "Upper angle"
- 20-40°: "Slightly elevated"
- -10 to 20°: "Eye level"
- -30 to -10°: "Low angle"
- -60 to -30°: "Upward angle"
- -90 to -60°: "Dramatic underlighting"

**Combined Descriptions**:
- Front + Eye level: "Front lighting, minimal shadows, flat appearance"
- Side + Upper angle: "Side lighting from upper angle, dimensional shadows, sculptural quality"
- Back + Upper angle: "Backlit, rim lighting, silhouette effect, halo glow"

### 3. Color Hex Translator

**Purpose**: Convert hex color codes to named colors with visual associations

**Interface**:
```typescript
function translateColorHex(hexColor: string): string
```

**Input**: Hex color code (e.g., "#FF5733", "#1E90FF")

**Output**: Named color with visual association

**Translation Algorithm**:
1. Parse hex to RGB values
2. Calculate hue, saturation, lightness (HSL)
3. Determine color family from hue:
   - 0-30°: Red/Orange
   - 30-60°: Orange/Yellow
   - 60-120°: Yellow/Green
   - 120-180°: Green/Cyan
   - 180-240°: Cyan/Blue
   - 240-300°: Blue/Purple
   - 300-360°: Purple/Magenta
4. Determine intensity from saturation:
   - 0-20%: "Muted", "Subtle", "Desaturated"
   - 20-60%: "Soft", "Gentle"
   - 60-100%: "Vivid", "Intense", "Saturated"
5. Add visual reference based on color:
   - Red: "like magma", "like sunset"
   - Orange: "like persimmon", "like autumn leaves"
   - Blue: "like clear sky", "like ocean depths"
   - White (#FFFFFF): "Pure white, neutral color temperature"

**Example Outputs**:
- `#FF5733` → "Vivid orange-red, warm color temperature, like magma"
- `#1E90FF` → "Dodger blue, cool color temperature, like clear sky"
- `#CBD5E1` → "Soft slate gray, cool neutral, like overcast sky"

### 4. Shot Type Translator

**Purpose**: Convert cinema abbreviations to body-part descriptions

**Interface**:
```typescript
function translateShotType(shotType: string, subjectType: string): string
```

**Input**: 
- `shotType`: Shot type from `SHOT_TYPES` constant
- `subjectType`: Subject type (person, product, etc.)

**Output**: Body-part or view-angle description

**Translation Rules for People**:
- "微距 (Macro Shot)" → "Extreme close-up, magnified details, shallow depth of field"
- "極致特寫 (ECU)" → "Eyes and facial features only, intimate framing"
- "特寫/肩上 (CU)" → "Face filling frame, from chin to forehead"
- "中特寫/胸上 (MCU/Bust)" → "Head and shoulders portrait, upper chest visible"
- "中景/腰上 (MS/Chest)" → "Waist-up shot, torso and arms visible"
- "中遠景/膝上 (MLS/Knee)" → "Three-quarter body shot, from knees up"
- "遠景/全身 (LS/Full Body)" → "Full body shot, head to toe, showing shoes"
- "大遠景 (VLS)" → "Full figure with surrounding environment, establishing shot"
- "極遠景 (XLS)" → "Distant view, subject small in frame, vast environment"

**Translation Rules for Products**:
- Top-down implied → "Flat lay, top-down view, knolling arrangement"
- Front view → "Front view, straight-on perspective, centered composition"
- 45-degree → "Isometric view, 3/4 angle, dimensional perspective"
- Side view → "Profile view, side angle, showing depth and form"

### 5. Camera Angle Translator

**Purpose**: Convert camera angle selections to visual viewpoint descriptions

**Interface**:
```typescript
function translateCameraAngle(angle: string, roll: number): string
```

**Input**: 
- `angle`: Camera angle from `CAMERA_ANGLE_TAGS`
- `roll`: Camera roll in degrees

**Output**: Viewpoint description

**Translation Rules**:
- "水平視角 (Eye Level)" → "Eye-level perspective, neutral viewpoint, natural horizon"
- "高角度 (High Angle)" → "High angle view, looking down, subject appears smaller"
- "低角度 (Low Angle)" → "Low angle view, looking up, subject appears powerful"
- "鳥瞰 (Bird's Eye)" → "Bird's eye view, directly overhead, top-down perspective"
- "蟲視 (Worm's Eye)" → "Worm's eye view, extreme low angle, dramatic upward perspective"
- Roll ≠ 0 → Append: "Dutch angle, canted frame, tilted horizon at {roll} degrees"

### 6. Studio Setup Translator

**Purpose**: Convert studio lighting preset IDs to visual characteristic descriptions

**Interface**:
```typescript
function translateStudioSetup(setupId: string): string
```

**Input**: Studio setup ID from `STUDIO_SETUPS` constant

**Output**: Visual lighting pattern description

**Translation Rules** (based on [classic portrait lighting patterns](https://photographyicon.com)):
- "rembrandt" → "Rembrandt lighting, triangle catchlight on cheek, dramatic chiaroscuro"
- "butterfly" → "Butterfly lighting, nose shadow, glamour beauty lighting"
- "split" → "Split lighting, half-lit face, high contrast, dramatic shadows"
- "loop" → "Loop lighting, small nose shadow, natural dimensional portrait"
- "rim" → "Rim lighting, backlit edge glow, silhouette effect, halo"
- "clamshell" → "Clamshell lighting, soft even illumination, minimal shadows"
- "high_key" → "High-key lighting, bright overexposed background, clean airy feel"

### 7. Light Intensity Translator

**Purpose**: Convert intensity percentages to qualitative brightness descriptions

**Interface**:
```typescript
function translateLightIntensity(intensity: number, lightType: string): string
```

**Input**: 
- `intensity`: 0-100 percentage
- `lightType`: Type of light (Key, Fill, Rim)

**Output**: Qualitative brightness description

**Translation Rules**:
- 0-20%: "Subtle {lightType}, barely visible, ambient level"
- 21-40%: "Soft {lightType}, gentle illumination, low contrast"
- 41-60%: "Moderate {lightType}, balanced lighting, natural appearance"
- 61-80%: "Strong {lightType}, prominent illumination, clear shadows"
- 81-100%: "Intense {lightType}, powerful lighting, high contrast, dramatic"

### 8. Aperture (Depth of Field) Translator

**Purpose**: Convert f-stop values to visual depth of field descriptions

**Interface**:
```typescript
function translateAperture(aperture: string): string
```

**Input**: Aperture string (e.g., "f/2.8", "f/11")

**Output**: Depth of field description

**Translation Rules**:
- f/1.2 - f/2.0: "Extremely shallow depth of field, creamy bokeh, subject isolation"
- f/2.8 - f/4.0: "Shallow depth of field, soft background blur, subject separation"
- f/5.6 - f/8.0: "Moderate depth of field, balanced sharpness, natural focus falloff"
- f/11 - f/16: "Deep depth of field, sharp foreground and background, landscape focus"
- f/22+: "Maximum depth of field, everything in focus, tack sharp throughout"

## Data Models

### Existing Data Structures (UNCHANGED)

The following interfaces remain unchanged:

```typescript
// From types.ts
interface LightSource {
  azimuth: number;
  elevation: number;
  color: string;
  intensity: number;
}

interface CameraConfig {
  shotType: string;
  angle: string;
  lens: string;
  roll: number;
  // ... other fields
}

interface OpticsConfig {
  dof: string;
  keyLight: LightSource;
  fillLight: LightSource;
  rimLight: LightSource;
  studioSetup: string;
  // ... other fields
}

interface PromptState {
  category: CategoryType;
  camera: CameraConfig;
  subject: { ... };
  background: { ... };
  optics: OpticsConfig;
  style: StyleConfig;
}
```

### New Translation Module Structure

```typescript
// New file: utils/visualTranslators.ts

export interface TranslatedPromptComponents {
  composition: string;      // Shot type + camera angle + lens
  subject: string;          // Subject description (unchanged)
  action: string;           // Subject state/action (unchanged)
  environment: string;      // Background description (unchanged)
  lighting: string;         // Translated lighting setup
  mood: string;             // Mood description (unchanged)
  style: string;            // Post-processing tags (unchanged)
}

export function translatePromptState(state: PromptState): TranslatedPromptComponents
```

### Prompt Assembly Golden Order

The final prompt must follow this sequence (weight decreases left to right):

```
[Composition + Subject] + [Action/State] + [Environment] + [Lighting/Mood] + [Style/Quality]
```

**Example**:
```
"A waist-up shot with natural human eye view of a perfume bottle (frosted glass, gold cap), 
standing upright on marble surface, 
in a minimalist studio with soft gray background, 
with side lighting from upper angle creating dimensional shadows and soft cinematic mood, 
hyper-detailed with ray tracing."
```

**Anti-pattern** (DO NOT):
```
"Camera: 50mm lens, f/2.8 aperture. Subject: perfume bottle. Lighting: Azimuth 45°..."
```

## Modified Prompt Assembly Logic

### Current Implementation Issues

The current `utils/promptAssembly.ts` has these problems:

1. **Separated sections**: Uses labeled sections (THEME, SUBJECT, OPTICS) instead of flowing narrative
2. **Technical parameters**: Outputs raw numbers like "Azimuth 45°, Elevation 30°"
3. **Wrong order**: Places camera parameters in separate OPTICS section instead of integrating with composition

### New Implementation Strategy

**File**: `utils/promptAssembly.ts` (MODIFIED)

```typescript
import { translatePromptState } from './visualTranslators';

export function assembleFinalPrompt(state: PromptState): string {
  // Step 1: Translate all technical parameters to visual descriptions
  const translated = translatePromptState(state);
  
  // Step 2: Assemble in golden order
  const parts: string[] = [];
  
  // [Composition + Subject]
  parts.push(`${translated.composition} of ${translated.subject}`);
  
  // [Action/State] (if present)
  if (translated.action) {
    parts.push(translated.action);
  }
  
  // [Environment]
  parts.push(`in ${translated.environment}`);
  
  // [Lighting/Mood]
  parts.push(`with ${translated.lighting}, ${translated.mood} mood`);
  
  // [Style/Quality]
  if (translated.style) {
    parts.push(translated.style);
  }
  
  return parts.join(', ') + '.';
}
```

### Backward Compatibility Strategy

To maintain compatibility with existing presets:

1. **Migration function**: Existing `migrateOpticsConfig()` already handles old preset formats
2. **Graceful degradation**: If translation fails, fall back to original value
3. **Preset validation**: Test all existing presets after implementation
4. **UI unchanged**: All UI controls continue to work with numerical/technical inputs

## Error Handling

### Translation Error Handling

Each translator function includes error handling:

```typescript
function translateFocalLength(lens: string): string {
  try {
    const match = lens.match(/(\d+)mm/);
    if (!match) {
      console.warn(`Unable to parse focal length: ${lens}`);
      return lens; // Fallback to original
    }
    
    const focalLength = parseInt(match[1]);
    // ... translation logic
    
  } catch (error) {
    console.error(`Error translating focal length: ${error}`);
    return lens; // Fallback to original
  }
}
```

### Fallback Strategy

1. **Parse failure**: Return original input string
2. **Unknown value**: Return generic description
3. **Null/undefined**: Return empty string or default description
4. **Log warnings**: Console warnings for debugging, but never throw errors

### Validation

Input validation occurs at translation time:

```typescript
function validateAzimuth(azimuth: number): number {
  return Math.max(0, Math.min(360, azimuth));
}

function validateElevation(elevation: number): number {
  return Math.max(-90, Math.min(90, elevation));
}

function validateIntensity(intensity: number): number {
  return Math.max(0, Math.min(100, intensity));
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Focal Length Range Translation

*For any* focal length value in the supported range (8mm to 200mm+), the translation function should return a visual description that matches the appropriate perspective category (fisheye, wide angle, standard, portrait, or telephoto) without including the numerical focal length value.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: Light Direction Angle Translation

*For any* combination of azimuth (0-360°) and elevation (-90° to 90°), the translation function should return a directional description (front, side, back, top-down, etc.) without including numerical degree values.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 3: Hex Color to Visual Description

*For any* valid hex color code, the translation function should return a named color with visual association and temperature description, without including the original hex code in the output.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 4: Product Shot Context Awareness

*For any* shot type when subject type is "product", the translation function should return product-specific view descriptions (flat lay, isometric, profile) instead of person-oriented descriptions (waist-up, head and shoulders).

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 5: Camera Roll Dutch Angle

*For any* non-zero camera roll value, the translation function should include "Dutch angle" and "canted frame" in the output description.

**Validates: Requirements 6.6**

### Property 6: Prompt Golden Order Compliance

*For any* complete PromptState, the assembled final prompt should place components in the golden order: composition+subject first, then action/state, then environment, then lighting/mood, then style/quality last.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 7: Camera Parameters Integration

*For any* final assembled prompt, camera parameters (lens, shot type, angle) should appear integrated within the composition section at the beginning, not as a separate labeled section.

**Validates: Requirements 7.6**

### Property 8: Light Intensity Qualitative Description

*For any* light intensity value (0-100%), the translation function should return a qualitative description (subtle, soft, moderate, strong, intense) appropriate to the intensity range, without including the numerical percentage.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

### Property 9: Aperture Depth of Field Description

*For any* aperture value (f/1.2 to f/22+), the translation function should return a depth of field description (extremely shallow, shallow, moderate, deep, maximum) without including the f-stop number.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 10: Backward Compatibility with Existing Presets

*For any* existing preset configuration (including legacy formats), the translation layer should successfully translate all parameters to visual descriptions without errors or data loss.

**Validates: Requirements 11.1, 11.3, 11.5**

### Property 11: Translation Function Purity

*For any* translation function and any input value, calling the function multiple times with the same input should always return the same output, and should not modify any global state or external variables.

**Validates: Requirements 12.1, 12.3**

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific example mappings (shot types, camera angles, studio setups)
- Edge cases (boundary values, empty strings, null handling)
- Error conditions (invalid hex codes, out-of-range angles)
- Integration between translators and prompt assembly

**Property-Based Tests** focus on:
- Universal properties across all valid inputs
- Range-based translations (focal lengths, intensities, apertures)
- Angle combinations (azimuth/elevation pairs)
- Color space coverage (random hex codes)
- Ordering guarantees (golden order compliance)

### Property-Based Testing Configuration

**Library**: Use `fast-check` for TypeScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: prompt-translation-layer, Property {N}: {description}`

**Example Test Structure**:
```typescript
// Feature: prompt-translation-layer, Property 1: Focal Length Range Translation
fc.assert(
  fc.property(
    fc.integer({ min: 8, max: 300 }), // Random focal length
    (focalLength) => {
      const result = translateFocalLength(`${focalLength}mm`);
      // Verify no numerical values in output
      expect(result).not.toMatch(/\d+mm/);
      // Verify contains perspective description
      expect(result).toMatch(/wide angle|standard|portrait|telephoto|fisheye/i);
    }
  ),
  { numRuns: 100 }
);
```

### Unit Test Coverage

**Translation Functions** (one test file per translator):
- `translateFocalLength.test.ts`: Test all focal length ranges and edge cases
- `translateLightDirection.test.ts`: Test azimuth/elevation combinations
- `translateColorHex.test.ts`: Test color families, saturation levels, edge cases
- `translateShotType.test.ts`: Test all shot type mappings for people and products
- `translateCameraAngle.test.ts`: Test all camera angle mappings
- `translateStudioSetup.test.ts`: Test all studio setup mappings
- `translateLightIntensity.test.ts`: Test all intensity ranges
- `translateAperture.test.ts`: Test all aperture ranges

**Integration Tests**:
- `promptAssembly.test.ts`: Test golden order, component integration, full PromptState translation
- `backwardCompatibility.test.ts`: Test legacy preset migration

### Testing Existing Presets

After implementation, all existing presets must be validated:

1. Load each preset from `presets.ts`
2. Translate using new translation layer
3. Verify output contains no technical parameters (numbers, hex codes)
4. Verify output follows golden order
5. Generate test images to visually verify correctness

### Error Handling Tests

**Graceful Degradation**:
- Invalid focal length strings → Return original or generic description
- Out-of-range angles → Clamp to valid range and translate
- Invalid hex codes → Return "neutral" or original value
- Unknown shot types → Return generic framing description
- Null/undefined inputs → Return empty string or default

**No Thrown Errors**:
- All translation functions must catch and handle errors internally
- No translation failure should crash the application
- Console warnings for debugging, but never throw exceptions
