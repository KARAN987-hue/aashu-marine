import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero_Section from '../components/layout/Hero_Section';
import Section_Container from '../components/layout/Section_Container';
import Service_Card from '../components/cards/Service_Card';
import Product_Card from '../components/cards/Product_Card';
import Why_Us_Card from '../components/cards/Why_Us_Card';
import Testimonials_Section from '../components/sections/Testimonials_Section';
import Testimonial_Submission_Form from '../components/forms/Testimonial_Submission_Form';
import CounterSection from '../components/sections/CounterSection';
import Footer from '../components/layout/Footer';
import { publicApi } from '../services/publicApi';
import { productApi } from '../services/productApi';
import {
  navItems,
  services,
  whyUsReasons
} from '../data/dummyData';
import './Landing_Page.css';
import video1 from '../assets/images/bgvideo1.mp4'

// Company statistics for counter section
const companyStats = [
  {
    id: 'experience',
    label: 'Years of Experience',
    targetValue: 25,
    suffix: '+'
  },
  {
    id: 'customers',
    label: 'Satisfied Customers',
    targetValue: 500,
    suffix: '+'
  },
  {
    id: 'parts',
    label: 'Parts Delivered',
    targetValue: 10000,
    suffix: '+'
  },
  {
    id: 'ports',
    label: 'Global Ports Served',
    targetValue: 150,
    suffix: '+'
  }
];

const Landing_Page = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitMessage, setSubmitMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Fetch featured products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const data = await productApi.getAll({ limit: 6, page: 1 });
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Silently fail - just show empty products section
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch approved testimonials on mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      setTestimonialsLoading(true);
      try {
        const data = await publicApi.getApprovedTestimonials(10);
        // Map backend fields to frontend format
        const mappedTestimonials = (data.testimonials || []).map(testimonial => ({
          id: testimonial.id,
          name: testimonial.name,
          company: testimonial.company,
          text: testimonial.text, // Backend returns 'text' field
          rating: testimonial.rating,
        }));
        setTestimonials(mappedTestimonials);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Silently fail - show empty testimonials
        setTestimonials([]);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleTestimonialSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      await publicApi.submitTestimonial(formData);
      setSubmitStatus('success');
      setSubmitMessage('Thank you for your feedback! Your testimonial will be reviewed and published soon.');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Skip navigation link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Navbar section - Task 10.2 */}
      <Navbar navItems={navItems} />

      {/* Hero section - Task 10.3 */}
      <Hero_Section
        BGimageNumber={5}
        heading="WE ARE HERE TO KEEP YOU SAILING"
        subheading="Top Dealer for Ship Machinery & Spare Parts"
        heightFull={1}
      />

      {/* Main content wrapper */}
      <main id="main-content">
        {/* Services section - Task 10.4 */}
        <Section_Container
          heading="OUR SERVICES"
          subheading="Comprehensive marine equipment supply and support services for all your maritime needs"
        >
          <div className="cards-grid">
            {services.map((service) => (
              <Service_Card
                key={service.id}
                icon={service.icon}
                heading={service.heading}
                description={service.description}
              />
            ))}
          </div>
        </Section_Container>

        {/* Products section - Task 10.6 */}
        <Section_Container
          heading="OUR PRODUCTS"
          subheading="Featured marine equipment and machinery for your vessel needs"
        >
          {productsLoading ? (
            <div className="products-loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="cards-grid">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Product_Card
                      imageUrl={product.thumbnailUrl || product.imageUrl}
                      name={product.product_name}
                      engineType={product.category}
                      manufacturer={product.manufacturer}
                    />
                  </div>
                ))}
              </div>
              <div className="button-container">
                <button
                  className="view-all-products-btn"
                  onClick={handleViewAllProducts}
                  aria-label="View all products page"
                >
                  View all Products
                </button>
              </div>
            </>
          ) : (
            <div className="no-products">
              <p>No products available at the moment.</p>
            </div>
          )}
        </Section_Container>

        {/* Why Us section - Task 10.7 */}
        <Section_Container
          heading="WHY US?"
          subheading="Discover what makes us the preferred choice for marine equipment supply"
          bgVideo="true"
          videoSrc={video1}
        >
          <div className="cards-grid">
            {whyUsReasons.map((reason) => (
              <Why_Us_Card
                key={reason.id}
                icon={reason.icon}
                heading={reason.heading}
                description={reason.description}
              />
            ))}
          </div>
        </Section_Container>

        {/* Counter Section - Company Statistics */}
        <CounterSection
          counters={companyStats}
          animationDuration={2000}
        />

        {/* Testimonials section - Task 10.9 */}
        {testimonialsLoading ? (
          <div className="testimonials-loading">
            <div className="spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        ) : (
          <Testimonials_Section testimonials={testimonials} />
        )}

        {/* Testimonial Submission Section */}
        <Section_Container
          heading="SHARE YOUR EXPERIENCE"
          subheading="We value your feedback and would love to hear about your experience with our products and services"
        >
          <div className="testimonial-submission-container">
            {submitStatus && (
              <div
                className={`submit-message ${submitStatus}`}
                role="alert"
                aria-live="polite"
              >
                {submitMessage}
              </div>
            )}
            <Testimonial_Submission_Form
              onSubmit={handleTestimonialSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </Section_Container>
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Landing_Page;
