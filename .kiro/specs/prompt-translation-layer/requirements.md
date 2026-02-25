# Requirements Document

## Introduction

The Nano Banana prompt generation system currently outputs physical parameters (numerical angles, hex color codes, focal lengths) that AI image generation models cannot interpret effectively. This specification defines requirements for a translation layer that converts technical parameters into visual descriptions that AI models can understand and execute accurately.

**Product Direction Change**: Nano Banana will focus on being a professional prompt generator tool. The Gemini API integration will be removed, and users will copy the optimized prompt to use with any AI image generation platform of their choice.

## Glossary

- **Physical_Parameter**: Numerical or technical values like angles (45°), hex codes (#FF5733), or focal lengths (200mm)
- **Visual_Description**: Human-readable descriptions of visual appearance like "side lighting with dimensional shadows" or "telephoto compression effect"
- **Translation_Layer**: The system component that converts Physical_Parameters to Visual_Descriptions
- **Prompt_Assembly**: The process of combining all Visual_Descriptions into a final prompt string
- **PromptState**: TypeScript interface containing all user-configured parameters
- **Golden_Order**: The optimal sequence for prompt components: [Composition + Subject] + [Action/State] + [Environment] + [Lighting/Mood] + [Style/Quality]

## Requirements

### Requirement 1: Lens Focal Length Translation

**User Story:** As a photographer using the app, I want my lens selections to be described visually, so that the AI generates images with the correct perspective and compression effects.

#### Acceptance Criteria

1. WHEN a focal length between 8-24mm is selected, THE Translation_Layer SHALL output "Wide angle lens, dynamic perspective, barrel distortion"
2. WHEN a focal length between 35-50mm is selected, THE Translation_Layer SHALL output "Natural human eye view, zero distortion, standard perspective"
3. WHEN a focal length between 85-135mm is selected, THE Translation_Layer SHALL output "Portrait lens, subtle compression, flattering perspective"
4. WHEN a focal length of 200mm or greater is selected, THE Translation_Layer SHALL output "Telephoto lens, strong compression effect, flattened background layers"
5. WHEN a fisheye lens (8mm) is selected, THE Translation_Layer SHALL output "Extreme fisheye distortion, 180-degree field of view, spherical warping"

### Requirement 2: Light Source Direction Translation

**User Story:** As a photographer configuring lighting, I want light angles to be described directionally, so that the AI understands where shadows and highlights should appear.

#### Acceptance Criteria

1. WHEN azimuth is 0° and elevation is 0-20°, THE Translation_Layer SHALL output "Front lighting, minimal shadows, flat appearance"
2. WHEN azimuth is 30-60° and elevation is 30-50°, THE Translation_Layer SHALL output "Side lighting from upper angle, dimensional shadows, sculptural quality"
3. WHEN azimuth is 90° and elevation is -10 to 10°, THE Translation_Layer SHALL output "Hard side lighting, split lighting effect, high contrast"
4. WHEN azimuth is 180° and elevation is 20-60°, THE Translation_Layer SHALL output "Backlit, rim lighting, silhouette effect, halo glow"
5. WHEN elevation is 70-90° regardless of azimuth, THE Translation_Layer SHALL output "Top-down lighting, overhead illumination, downward shadows"
6. WHEN elevation is -70 to -90° regardless of azimuth, THE Translation_Layer SHALL output "Upward lighting, dramatic underlighting, theatrical effect"

### Requirement 3: Color Hex Code Translation

**User Story:** As a photographer selecting light colors, I want hex codes to be translated into named colors with visual associations, so that the AI generates accurate color tones.

#### Acceptance Criteria

1. WHEN a hex color is provided, THE Translation_Layer SHALL convert it to a named color with visual association
2. WHEN the hex color is #FFFFFF or similar, THE Translation_Layer SHALL output "Pure white, neutral color temperature"
3. WHEN the hex color is warm (red/orange/yellow hues), THE Translation_Layer SHALL output the color name followed by "warm color temperature, like [visual reference]"
4. WHEN the hex color is cool (blue/cyan hues), THE Translation_Layer SHALL output the color name followed by "cool color temperature, like [visual reference]"
5. WHEN the hex color is saturated (high chroma), THE Translation_Layer SHALL include descriptors like "vivid", "intense", or "saturated"
6. WHEN the hex color is desaturated (low chroma), THE Translation_Layer SHALL include descriptors like "muted", "subtle", or "pastel"

### Requirement 4: Shot Type Translation

**User Story:** As a photographer selecting shot types, I want cinema abbreviations to be replaced with body-part descriptions, so that the AI understands framing without technical jargon.

#### Acceptance Criteria

1. WHEN shot type is "Macro Shot", THE Translation_Layer SHALL output "Extreme close-up, magnified details, shallow depth of field"
2. WHEN shot type is "Extreme Close-up / ECU", THE Translation_Layer SHALL output "Eyes and facial features only, intimate framing"
3. WHEN shot type is "Close-up / CU", THE Translation_Layer SHALL output "Face filling frame, from chin to forehead"
4. WHEN shot type is "Medium Close-up / MCU" or "Bust Shot", THE Translation_Layer SHALL output "Head and shoulders portrait, upper chest visible"
5. WHEN shot type is "Medium Shot / MS" or "Chest Shot", THE Translation_Layer SHALL output "Waist-up shot, torso and arms visible"
6. WHEN shot type is "Medium Long Shot / MLS" or "Knee Shot", THE Translation_Layer SHALL output "Three-quarter body shot, from knees up"
7. WHEN shot type is "Long Shot / LS" or "Full Body", THE Translation_Layer SHALL output "Full body shot, head to toe, showing shoes"
8. WHEN shot type is "Very Long Shot / VLS", THE Translation_Layer SHALL output "Full figure with surrounding environment, establishing shot"
9. WHEN shot type is "Extreme Long Shot / XLS", THE Translation_Layer SHALL output "Distant view, subject small in frame, vast environment"

### Requirement 5: Product Shot Type Translation

**User Story:** As a product photographer, I want product-specific shot types to be described with clear view angles, so that the AI generates correct product orientations.

#### Acceptance Criteria

1. WHEN subject type is product and shot type implies top-down view, THE Translation_Layer SHALL output "Flat lay, top-down view, knolling arrangement"
2. WHEN subject type is product and shot type implies front view, THE Translation_Layer SHALL output "Front view, straight-on perspective, centered composition"
3. WHEN subject type is product and shot type implies 45-degree angle, THE Translation_Layer SHALL output "Isometric view, 3/4 angle, dimensional perspective"
4. WHEN subject type is product and shot type implies side view, THE Translation_Layer SHALL output "Profile view, side angle, showing depth and form"

### Requirement 6: Camera Angle Translation

**User Story:** As a photographer configuring camera angles, I want angle selections to be described visually, so that the AI understands the viewpoint without numerical degrees.

#### Acceptance Criteria

1. WHEN camera angle is "Eye Level", THE Translation_Layer SHALL output "Eye-level perspective, neutral viewpoint, natural horizon"
2. WHEN camera angle is "High Angle", THE Translation_Layer SHALL output "High angle view, looking down, subject appears smaller"
3. WHEN camera angle is "Low Angle", THE Translation_Layer SHALL output "Low angle view, looking up, subject appears powerful"
4. WHEN camera angle is "Bird's Eye", THE Translation_Layer SHALL output "Bird's eye view, directly overhead, top-down perspective"
5. WHEN camera angle is "Worm's Eye", THE Translation_Layer SHALL output "Worm's eye view, extreme low angle, dramatic upward perspective"
6. WHEN camera roll is non-zero, THE Translation_Layer SHALL output "Dutch angle, canted frame, tilted horizon at [roll] degrees"

### Requirement 7: Prompt Assembly Order

**User Story:** As a system architect, I want prompts to follow the golden order, so that AI models prioritize the most important visual elements.

#### Acceptance Criteria

1. THE Prompt_Assembly SHALL place composition and subject descriptions first in the prompt
2. THE Prompt_Assembly SHALL place action or state descriptions second
3. THE Prompt_Assembly SHALL place environment and background descriptions third
4. THE Prompt_Assembly SHALL place lighting and mood descriptions fourth
5. THE Prompt_Assembly SHALL place style and quality tags last
6. THE Prompt_Assembly SHALL NOT separate camera parameters from composition (they must be integrated)

### Requirement 8: Studio Lighting Preset Translation

**User Story:** As a portrait photographer, I want studio lighting presets to be described with their visual characteristics, so that the AI generates correct lighting patterns.

#### Acceptance Criteria

1. WHEN studio setup is "Rembrandt", THE Translation_Layer SHALL output "Rembrandt lighting, triangle catchlight on cheek, dramatic chiaroscuro"
2. WHEN studio setup is "Butterfly", THE Translation_Layer SHALL output "Butterfly lighting, nose shadow, glamour beauty lighting"
3. WHEN studio setup is "Split", THE Translation_Layer SHALL output "Split lighting, half-lit face, high contrast, dramatic shadows"
4. WHEN studio setup is "Loop", THE Translation_Layer SHALL output "Loop lighting, small nose shadow, natural dimensional portrait"
5. WHEN studio setup is "Rim", THE Translation_Layer SHALL output "Rim lighting, backlit edge glow, silhouette effect, halo"
6. WHEN studio setup is "Clamshell", THE Translation_Layer SHALL output "Clamshell lighting, soft even illumination, minimal shadows"
7. WHEN studio setup is "High Key", THE Translation_Layer SHALL output "High-key lighting, bright overexposed background, clean airy feel"

### Requirement 9: Light Intensity Translation

**User Story:** As a photographer adjusting light intensity, I want intensity percentages to be described qualitatively, so that the AI understands the relative brightness.

#### Acceptance Criteria

1. WHEN light intensity is 0-20%, THE Translation_Layer SHALL output "Subtle [light_type], barely visible, ambient level"
2. WHEN light intensity is 21-40%, THE Translation_Layer SHALL output "Soft [light_type], gentle illumination, low contrast"
3. WHEN light intensity is 41-60%, THE Translation_Layer SHALL output "Moderate [light_type], balanced lighting, natural appearance"
4. WHEN light intensity is 61-80%, THE Translation_Layer SHALL output "Strong [light_type], prominent illumination, clear shadows"
5. WHEN light intensity is 81-100%, THE Translation_Layer SHALL output "Intense [light_type], powerful lighting, high contrast, dramatic"

### Requirement 10: Depth of Field Translation

**User Story:** As a photographer selecting aperture settings, I want f-stop values to be described by their visual effect, so that the AI generates correct background blur.

#### Acceptance Criteria

1. WHEN aperture is f/1.2 to f/2.0, THE Translation_Layer SHALL output "Extremely shallow depth of field, creamy bokeh, subject isolation"
2. WHEN aperture is f/2.8 to f/4.0, THE Translation_Layer SHALL output "Shallow depth of field, soft background blur, subject separation"
3. WHEN aperture is f/5.6 to f/8.0, THE Translation_Layer SHALL output "Moderate depth of field, balanced sharpness, natural focus falloff"
4. WHEN aperture is f/11 to f/16, THE Translation_Layer SHALL output "Deep depth of field, sharp foreground and background, landscape focus"
5. WHEN aperture is f/22 or higher, THE Translation_Layer SHALL output "Maximum depth of field, everything in focus, tack sharp throughout"

### Requirement 11: Backward Compatibility

**User Story:** As a user with existing presets, I want my saved configurations to continue working, so that I don't lose my custom setups.

#### Acceptance Criteria

1. THE Translation_Layer SHALL accept existing PromptState objects without modification
2. THE Translation_Layer SHALL NOT require changes to the PromptState TypeScript interface
3. THE Translation_Layer SHALL NOT break existing preset configurations
4. THE Translation_Layer SHALL maintain the current UI control structure (sliders, color pickers, dropdowns)
5. WHEN loading legacy presets, THE Translation_Layer SHALL translate old parameters to new descriptions

### Requirement 12: Translation Function Purity

**User Story:** As a developer maintaining the codebase, I want translation functions to be pure and testable, so that I can verify correctness and prevent bugs.

#### Acceptance Criteria

1. THE Translation_Layer SHALL implement all translation functions as pure functions (no side effects)
2. THE Translation_Layer SHALL accept input parameters and return string descriptions
3. THE Translation_Layer SHALL NOT modify global state
4. THE Translation_Layer SHALL NOT depend on external services or APIs
5. THE Translation_Layer SHALL be fully unit testable with deterministic outputs
