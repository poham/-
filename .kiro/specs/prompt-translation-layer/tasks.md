# Implementation Plan: Prompt Translation Layer

## Overview

This implementation plan converts the prompt generation system from outputting technical parameters (angles, hex codes, focal lengths) to visual descriptions that AI models can interpret. The approach maintains backward compatibility by creating a translation layer between existing data structures and the final prompt output.

## Tasks

- [x] 1. Set up translation module structure and testing framework
  - Create `utils/visualTranslators.ts` file with base interfaces
  - Install and configure `fast-check` library for property-based testing
  - Create test file structure in `utils/__tests__/`
  - _Requirements: 12.1, 12.3_

- [x] 2. Implement focal length translator
  - [x] 2.1 Create `translateFocalLength()` function
    - Parse focal length from lens string (e.g., "50mm 標準")
    - Map focal length ranges to perspective descriptions
    - Handle edge cases (fisheye, extreme telephoto)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 2.2 Write property test for focal length translation
    - **Property 1: Focal Length Range Translation**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
  
  - [ ]* 2.3 Write unit tests for focal length edge cases
    - Test boundary values (8mm, 24mm, 50mm, 85mm, 200mm)
    - Test invalid inputs (empty string, no number)
    - _Requirements: 1.5_

- [x] 3. Implement light direction translator
  - [x] 3.1 Create `translateLightDirection()` function
    - Accept azimuth, elevation, and light type parameters
    - Map angle combinations to directional descriptions
    - Implement azimuth zones (front, side, back)
    - Implement elevation zones (overhead, eye-level, low)
    - Combine zones into descriptive phrases
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ]* 3.2 Write property test for light direction translation
    - **Property 2: Light Direction Angle Translation**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
  
  - [ ]* 3.3 Write unit tests for specific angle combinations
    - Test front lighting (azimuth 0°, elevation 0-20°)
    - Test side lighting (azimuth 45°, elevation 30-50°)
    - Test backlit (azimuth 180°, elevation 20-60°)
    - Test overhead (elevation 70-90°)
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 4. Implement color hex translator
  - [x] 4.1 Create `translateColorHex()` function
    - Parse hex color to RGB values
    - Convert RGB to HSL (hue, saturation, lightness)
    - Determine color family from hue angle
    - Determine intensity descriptors from saturation
    - Add visual references for common colors
    - Handle white/neutral colors specially
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 4.2 Write property test for color translation
    - **Property 3: Hex Color to Visual Description**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
  
  - [ ]* 4.3 Write unit tests for specific colors
    - Test white (#FFFFFF)
    - Test warm colors (red, orange, yellow)
    - Test cool colors (blue, cyan)
    - Test saturated vs desaturated colors
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 5. Checkpoint - Ensure core translators work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement shot type translator
  - [x] 6.1 Create `translateShotType()` function
    - Accept shot type and subject type parameters
    - Map shot types to body-part descriptions for people
    - Map shot types to view-angle descriptions for products
    - Handle all shot types from `SHOT_TYPES` constant
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 6.2 Write property test for product shot context awareness
    - **Property 4: Product Shot Context Awareness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
  
  - [ ]* 6.3 Write unit tests for all shot type mappings
    - Test all 9 shot types for people
    - Test product-specific translations
    - _Requirements: 4.1-4.9, 5.1-5.4_

- [x] 7. Implement camera angle translator
  - [x] 7.1 Create `translateCameraAngle()` function
    - Accept camera angle and roll parameters
    - Map angle selections to viewpoint descriptions
    - Handle Dutch angle for non-zero roll
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 7.2 Write property test for camera roll Dutch angle
    - **Property 5: Camera Roll Dutch Angle**
    - **Validates: Requirements 6.6**
  
  - [ ]* 7.3 Write unit tests for camera angle mappings
    - Test all camera angles from `CAMERA_ANGLE_TAGS`
    - Test roll values (0, positive, negative)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 8. Implement studio setup and intensity translators
  - [x] 8.1 Create `translateStudioSetup()` function
    - Map studio setup IDs to visual characteristic descriptions
    - Use descriptions from `STUDIO_SETUPS` constant
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [x] 8.2 Create `translateLightIntensity()` function
    - Map intensity percentages to qualitative descriptions
    - Include light type in description
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 8.3 Write property test for light intensity translation
    - **Property 8: Light Intensity Qualitative Description**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**
  
  - [ ]* 8.4 Write unit tests for studio setups
    - Test all 10 studio setups from `STUDIO_SETUPS`
    - _Requirements: 8.1-8.7_

- [x] 9. Implement aperture translator
  - [x] 9.1 Create `translateAperture()` function
    - Parse f-stop value from aperture string
    - Map aperture ranges to depth of field descriptions
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 9.2 Write property test for aperture translation
    - **Property 9: Aperture Depth of Field Description**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**
  
  - [ ]* 9.3 Write unit tests for aperture ranges
    - Test all aperture ranges (f/1.2 to f/22+)
    - Test boundary values
    - _Requirements: 10.1-10.5_

- [x] 10. Checkpoint - Ensure all translators complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement main translation orchestrator
  - [x] 11.1 Create `translatePromptState()` function
    - Accept full `PromptState` object
    - Call all individual translators
    - Return `TranslatedPromptComponents` interface
    - Handle errors gracefully with fallbacks
    - _Requirements: 11.1, 11.3, 11.5, 12.1_
  
  - [ ]* 11.2 Write property test for function purity
    - **Property 11: Translation Function Purity**
    - **Validates: Requirements 12.1, 12.3**

- [x] 12. Modify prompt assembly logic
  - [x] 12.1 Update `utils/promptAssembly.ts`
    - Import `translatePromptState()` function
    - Replace technical parameter output with translated descriptions
    - Implement golden order assembly
    - Integrate composition with camera parameters
    - Remove labeled sections (THEME, OPTICS, etc.)
    - Create flowing narrative structure
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 12.2 Write property test for golden order compliance
    - **Property 6: Prompt Golden Order Compliance**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  
  - [ ]* 12.3 Write property test for camera parameter integration
    - **Property 7: Camera Parameters Integration**
    - **Validates: Requirements 7.6**
  
  - [ ]* 12.4 Write integration tests for full prompt assembly
    - Test complete PromptState translation
    - Test with various category types
    - Test with and without optional fields
    - _Requirements: 7.1-7.6_

- [x] 13. Update lighting formatters
  - [x] 13.1 Modify `utils/lightingFormatters.ts`
    - Replace `formatLightSourceForPrompt()` to use translators
    - Update `formatLightingSection()` to use visual descriptions
    - Remove numerical angle output
    - Remove hex color output
    - _Requirements: 2.1-2.6, 3.1-3.6, 9.1-9.5_

- [x] 14. Backward compatibility testing
  - [x] 14.1 Create backward compatibility test suite
    - Load all presets from `presets.ts`
    - Translate each preset using new translation layer
    - Verify no errors occur
    - Verify output contains no technical parameters
    - Verify output follows golden order
    - _Requirements: 11.1, 11.3, 11.5_
  
  - [ ]* 14.2 Write property test for preset compatibility
    - **Property 10: Backward Compatibility with Existing Presets**
    - **Validates: Requirements 11.1, 11.3, 11.5**

- [x] 15. Update Protocol Deck display
  - [x] 15.1 Verify `ProtocolDeck.tsx` displays translated prompts
    - Test that live preview shows visual descriptions
    - Verify no technical parameters appear in UI
    - Ensure real-time updates work correctly
    - _Requirements: 7.1-7.6_

- [x] 16. Remove Gemini API integration
  - [x] 16.1 Remove Gemini API service
    - Delete `services/gemini.ts` file
    - Remove `@google/genai` dependency from package.json
    - Remove `GEMINI_API_KEY` from environment variables documentation
    - _Requirements: N/A (Product direction change)_
  
  - [x] 16.2 Update ShareSection component
    - Remove image generation UI elements
    - Remove `useImageGeneration` hook usage
    - Focus UI on prompt display and copy functionality
    - Add clear instructions for users to use prompt elsewhere
    - _Requirements: N/A (Product direction change)_
  
  - [x] 16.3 Remove useImageGeneration hook
    - Delete `hooks/useImageGeneration.ts` file
    - Remove all references to this hook in components
    - _Requirements: N/A (Product direction change)_
  
  - [x] 16.4 Update documentation
    - Add JSDoc comments to all translation functions
    - Document translation rules and mappings
    - Create examples of before/after prompts
    - Update product.md to reflect new positioning as prompt generator
    - _Requirements: 12.1_

- [x] 17. Final checkpoint - Complete implementation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, mappings, and edge cases
- The translation layer maintains backward compatibility with existing UI and data structures
- No changes required to React components or state management
