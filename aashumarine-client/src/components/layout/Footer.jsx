import { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerData } from '../../data/dummyData';
import { publicApi } from '../../services/publicApi';
import logo from '../../assets/images/Logo.avif';
import './Footer.css';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success' | 'error' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubscribeStatus(null);
    setSubscribeMessage('');

    try {
      await publicApi.subscribeNewsletter({ email });
      setSubscribeStatus('success');
      setSubscribeMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => {
        setSubscribeMessage('');
        setSubscribeStatus(null);
      }, 5000);
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage(error.message || 'Subscription failed. Please try again.');
      setTimeout(() => {
        setSubscribeMessage('');
        setSubscribeStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section company-info">
          <div className="footer-logo-container">
            <img src={logo} alt="Aashumarine Logo" className="footer-logo-image" />
            <h3 className="footer-logo">{footerData.company.name}</h3>
          </div>
          <p className="footer-tagline">{footerData.company.tagline}</p>
          <p className="footer-description">{footerData.company.description}</p>

          <div className="social-media">
            {/* <h4>Follow Us</h4>
            <div className="social-links">
              {footerData.socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={social.platform}
                >
                  <span className="social-icon"> <img src={social.icon} alt="" /> </span>
                </a>
              ))}
            </div> */}
          </div>
        </div>

        <div className="footer-section quick-links">
          <h4>Quick Links</h4>
          <ul>
            {footerData.quickLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h4>Contact Us</h4>
          <div className="contact-details">
  <p>
    <span className="contact-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </span>
    <span>{footerData.contact.address}</span>
  </p>
  <p>
    <span className="contact-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    </span>
    <a href={`tel:${footerData.contact.phone}`}>{footerData.contact.phone}</a>
  </p>
  <p>
    <span className="contact-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    </span>
    <a href={`mailto:${footerData.contact.email1}`}>{footerData.contact.email1}</a>
  </p>
  <p>
    <span className="contact-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    </span>
    <a href={`mailto:${footerData.contact.email2}`}>{footerData.contact.email2}</a>
  </p>
  <p>
    <span className="contact-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    </span>
    <span>{footerData.contact.hours}</span>
  </p>
</div>

        </div>

        <div className="footer-section newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to get updates on new products and offers</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {subscribeMessage && (
            <p
              className={`subscribe-message ${subscribeStatus}`}
              role="alert"
              aria-live="polite"
            >
              {subscribeMessage}
            </p>
          )}
        </div>
      </div>

      <div className="footer-map">
        <h4>Find Us</h4>
        <div className="map-container">
          <iframe
            src={footerData.mapEmbed}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Aashumarine Location"
          ></iframe>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{footerData.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
