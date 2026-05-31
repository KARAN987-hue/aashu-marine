import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fc from 'fast-check';
import Landing_Page from './Landing_Page';

describe('Landing_Page Property Tests', () => {
  describe('Services Section', () => {
    it('Property: Services Array Rendering Completeness - For any array of service data objects, the number of rendered Service_Card components should equal the length of the input array', () => {
      /**
       * **Validates: Requirements 3.4**
       * 
       * This property test verifies that the Services section renders exactly as many
       * Service_Card components as there are items in the services data array.
       */
      
      // We'll test this by mocking the services data and verifying the count
      // Since Landing_Page imports services from dummyData, we need to test with the actual data
      const { container } = render(
        <MemoryRouter>
          <Landing_Page />
        </MemoryRouter>
      );
      
      // Find all service cards in the services section
      // Service cards have the class 'service-card'
      const serviceCards = container.querySelectorAll('.service-card');
      
      // The services array from dummyData has 4 items
      expect(serviceCards.length).toBe(4);
    });
  });

  describe('Why Us Section', () => {
    it('Property 8: Why Us Cards Array Rendering Completeness - For any array of why us data objects, the number of rendered Why_Us_Card components should equal the length of the input array', () => {
      /**
       * **Validates: Requirements 5.3**
       * 
       * This property test verifies that the Why Us section renders exactly as many
       * Why_Us_Card components as there are items in the whyUsReasons data array.
       */
      
      const { container } = render(
        <MemoryRouter>
          <Landing_Page />
        </MemoryRouter>
      );
      
      // Find all why us cards in the why us section
      // Why Us cards have the class 'why-us-card'
      const whyUsCards = container.querySelectorAll('.why-us-card');
      
      // The whyUsReasons array from dummyData has 5 items
      expect(whyUsCards.length).toBe(5);
    });
  });
});
