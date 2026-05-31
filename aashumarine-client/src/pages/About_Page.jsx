import Navbar from '../components/layout/Navbar';
import Hero_Section from '../components/layout/Hero_Section';
import Section_Container from '../components/layout/Section_Container';
import Footer from '../components/layout/Footer';
import AnimationWrapper from '../components/AnimationWrapper';
import LazyImage from '../components/LazyImage';
import { navItems } from '../data/dummyData';
import MarineImage1 from '../assets/images/MarineImage1.jpg';
import MarineImage2 from '../assets/images/MarineImage2.jpg';
import MarineImage3 from '../assets/images/MarineImage3.webp';
import './About_Page.css';

const About_Page = () => {
  return (
    <div className="about-page">
      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Navbar section */}
      <Navbar navItems={navItems} />
      
      {/* Hero section */}
      <Hero_Section 
        heading="ABOUT US"
        subheading="Your trusted partner in marine equipment supply and solutions"
        BGimageNumber={4}
      />
      
      {/* Main content wrapper */}
      <main id="main-content">
        <Section_Container>
          {/* Introduction Section */}
          <AnimationWrapper animationType="fade-in" duration={800} delay={0}>
            <div className="about-intro">
              <p>Welcome to Aashu Marine, your trusted partner in the maritime industry, situated in the vibrant coastal city of Bhavnagar, Gujarat. We take immense pride in our journey, characterized by a relentless pursuit of excellence and a commitment to delivering unmatched marine products and services.</p>
            </div>
          </AnimationWrapper>

          {/* Section 1: Diverse Product Range - Image Left */}
          <AnimationWrapper animationType="slide-right" duration={800} delay={200}>
            <div className="about-section about-section-image-left">
              <div className="about-section-image">
                <LazyImage src={MarineImage1} alt="Marine machinery and equipment" />
              </div>
              <div className="about-section-content">
                <h2>Diverse Product Range</h2>
                <p>Our extensive and diverse product catalog encompasses essential components of marine machinery and equipment. From engine and spare parts to power plant equipment, hydraulics, and various auxiliaries, our inventory caters to the evolving needs of the maritime sector.</p>
                <p>Our products are synonymous with quality, durability, and reliability. We offer specialized services including the supply of ship machinery spare parts, machined hub services, cross head services, and zig-zag machine ring services.</p>
              </div>
            </div>
          </AnimationWrapper>

          {/* Section 2: Quality & Service - Image Right */}
          <AnimationWrapper animationType="slide-left" duration={800} delay={400}>
            <div className="about-section about-section-image-right">
              <div className="about-section-content">
                <h2>Service Beyond Expectations</h2>
                <p>Beyond our exceptional product range, Aashu Marine is dedicated to providing unparalleled services. Our team of experts is equipped to address your unique requirements with precision and professionalism.</p>
                <p>We are not just a supplier; we are your maritime solutions partner. Our consultation and support services are designed to empower you with insights, guidance, and customized solutions tailored to the complexities of the maritime industry.</p>
              </div>
              <div className="about-section-image">
                <LazyImage src={MarineImage2} alt="Quality assurance and service excellence" />
              </div>
            </div>
          </AnimationWrapper>

          {/* Section 3: Customer-Centric Approach - Image Left */}
          <AnimationWrapper animationType="slide-right" duration={800} delay={600}>
            <div className="about-section about-section-image-left">
              <div className="about-section-image">
                <LazyImage src={MarineImage3} alt="Customer support and partnership" />
              </div>
              <div className="about-section-content">
                <h2>Customer-Centric Approach</h2>
                <p>Your success is our paramount concern. Aashu Marine's customer-centric approach places your unique needs at the forefront. We collaborate closely with you to craft solutions that align with your objectives, ensuring your vessels operate with peak efficiency and safety.</p>
                <p>From shipowners to offshore operators, our clients trust Aashu Marine for quality, reliability, and exceptional customer service. We are dedicated to forging lasting partnerships and delivering excellence across every voyage.</p>
              </div>
            </div>
          </AnimationWrapper>

          {/* Closing Statement */}
          <AnimationWrapper animationType="fade-in" duration={800} delay={800}>
            <div className="about-closing">
              <p>Whether you require marine machinery spare parts, machined hubs, or expert consultation, Aashu Marine is your unwavering partner on the high seas. Join us as we navigate the future of maritime excellence together.</p>
              <p className="about-tagline"><strong>Aashu Marine—Your Journey, Our Commitment to Excellence.</strong></p>
            </div>
          </AnimationWrapper>
        </Section_Container>
      </main>
      
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default About_Page;
