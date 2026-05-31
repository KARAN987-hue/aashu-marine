import './ContactInfo.css';

const ContactInfo = () => {
  return (
    <div className="contact-info">
      {/* Business Hours Section */}
      <div className="info-section">
        <h2 className="info-heading">Business Hours</h2>
        <div className="info-content">
          <div className="hours-row">
            <span className="day">Monday - Friday</span>
            <span className="time">9:00 AM - 6:00 PM</span>
          </div>
          <div className="hours-row">
            <span className="day">Saturday</span>
            <span className="time">10:00 AM - 4:00 PM</span>
          </div>
          <div className="hours-row">
            <span className="day">Sunday</span>
            <span className="time">Closed</span>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="info-section">
        <div className="info-icon-header">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h2 className="info-heading">Our Location</h2>
        </div>
        <div className="info-content">
          <address className="business-address">
            Revenue Survey No 434/1,3<br />
            Plot No 12/B Amar CO OP.HO Society<br />
            Gadhechi Road, Bhavnagar-364001<br />
            Gujarat India
          </address>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="info-section">
        <h2 className="info-heading">Contact Information</h2>
        <div className="info-content">
          <div className="contact-item">
            <div className="contact-item-header">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="contact-label">Phone:</span>
            </div>
            <a href="tel:+15551234567" className="contact-link">
              +91 8320431691
            </a>
          </div>
          <div className="contact-item">
            <div className="contact-item-header">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="contact-label">Email:</span>
            </div>
            <a href="mailto:info@aashumarine.com" className="contact-link">
              aashu.marines@gmail.com
            </a>
          </div>
          <div className="contact-item">
            <div className="contact-item-header">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="contact-label">Support:</span>
            </div>
            <a href="mailto:support@aashumarine.com" className="contact-link">
              info.aashumarine@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
