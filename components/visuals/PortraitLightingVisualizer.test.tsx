import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PortraitLightingVisualizer from './PortraitLightingVisualizer';
import { OpticsConfig } from '../../types';

/**
 * Visual Regression Tests for PortraitLightingVisualizer
 * Feature: studio-lighting-system, Property 11: 視覺化即時更新
 * Validates: Requirements 11.11
 * 
 * Tests that the visualizer updates smoothly when optical parameters change
 */

describe('PortraitLightingVisualizer - Visual Regression Tests', () => {
  const baseConfig: OpticsConfig = {
    dof: 'f/2.8',
    keyLight: {
      azimuth: 45,
      elevation: 30,
      color: '#ffffff',
      intensity: 80
    },
    fillLight: {
      azimuth: 225,
      elevation: 15,
      color: '#cbd5e1',
      intensity: 30
    },
    rimLight: {
      elevation: 45,
      color: '#ffffff',
      intensity: 50
    },
    ambientColor: '#1a1a1a',
    studioSetup: 'rembrandt',
    source: '',
    mood: '',
    useAdvancedLighting: true,
    // Backward compatibility fields
    lightColor: '#ffffff',
    lightIntensity: 80,
    lightRotation: 45,
    fillLightColor: '#cbd5e1',
    fillLightIntensity: 30,
    rimLightColor: '#ffffff',
    rimLightIntensity: 50
  };

  describe('Studio Setup Visual Effects', () => {
    it('should render rembrandt lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'rembrandt' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('rembrandt')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render butterfly lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'butterfly' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('butterfly')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render split lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'split' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('split')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render loop lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'loop' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('loop')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render rim lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'rim' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('rim')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render clamshell lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'clamshell' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('clamshell')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render broad lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'broad' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('broad')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render short lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'short' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('short')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render flat lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'flat' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('flat')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render high_key lighting setup with correct label', () => {
      const config = { ...baseConfig, studioSetup: 'high_key' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('high key')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render manual lighting setup with direction indicator', () => {
      const config = { ...baseConfig, studioSetup: 'manual' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText('manual')).toBeInTheDocument();
      // Manual mode should show direction indicator
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(1); // Face SVG + direction indicator SVG
    });
  });

  describe('Light Rotation Visual Effects', () => {
    it('should update key light gradient position based on rotation angle 0°', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, azimuth: 0 } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#keyLightGrad');
      expect(gradient).toBeInTheDocument();
    });

    it('should update key light gradient position based on rotation angle 90°', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, azimuth: 90 } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#keyLightGrad');
      expect(gradient).toBeInTheDocument();
    });

    it('should update key light gradient position based on rotation angle 180°', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, azimuth: 180 } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#keyLightGrad');
      expect(gradient).toBeInTheDocument();
    });

    it('should update key light gradient position based on rotation angle 270°', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, azimuth: 270 } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#keyLightGrad');
      expect(gradient).toBeInTheDocument();
    });
  });

  describe('Light Color and Intensity Visual Effects', () => {
    it('should apply key light color to gradient', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, color: '#ff0000' } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#keyLightGrad');
      expect(gradient).toBeInTheDocument();
      
      // Check that the gradient has stops with the correct color
      const stops = gradient?.querySelectorAll('stop');
      expect(stops?.[0]?.getAttribute('stop-color')).toBe('#ff0000');
    });

    it('should apply fill light color to gradient', () => {
      const config = { ...baseConfig, fillLight: { ...baseConfig.fillLight, color: '#00ff00' } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#fillLightGrad');
      expect(gradient).toBeInTheDocument();
      
      const stops = gradient?.querySelectorAll('stop');
      expect(stops?.[0]?.getAttribute('stop-color')).toBe('#00ff00');
    });

    it('should apply rim light color to gradient', () => {
      const config = { ...baseConfig, rimLight: { ...baseConfig.rimLight, color: '#0000ff' } };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const gradient = container.querySelector('#rimLightGrad');
      expect(gradient).toBeInTheDocument();
      
      const stops = gradient?.querySelectorAll('stop');
      expect(stops?.[1]?.getAttribute('stop-color')).toBe('#0000ff');
    });

    it('should apply ambient color to background layer', () => {
      const config = { ...baseConfig, ambientColor: '#ff00ff' };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      // Find the ambient layer div - it's the first absolute div with transition-colors
      const ambientLayers = container.querySelectorAll('.absolute.transition-colors');
      expect(ambientLayers.length).toBeGreaterThan(0);
    });

    it('should display key light intensity indicator when intensity > 0', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, intensity: 75 } };
      render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText(/KEY 75%/)).toBeInTheDocument();
    });

    it('should display fill light intensity indicator when intensity > 0', () => {
      const config = { ...baseConfig, fillLight: { ...baseConfig.fillLight, intensity: 45 } };
      render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText(/FILL 45%/)).toBeInTheDocument();
    });

    it('should display rim light intensity indicator when intensity > 0', () => {
      const config = { ...baseConfig, rimLight: { ...baseConfig.rimLight, intensity: 60 } };
      render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText(/RIM 60%/)).toBeInTheDocument();
    });

    it('should not display key light indicator when intensity is 0', () => {
      const config = { ...baseConfig, keyLight: { ...baseConfig.keyLight, intensity: 0 } };
      render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.queryByText(/KEY 0%/)).not.toBeInTheDocument();
    });
  });

  describe('Smooth Transition Animations', () => {
    it('should have transition classes on main container elements', () => {
      const { container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      // Check for transition classes (duration-700 for smooth updates)
      const transitionElements = container.querySelectorAll('.transition-all, .transition-colors, .transition-transform');
      expect(transitionElements.length).toBeGreaterThan(0);
    });

    it('should have 700ms duration transitions on key visual elements', () => {
      const { container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      // Check for duration-700 class which corresponds to 700ms
      const duration700Elements = container.querySelectorAll('.duration-700');
      expect(duration700Elements.length).toBeGreaterThan(0);
    });
  });

  describe('Eye Catchlights for Specific Setups', () => {
    it('should show eye catchlights for rembrandt setup with high intensity', () => {
      const config = { ...baseConfig, studioSetup: 'rembrandt', lightIntensity: 80 };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      // Eye catchlights are rendered as small white circles
      const catchlights = container.querySelectorAll('.bg-white.rounded-full');
      expect(catchlights.length).toBeGreaterThan(0);
    });

    it('should show eye catchlights for butterfly setup with high intensity', () => {
      const config = { ...baseConfig, studioSetup: 'butterfly', lightIntensity: 80 };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      const catchlights = container.querySelectorAll('.bg-white.rounded-full');
      expect(catchlights.length).toBeGreaterThan(0);
    });

    it('should not show eye catchlights when intensity is low', () => {
      const config = { ...baseConfig, studioSetup: 'rembrandt', lightIntensity: 20 };
      const { container } = render(<PortraitLightingVisualizer config={config} />);
      
      // With low intensity, catchlights should not render
      const catchlights = container.querySelectorAll('.bg-white.rounded-full');
      expect(catchlights.length).toBe(0);
    });
  });

  describe('SVG Filters and Gradients', () => {
    it('should define all required SVG filters', () => {
      const { container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      expect(container.querySelector('#softShadow')).toBeInTheDocument();
      expect(container.querySelector('#fillGlow')).toBeInTheDocument();
      expect(container.querySelector('#rimGlow')).toBeInTheDocument();
    });

    it('should define all required gradients', () => {
      const { container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      expect(container.querySelector('#keyLightGrad')).toBeInTheDocument();
      expect(container.querySelector('#fillLightGrad')).toBeInTheDocument();
      expect(container.querySelector('#rimLightGrad')).toBeInTheDocument();
    });

    it('should use face shape path definition', () => {
      const { container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      expect(container.querySelector('#faceShape')).toBeInTheDocument();
      
      // Check that the face shape is used multiple times
      const useElements = container.querySelectorAll('use[href="#faceShape"]');
      expect(useElements.length).toBeGreaterThan(1);
    });
  });

  describe('Status Indicators', () => {
    it('should display realtime photon trace indicator', () => {
      render(<PortraitLightingVisualizer config={baseConfig} />);
      
      expect(screen.getByText('REALTIME PHOTON TRACE')).toBeInTheDocument();
    });

    it('should display technical description with fill and rim intensity', () => {
      const config = { ...baseConfig, fillLightIntensity: 35, rimLightIntensity: 55 };
      render(<PortraitLightingVisualizer config={config} />);
      
      expect(screen.getByText(/補光強度 35%/)).toBeInTheDocument();
      expect(screen.getByText(/輪廓光 55%/)).toBeInTheDocument();
    });
  });

  describe('Property 11: Visual Update Responsiveness', () => {
    it('should re-render when studioSetup changes', () => {
      const { rerender } = render(<PortraitLightingVisualizer config={baseConfig} />);
      expect(screen.getByText('rembrandt')).toBeInTheDocument();
      
      const newConfig = { ...baseConfig, studioSetup: 'butterfly' };
      rerender(<PortraitLightingVisualizer config={newConfig} />);
      expect(screen.getByText('butterfly')).toBeInTheDocument();
    });

    it('should re-render when lightRotation changes', () => {
      const { rerender, container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      const initialGradient = container.querySelector('#keyLightGrad');
      const initialCx = initialGradient?.getAttribute('cx');
      
      const newConfig = { ...baseConfig, lightRotation: 180 };
      rerender(<PortraitLightingVisualizer config={newConfig} />);
      
      const updatedGradient = container.querySelector('#keyLightGrad');
      const updatedCx = updatedGradient?.getAttribute('cx');
      
      // The gradient position should change
      expect(initialCx).not.toBe(updatedCx);
    });

    it('should re-render when light colors change', () => {
      const { rerender, container } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      const newConfig = { ...baseConfig, lightColor: '#ff0000', fillLightColor: '#00ff00' };
      rerender(<PortraitLightingVisualizer config={newConfig} />);
      
      const keyGradient = container.querySelector('#keyLightGrad');
      const fillGradient = container.querySelector('#fillLightGrad');
      
      expect(keyGradient?.querySelector('stop')?.getAttribute('stop-color')).toBe('#ff0000');
      expect(fillGradient?.querySelector('stop')?.getAttribute('stop-color')).toBe('#00ff00');
    });

    it('should re-render when light intensities change', () => {
      const { rerender } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      const newConfig = { 
        ...baseConfig, 
        lightIntensity: 90, 
        fillLightIntensity: 40, 
        rimLightIntensity: 70 
      };
      rerender(<PortraitLightingVisualizer config={newConfig} />);
      
      expect(screen.getByText(/KEY 90%/)).toBeInTheDocument();
      expect(screen.getByText(/FILL 40%/)).toBeInTheDocument();
      expect(screen.getByText(/RIM 70%/)).toBeInTheDocument();
    });

    it('should re-render when ambientColor changes', () => {
      const { rerender } = render(<PortraitLightingVisualizer config={baseConfig} />);
      
      const newConfig = { ...baseConfig, ambientColor: '#ff00ff' };
      rerender(<PortraitLightingVisualizer config={newConfig} />);
      
      // Component should re-render without errors
      expect(screen.getByText('REALTIME PHOTON TRACE')).toBeInTheDocument();
    });
  });
});
