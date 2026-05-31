import { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      question: 'What types of marine equipment do you offer?',
      answer: 'We offer a comprehensive range of marine equipment including navigation systems, safety gear, communication devices, anchoring equipment, and maintenance supplies. Our inventory is regularly updated to include the latest marine technology and equipment.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. Please contact us for specific shipping quotes and estimated delivery times for your location.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase for unused items in their original packaging. The item must be in resalable condition. Shipping costs for returns are the responsibility of the customer unless the item is defective or we made an error in your order.'
    },
    {
      question: 'Do you offer installation services?',
      answer: 'We provide installation guidance and support for all our products. For complex installations, we can recommend certified marine technicians in your area. Some products come with professional installation services available for an additional fee.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your shipment on the carrier\'s website. If you have any questions about your order status, please contact our customer support team.'
    },
    {
      question: 'Do you offer warranties on your products?',
      answer: 'Most of our products come with manufacturer warranties ranging from 1 to 5 years depending on the item. We also offer extended warranty options for select products. Warranty details are provided with each product listing and in the product documentation.'
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFAQ(index);
    }
  };

  return (
    <div className="faq-section">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          const faqId = `faq-${index}`;
          const answerId = `answer-${index}`;

          return (
            <div key={faqId} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-expanded={isExpanded}
                aria-controls={answerId}
                id={faqId}
              >
                <span className="question-text">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>
              <div
                id={answerId}
                className={`faq-answer ${isExpanded ? 'expanded' : ''}`}
                role="region"
                aria-labelledby={faqId}
                hidden={!isExpanded}
              >
                <p className="answer-text">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
