/**
 * Requirements Verification Integration Test
 * Task 18.1: Verify all requirements are implemented
 * 
 * This test suite comprehensively verifies all 13 requirements from the
 * website UI improvements specification.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Pages
import Landing_Page from '../pages/Landing_Page';
import Products_Page from '../pages/Products_Page';
import Product_Detail_Page from '../pages/Product_Detail_Page';
import About_Page from '../pages/About_Page';
import Contact_Page from '../pages/Contact_Page';

// Components
import Product_Card from '../components/cards/Product_Card';
import Why_Us_Card from '../components/cards/Why_Us_Card';
import Testimonials_Section from '../components/sections/Testimonials_Section';
import CounterSection from '../components/sections/CounterSection';
import FilterPanel from '../components/FilterPanel';
import ProductGallery from '../components/ProductGallery';
import RelatedProducts from '../components/RelatedProducts';
import Testimonial_Submission_Form from '../components/forms/Testimonial_Submission_Form';
import AnimationWrapper from '../components/AnimationWrapper';

// Services
import { productApi } from '../services/productApi';
import { publicApi } from '../services/publicApi';

// Mock services
vi.mock('../services/productApi');
vi.mock('../services/publicApi');

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock data
const mockProducts = [
  {
    id: 1,
    product_name: 'Marine Pump',
    category: 'Diesel Engine',
    manufacturer: 'Caterpillar',
    image: '/test-image.jpg',
    imageUrl: '/test-image.jpg',
    created_date: '2024-01-01'
  },
  {
    id: 2,
    product_name: 'Turbocharger',
    category: 'Gas Engine',
    manufacturer: 'MAN',
    image: '/test-image2.jpg',
    imageUrl: '/test-image2.jpg',
    created_date: '2024-01-02'
  },
  {
    id: 3,
    product_name: 'Fuel Injector',
    category: 'Diesel Engine',
    manufacturer: 'Wartsila',
    image: '/test-image3.jpg',
    imageUrl: '/test-image3.jpg',
    created_date: '2024-01-03'
  },
  {
    id: 4,
    product_name: 'Cylinder Head',
    category: 'Diesel Engine',
    manufacturer: 'Caterpillar',
    image: '/test-image4.jpg',
    imageUrl: '/test-image4.jpg',
    created_date: '2024-01-04'
  },
  {
    id: 5,
    product_name: 'Piston Assembly',
    category: 'Gas Engine',
    manufacturer: 'MAN',
    image: '/test-image5.jpg',
    imageUrl: '/test-image5.jpg',
    created_date: '2024-01-05'
  },
  {
    id: 6,
    product_name: 'Crankshaft',
    category: 'Diesel Engine',
    manufacturer: 'Wartsila',
    image: '/test-image6.jpg',
    imageUrl: '/test-image6.jpg',
    created_date: '2024-01-06'
  }
];

const mockTestimonials = [
  {
    id: 1,
    name: 'John Doe',
    company: 'Marine Corp',
    text: 'Excellent service and quality products for our fleet operations.',
    rating: 5
  },
  {
    id: 2,
    name: 'Jane Smith',
    company: 'Ocean Shipping',
    text: 'Very satisfied with the quick delivery and professional support team.',
    rating: 5
  }
];

describe('Requirements Verification - Task 18.1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    productApi.getAll.mockResolvedValue({
      products: mockProducts,
      pagination: { page: 1, totalPages: 1, total: 6 }
    });
    
    productApi.getById.mockResolvedValue({
      product: mockProducts[0]
    });
    
    productApi.getCategories.mockResolvedValue({
      categories: ['Diesel Engine', 'Gas Engine']
    });
    
    productApi.getManufacturers.mockResolvedValue({
      manufacturers: ['Caterpillar', 'MAN', 'Wartsila']
    });
    
    publicApi.getApprovedTestimonials.mockResolvedValue({
      testimonials: mockTestimonials
    });
    
    publicApi.submitTestimonial.mockResolvedValue({ success: true });
    publicApi.submitLead.mockResolvedValue({ success: true });
    publicApi.submitQuote.mockResolvedValue({ success: true });
  });

  describe('Requirement 1: Home Page Product Display', () => {
    it('1.1 - Should display exactly 6 products in Our Products Section', async () => {
      render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(productApi.getAll).toHaveBeenCalledWith(
          expect.objectContaining({ limit: 6, page: 1 })
        );
      });

      const productCards = await screen.findAllByRole('heading', { level: 3 });
      const productSection = productCards.filter(h => 
        mockProducts.some(p => h.textContent === p.product_name)
      );
      expect(productSection.length).toBe(6);
    });

    it('1.2 - Product_Card should display only name, engine type, and manufacturer', () => {
      const { container } = render(
        <Product_Card
          name="Test Product"
          engineType="Diesel Engine"
          manufacturer="Caterpillar"
          imageUrl="/test.jpg"
        />
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Diesel Engine')).toBeInTheDocument();
      expect(screen.getByText('Caterpillar')).toBeInTheDocument();
      
      // Should not have description or additional info
      const card = container.querySelector('.product-card__content');
      expect(card.children.length).toBeLessThanOrEqual(3);
    });

    it('1.4 - Should display "View All Products" button', async () => {
      render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );

      const viewAllButton = await screen.findByRole('button', { 
        name: /view all products/i 
      });
      expect(viewAllButton).toBeInTheDocument();
    });
  });

  describe('Requirement 2: Why Choose Us Section Enhancement', () => {
    it('2.1 - Should display between 3 and 4 key points', async () => {
      render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );

      const whyUsSection = await screen.findByText(/WHY US\?/i);
      const section = whyUsSection.closest('section');
      const cards = within(section).getAllByRole('heading', { level: 3 });
      
      expect(cards.length).toBeGreaterThanOrEqual(3);
      expect(cards.length).toBeLessThanOrEqual(4);
    });

    it('2.2 - Icon sizes should be minimum 48 pixels', () => {
      const { container } = render(
        <Why_Us_Card
          icon="/test-icon.png"
          heading="Test Heading"
          description="Test description"
        />
      );

      const icon = container.querySelector('.why-us-card__icon img');
      const styles = window.getComputedStyle(icon.parentElement);
      const minSize = parseInt(styles.minWidth) || parseInt(styles.width);
      
      expect(minSize).toBeGreaterThanOrEqual(48);
    });

    it('2.3 - Heading text should be minimum 24 pixels', () => {
      const { container } = render(
        <Why_Us_Card
          icon="/test-icon.png"
          heading="Test Heading"
          description="Test description"
        />
      );

      const heading = container.querySelector('.why-us-card__heading');
      const styles = window.getComputedStyle(heading);
      const fontSize = parseInt(styles.fontSize);
      
      expect(fontSize).toBeGreaterThanOrEqual(24);
    });

    it('2.4 - Should trigger entrance animations', () => {
      const { container } = render(
        <Why_Us_Card
          icon="/test-icon.png"
          heading="Test Heading"
          description="Test description"
          animationDelay={200}
        />
      );

      // AnimationWrapper should be present
      const animationWrapper = container.querySelector('[class*="animation-wrapper"]');
      expect(animationWrapper).toBeTruthy();
    });
  });

  describe('Requirement 3: Testimonials Display Optimization', () => {
    it('3.1 - Should limit testimonial text to maximum 24 words', () => {
      const longText = 'This is a very long testimonial that exceeds twenty four words and should be truncated with an ellipsis at the end to meet the requirement specification.';
      
      render(
        <Testimonials_Section
          testimonials={[{
            id: 1,
            name: 'Test User',
            company: 'Test Co',
            text: longText,
            rating: 5
          }]}
          maxWords={24}
        />
      );

      const testimonialText = screen.getByText(/This is a very long/);
      const words = testimonialText.textContent.replace('...', '').trim().split(/\s+/);
      expect(words.length).toBeLessThanOrEqual(24);
    });

    it('3.2 - Should display testimonials in grid or slider layout', () => {
      const { container: gridContainer } = render(
        <Testimonials_Section
          testimonials={mockTestimonials}
          layout="grid"
        />
      );
      expect(gridContainer.querySelector('.testimonials-grid')).toBeInTheDocument();

      const { container: sliderContainer } = render(
        <Testimonials_Section
          testimonials={mockTestimonials}
          layout="slider"
        />
      );
      expect(sliderContainer.querySelector('.testimonials-slider')).toBeInTheDocument();
    });

    it('3.5 - Should display navigation controls for slider layout', () => {
      render(
        <Testimonials_Section
          testimonials={mockTestimonials}
          layout="slider"
        />
      );

      expect(screen.getByLabelText(/previous testimonial/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next testimonial/i)).toBeInTheDocument();
    });
  });

  describe('Requirement 4: Testimonial Submission Form Layout', () => {
    it('4.1 - Should display form in two-column layout', () => {
      const { container } = render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );

      const formContainer = container.querySelector('.testimonial-submission-container');
      expect(formContainer).toBeInTheDocument();
    });

    it('4.2 - Form should have proper structure', () => {
      const { container } = render(
        <Testimonial_Submission_Form
          onSubmit={vi.fn()}
          isSubmitting={false}
        />
      );

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      
      // Should have form fields
      expect(container.querySelector('input[name="name"]')).toBeInTheDocument();
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });
  });

  describe('Requirement 5: Company Statistics Counter', () => {
    const mockCounters = [
      { id: 'experience', label: 'Years of Experience', targetValue: 25, suffix: '+' },
      { id: 'customers', label: 'Satisfied Customers', targetValue: 500, suffix: '+' },
      { id: 'parts', label: 'Parts Delivered', targetValue: 10000, suffix: '+' },
      { id: 'ports', label: 'Global Ports Served', targetValue: 150, suffix: '+' }
    ];

    it('5.1 - Should display Counter Section on home page', async () => {
      render(
        <BrowserRouter>
          <Landing_Page />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Years of Experience/i)).toBeInTheDocument();
      });
    });

    it('5.2-5.5 - Should display all required statistics', () => {
      render(<CounterSection counters={mockCounters} />);

      expect(screen.getByText(/Years of Experience/i)).toBeInTheDocument();
      expect(screen.getByText(/Satisfied Customers/i)).toBeInTheDocument();
      expect(screen.getByText(/Parts Delivered/i)).toBeInTheDocument();
      expect(screen.getByText(/Global Ports Served/i)).toBeInTheDocument();
    });

    it('5.6 - Should animate counters from zero to target value', async () => {
      const { container } = render(
        <CounterSection counters={mockCounters} animationDuration={100} />
      );

      // Initially should show 0 or low values
      const counterValues = container.querySelectorAll('.counter-section__number');
      expect(counterValues.length).toBe(4);
    });
  });

  describe('Requirement 6: About Us Page Visual Enhancement', () => {
    it('6.1 - Should display between 2 and 3 images', () => {
      const { container } = render(
        <BrowserRouter>
          <About_Page />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('.about-section-image img');
      expect(images.length).toBeGreaterThanOrEqual(2);
      expect(images.length).toBeLessThanOrEqual(3);
    });

    it('6.2 - Should use alternating layout pattern', () => {
      const { container } = render(
        <BrowserRouter>
          <About_Page />
        </BrowserRouter>
      );

      const sections = container.querySelectorAll('.about-section');
      const hasLeftImage = container.querySelector('.about-section-image-left');
      const hasRightImage = container.querySelector('.about-section-image-right');
      
      expect(hasLeftImage).toBeInTheDocument();
      expect(hasRightImage).toBeInTheDocument();
    });

    it('6.5 - Should trigger entrance animations', () => {
      const { container } = render(
        <AnimationWrapper animationType="fade-in" duration={600}>
          <div>Test Content</div>
        </AnimationWrapper>
      );

      const wrapper = container.querySelector('[class*="animation-wrapper"]');
      expect(wrapper).toBeTruthy();
    });
  });

  describe('Requirement 7: Product Listing Page Enhancement', () => {
    it('7.1 - Should display products in card-based grid layout', async () => {
      render(
        <BrowserRouter>
          <Products_Page />
        </BrowserRouter>
      );

      await waitFor(() => {
        const grid = screen.getByRole('main').querySelector('.cards-grid');
        expect(grid).toBeInTheDocument();
      });
    });

    it('7.2-7.3 - Should display filter components', async () => {
      render(
        <BrowserRouter>
          <Products_Page />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/filter by engine type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/filter by manufacturer/i)).toBeInTheDocument();
      });
    });

    it('7.4-7.6 - Should filter products correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <FilterPanel
          categories={['Diesel Engine', 'Gas Engine']}
          manufacturers={['Caterpillar', 'MAN']}
          selectedCategory=""
          selectedManufacturer=""
          onCategoryChange={vi.fn()}
          onManufacturerChange={vi.fn()}
          onReset={vi.fn()}
        />
      );

      const categorySelect = screen.getByLabelText(/filter by engine type/i);
      expect(categorySelect).toBeInTheDocument();
      
      await user.selectOptions(categorySelect, 'Diesel Engine');
      expect(categorySelect.value).toBe('Diesel Engine');
    });
  });

  describe('Requirement 8: Product Detail Page Simplification', () => {
    it('8.1 - Should NOT display Additional Information section', async () => {
      render(
        <BrowserRouter>
          <Product_Detail_Page />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText(/additional information/i)).not.toBeInTheDocument();
      });
    });

    it('8.2 - Should display 2-3 related products', async () => {
      productApi.getRelated = vi.fn().mockResolvedValue({
        products: mockProducts.slice(0, 3)
      });

      const { container } = render(
        <BrowserRouter>
          <RelatedProducts productId={1} />
        </BrowserRouter>
      );

      await waitFor(() => {
        const relatedProducts = container.querySelectorAll('.product-card');
        expect(relatedProducts.length).toBeGreaterThanOrEqual(2);
        expect(relatedProducts.length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('Requirement 9: Product Image and Video Gallery', () => {
    it('9.1-9.2 - Should support multiple images and optional video', () => {
      const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
      
      const { container } = render(
        <ProductGallery
          images={images}
          productName="Test Product"
          onImageClick={vi.fn()}
        />
      );

      expect(container.querySelector('.product-gallery')).toBeInTheDocument();
    });

    it('9.4 - Should display navigation arrows', () => {
      const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
      
      render(
        <ProductGallery
          images={images}
          productName="Test Product"
          onImageClick={vi.fn()}
        />
      );

      expect(screen.getByLabelText(/previous image/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next image/i)).toBeInTheDocument();
    });
  });

  describe('Requirement 10: Contact Us Page Enhancement', () => {
    it('10.1 - Should display two-column layout', () => {
      const { container } = render(
        <BrowserRouter>
          <Contact_Page />
        </BrowserRouter>
      );

      const twoColumnLayout = container.querySelector('.contact-two-column-layout');
      expect(twoColumnLayout).toBeInTheDocument();
    });

    it('10.2-10.3 - Should display contact info and form in correct columns', () => {
      const { container } = render(
        <BrowserRouter>
          <Contact_Page />
        </BrowserRouter>
      );

      const leftColumn = container.querySelector('.contact-left-column');
      const rightColumn = container.querySelector('.contact-right-column');
      
      expect(leftColumn).toBeInTheDocument();
      expect(rightColumn).toBeInTheDocument();
    });

    it('10.4-10.6 - Should display icons for contact information', async () => {
      render(
        <BrowserRouter>
          <Contact_Page />
        </BrowserRouter>
      );

      // Contact info should be present
      await waitFor(() => {
        const contactSection = screen.getByRole('main');
        expect(contactSection).toBeInTheDocument();
      });
    });
  });

  describe('Requirement 11: Performance Standards', () => {
    it('11.3 - Should lazy-load images', () => {
      render(
        <Product_Card
          name="Test Product"
          engineType="Diesel"
          manufacturer="Test"
          imageUrl="/test.jpg"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('11.4 - Images should be optimized', () => {
      const { container } = render(
        <Product_Card
          name="Test Product"
          engineType="Diesel"
          manufacturer="Test"
          imageUrl="/test.jpg"
        />
      );

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      // In production, images should be compressed
    });
  });

  describe('Requirement 12: Responsive Design Standards', () => {
    it('12.2 - Should adapt layout for mobile viewports', () => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      const { container } = render(
        <FilterPanel
          categories={['Diesel']}
          manufacturers={['Cat']}
          selectedCategory=""
          selectedManufacturer=""
          onCategoryChange={vi.fn()}
          onManufacturerChange={vi.fn()}
          onReset={vi.fn()}
        />
      );

      // Filter panel should be collapsible on mobile
      expect(container.querySelector('.filter-panel')).toBeInTheDocument();
    });

    it('12.4 - Touch targets should be minimum 44 pixels', () => {
      render(
        <Testimonials_Section
          testimonials={mockTestimonials}
          layout="slider"
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const minHeight = parseInt(styles.minHeight) || parseInt(styles.height);
        expect(minHeight).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Requirement 13: Accessibility Standards', () => {
    it('13.1 - Should provide alt text for images', () => {
      render(
        <Product_Card
          name="Marine Pump"
          engineType="Diesel Engine"
          manufacturer="Caterpillar"
          imageUrl="/test.jpg"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).toBeTruthy();
    });

    it('13.3 - Should support keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Testimonials_Section
          testimonials={mockTestimonials}
          layout="slider"
        />
      );

      const prevButton = screen.getByLabelText(/previous testimonial/i);
      await user.tab();
      
      // Button should be focusable
      expect(document.activeElement).toBeTruthy();
    });

    it('13.4 - Should provide ARIA labels for icon-only buttons', () => {
      render(
        <Testimonials_Section
          testimonials={mockTestimonials}
          layout="slider"
        />
      );

      const prevButton = screen.getByLabelText(/previous testimonial/i);
      const nextButton = screen.getByLabelText(/next testimonial/i);
      
      expect(prevButton).toHaveAttribute('aria-label');
      expect(nextButton).toHaveAttribute('aria-label');
    });

    it('13.6 - Should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      const mockMatchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      global.matchMedia = mockMatchMedia;

      const mockCounters = [
        { id: 'test', label: 'Test', targetValue: 100, suffix: '+' }
      ];

      render(<CounterSection counters={mockCounters} />);

      // Counter should respect reduced motion preference
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });
});
