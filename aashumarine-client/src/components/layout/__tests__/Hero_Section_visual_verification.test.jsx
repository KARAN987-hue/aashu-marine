import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Hero_Section from '../Hero_Section';

/**
 * Visual Verification Tests for Hero_Section Background Images
 * 
 * These tests verify that the background image functionality works correctly
 * for all BGimageNumber values (1-5) and that the component applies proper
 * CSS properties for background display and overlay.
 */

describe('Hero_Section - Background Images Visual Verification', () => {
  describe('Background Image Selection', () => {
    it('should display image 1 when BGimageNumber is 1', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image1.webp');
    });

    it('should display image 2 when BGimageNumber is 2', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={2} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image2.jpg');
    });

    it('should display image 3 when BGimageNumber is 3', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={3} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image3.jpg');
    });

    it('should display image 4 when BGimageNumber is 4', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={4} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image4.png');
    });

    it('should display image 5 when BGimageNumber is 5', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={5} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image5.jpg');
    });
  });

  describe('Default Behavior', () => {
    it('should default to image 1 when BGimageNumber is not provided', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image1.webp');
    });

    it('should default to image 1 when BGimageNumber is 0', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={0} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image1.webp');
    });

    it('should default to image 1 when BGimageNumber is 6', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={6} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image1.webp');
    });

    it('should default to image 1 when BGimageNumber is negative', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={-1} 
        />
      );
      const section = container.querySelector('.hero-section');
      expect(section.style.backgroundImage).toContain('hero-section-bg-image1.webp');
    });
  });

  describe('CSS Properties', () => {
    it('should have position relative for overlay support', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const section = container.querySelector('.hero-section');
      const styles = window.getComputedStyle(section);
      expect(styles.position).toBe('relative');
    });

    it('should have background-size cover', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const section = container.querySelector('.hero-section');
      const styles = window.getComputedStyle(section);
      expect(styles.backgroundSize).toBe('cover');
    });

    it('should have background-position center', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const section = container.querySelector('.hero-section');
      const styles = window.getComputedStyle(section);
      // 'center' can compute to either 'center center' or '50% 50%' depending on browser
      expect(['center center', '50% 50%']).toContain(styles.backgroundPosition);
    });

    it('should have background-repeat no-repeat', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const section = container.querySelector('.hero-section');
      const styles = window.getComputedStyle(section);
      expect(styles.backgroundRepeat).toBe('no-repeat');
    });
  });

  describe('Content Layering', () => {
    it('should have hero-content with position relative', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const content = container.querySelector('.hero-content');
      const styles = window.getComputedStyle(content);
      expect(styles.position).toBe('relative');
    });

    it('should have hero-content with z-index 2', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const content = container.querySelector('.hero-content');
      const styles = window.getComputedStyle(content);
      expect(styles.zIndex).toBe('2');
    });
  });

  describe('Backward Compatibility', () => {
    it('should still accept and render heading prop', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const heading = container.querySelector('.hero-heading');
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('Test Heading');
    });

    it('should still accept and render subheading prop', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      const subheading = container.querySelector('.hero-subheading');
      expect(subheading).toBeInTheDocument();
      expect(subheading.textContent).toBe('Test Subheading');
    });

    it('should maintain CSS class structure', () => {
      const { container } = render(
        <Hero_Section 
          heading="Test Heading" 
          subheading="Test Subheading" 
          BGimageNumber={1} 
        />
      );
      expect(container.querySelector('.hero-section')).toBeInTheDocument();
      expect(container.querySelector('.hero-content')).toBeInTheDocument();
      expect(container.querySelector('.hero-heading')).toBeInTheDocument();
      expect(container.querySelector('.hero-subheading')).toBeInTheDocument();
    });
  });
});
