import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import OpticsSection from './OpticsSection';
import { OpticsConfig } from '../../types';

/**
 * Unit Tests for Light Rotation Logic
 * Feature: studio-lighting-system
 * Tests angle calculation, normalization, and drag event handling
 * Requirements: 5.6
 */

describe('OpticsSection - Light Rotation Logic', () => {
  const baseConfig: OpticsConfig = {
    dof: 'f/2.8',
    lightColor: '#ffffff',
    ambientColor: '#1a1a1a',
    lightIntensity: 80,
    lightRotation: 45,
    studioSetup: 'rembrandt',
    source: '',
    mood: '',
    useAdvancedLighting: true,
    fillLightColor: '#cbd5e1',
    fillLightIntensity: 30,
    rimLightColor: '#ffffff',
    rimLightIntensity: 50
  };

  const mockOnChange = vi.fn();
  const mockSetCustomTags = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockSetCustomTags.mockClear();
  });

  describe('Angle Calculation and Normalization', () => {
    it('should calculate 0° when mouse is at top center of controller', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      expect(controller).toBeTruthy();

      // Mock getBoundingClientRect to return a known position
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Simulate mouse down at top center (centerX: 188, centerY: 188, mouseX: 188, mouseY: 100)
      fireEvent.mouseDown(controller, {
        clientX: 188,
        clientY: 100,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBe(0);
      expect(call.studioSetup).toBe('manual');
    });

    it('should calculate 90° when mouse is at right center of controller', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Simulate mouse down at right center (centerX: 188, centerY: 188, mouseX: 276, mouseY: 188)
      fireEvent.mouseDown(controller, {
        clientX: 276,
        clientY: 188,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBe(90);
      expect(call.studioSetup).toBe('manual');
    });

    it('should calculate 180° when mouse is at bottom center of controller', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Simulate mouse down at bottom center (centerX: 188, centerY: 188, mouseX: 188, mouseY: 276)
      fireEvent.mouseDown(controller, {
        clientX: 188,
        clientY: 276,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBe(180);
      expect(call.studioSetup).toBe('manual');
    });

    it('should calculate 270° when mouse is at left center of controller', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Simulate mouse down at left center (centerX: 188, centerY: 188, mouseX: 100, mouseY: 188)
      fireEvent.mouseDown(controller, {
        clientX: 100,
        clientY: 188,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBe(270);
      expect(call.studioSetup).toBe('manual');
    });

    it('should calculate 45° when mouse is at top-right diagonal', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Simulate mouse down at 45° diagonal (centerX: 188, centerY: 188)
      // For 45°, we need equal deltaX and deltaY (positive X, negative Y)
      const centerX = 188;
      const centerY = 188;
      const offset = 50;
      
      fireEvent.mouseDown(controller, {
        clientX: centerX + offset,
        clientY: centerY - offset,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBe(45);
      expect(call.studioSetup).toBe('manual');
    });

    it('should normalize angle to 0-360 range', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Test various positions to ensure all angles are in 0-360 range
      const testPositions = [
        { x: 188, y: 100, expectedAngle: 0 },
        { x: 276, y: 188, expectedAngle: 90 },
        { x: 188, y: 276, expectedAngle: 180 },
        { x: 100, y: 188, expectedAngle: 270 },
      ];

      testPositions.forEach(({ x, y, expectedAngle }) => {
        mockOnChange.mockClear();
        fireEvent.mouseDown(controller, { clientX: x, clientY: y });
        
        const call = mockOnChange.mock.calls[0][0];
        expect(call.lightRotation).toBeGreaterThanOrEqual(0);
        expect(call.lightRotation).toBeLessThan(360);
        expect(call.lightRotation).toBe(expectedAngle);
      });
    });

    it('should round angle to nearest integer', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Position that would result in a non-integer angle
      fireEvent.mouseDown(controller, {
        clientX: 220,
        clientY: 150,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(Number.isInteger(call.lightRotation)).toBe(true);
    });
  });

  describe('Drag Event Handling', () => {
    it('should set studioSetup to "manual" when dragging', () => {
      const configWithPreset = { ...baseConfig, studioSetup: 'rembrandt' };
      const { container } = render(
        <OpticsSection 
          config={configWithPreset} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      fireEvent.mouseDown(controller, {
        clientX: 188,
        clientY: 100,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.studioSetup).toBe('manual');
    });

    it('should not trigger rotation when advanced lighting is disabled', () => {
      const disabledConfig = { ...baseConfig, useAdvancedLighting: false };
      const { container } = render(
        <OpticsSection 
          config={disabledConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      
      if (controller) {
        const mockRect = {
          left: 100,
          top: 100,
          width: 176,
          height: 176,
          right: 276,
          bottom: 276,
        } as DOMRect;
        
        vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

        fireEvent.mouseDown(controller, {
          clientX: 188,
          clientY: 100,
        });

        expect(mockOnChange).not.toHaveBeenCalled();
      }
    });

    it('should preserve other config properties when updating rotation', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      fireEvent.mouseDown(controller, {
        clientX: 276,
        clientY: 188,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      
      // Check that all other properties are preserved
      expect(call.lightColor).toBe(baseConfig.lightColor);
      expect(call.lightIntensity).toBe(baseConfig.lightIntensity);
      expect(call.fillLightColor).toBe(baseConfig.fillLightColor);
      expect(call.fillLightIntensity).toBe(baseConfig.fillLightIntensity);
      expect(call.rimLightColor).toBe(baseConfig.rimLightColor);
      expect(call.rimLightIntensity).toBe(baseConfig.rimLightIntensity);
      expect(call.ambientColor).toBe(baseConfig.ambientColor);
      expect(call.mood).toBe(baseConfig.mood);
      expect(call.useAdvancedLighting).toBe(baseConfig.useAdvancedLighting);
    });

    it('should call onChange immediately on mouse down', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Start drag - should immediately call onChange
      fireEvent.mouseDown(controller, {
        clientX: 188,
        clientY: 100,
      });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      const firstCall = mockOnChange.mock.calls[0][0];
      expect(firstCall.lightRotation).toBe(0);
      expect(firstCall.studioSetup).toBe('manual');
    });

    it('should stop tracking mouse movement after mouse up', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Start drag
      fireEvent.mouseDown(controller, {
        clientX: 188,
        clientY: 100,
      });

      // End drag
      fireEvent.mouseUp(window);

      // Clear mock to check if further moves trigger onChange
      mockOnChange.mockClear();

      // Try to move mouse after mouse up
      fireEvent.mouseMove(window, {
        clientX: 276,
        clientY: 188,
      });

      // Should not trigger onChange after mouse up
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle controller at origin (0, 0)', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 0,
        top: 0,
        width: 176,
        height: 176,
        right: 176,
        bottom: 176,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      fireEvent.mouseDown(controller, {
        clientX: 88,
        clientY: 0,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBeGreaterThanOrEqual(0);
      expect(call.lightRotation).toBeLessThan(360);
    });

    it('should handle very small controller size', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 10,
        height: 10,
        right: 110,
        bottom: 110,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      fireEvent.mouseDown(controller, {
        clientX: 105,
        clientY: 100,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      expect(call.lightRotation).toBeGreaterThanOrEqual(0);
      expect(call.lightRotation).toBeLessThan(360);
    });

    it('should handle mouse position exactly at center', () => {
      const { container } = render(
        <OpticsSection 
          config={baseConfig} 
          customTags={[]} 
          setCustomTags={mockSetCustomTags} 
          onChange={mockOnChange} 
        />
      );

      const controller = container.querySelector('.cursor-pointer') as HTMLElement;
      const mockRect = {
        left: 100,
        top: 100,
        width: 176,
        height: 176,
        right: 276,
        bottom: 276,
      } as DOMRect;
      
      vi.spyOn(controller, 'getBoundingClientRect').mockReturnValue(mockRect);

      // Mouse exactly at center (deltaX = 0, deltaY = 0)
      fireEvent.mouseDown(controller, {
        clientX: 188,
        clientY: 188,
      });

      expect(mockOnChange).toHaveBeenCalled();
      const call = mockOnChange.mock.calls[0][0];
      // When at center, atan2(0, 0) = 0, so normalized angle should be 90
      expect(call.lightRotation).toBe(90);
    });
  });
});
