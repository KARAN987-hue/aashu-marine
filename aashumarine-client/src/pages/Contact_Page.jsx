import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero_Section from '../components/layout/Hero_Section';
import Section_Container from '../components/layout/Section_Container';
import Contact_Form from '../components/forms/Contact_Form';
import ContactInfo from '../components/sections/ContactInfo';
import FAQ from '../components/sections/FAQ';
import MapEmbed from '../components/sections/MapEmbed';
import Footer from '../components/layout/Footer';
import { navItems } from '../data/dummyData';
import { publicApi } from '../services/publicApi';
import './Contact_Page.css';

const Contact_Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitMessage, setSubmitMessage] = useState('');

  const handleContactSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      await publicApi.submitLead(formData);
      setSubmitStatus('success');
      setSubmitMessage('Thank you for contacting us! We will get back to you soon.');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Navbar section */}
      <Navbar navItems={navItems} />
      
      {/* Hero section */}
      <Hero_Section 
      BGimageNumber={1}
        heading="CONTACT US"
        subheading="Get in touch with us for all your marine equipment needs"
      />
      
      {/* Main content wrapper */}
      <main id="main-content">
        {/* Two-column layout for Contact Info + Map (left) and Contact Form (right) */}
        <Section_Container>
          <div className="contact-two-column-layout">
            {/* Left Column: Contact Info and Map */}
            <div className="contact-left-column">
              <ContactInfo />
              <MapEmbed 
                latitude={40.7128}
                longitude={-74.0060}
                zoom={15}
                businessName="Aashu Marine Equipment"
              />
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-right-column">
              {submitStatus && (
                <div 
                  className={`submit-message ${submitStatus}`}
                  role="alert"
                  aria-live="polite"
                >
                  {submitMessage}
                </div>
              )}
              <Contact_Form 
                onSubmit={handleContactSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </Section_Container>

        {/* FAQ Section */}
        <Section_Container>
          <FAQ />
        </Section_Container>
      </main>
      
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Contact_Page;
