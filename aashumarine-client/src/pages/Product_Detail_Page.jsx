import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero_Section from '../components/layout/Hero_Section';
import Section_Container from '../components/layout/Section_Container';
import Quote_Request_Form from '../components/forms/Quote_Request_Form';
import Footer from '../components/layout/Footer';
import ProductGallery from '../components/ProductGallery';
import LightboxViewer from '../components/LightboxViewer';
import { navItems } from '../data/dummyData';
import RelatedProducts from '../components/RelatedProducts';
import { publicApi } from '../services/publicApi';
import { productApi } from '../services/productApi';
import './Product_Detail_Page.css';

/**
 * Product_Detail_Page component displays comprehensive information about a single product
 * Retrieves product data using ID from URL parameter
 */
const Product_Detail_Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitMessage, setSubmitMessage] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  // Extract product ID from URL parameter
  const { id } = useParams();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.getById(id);
        setProduct(data.product);
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError('notFound');
        } else {
          setError(err.message || 'Failed to load product. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle gallery image click to open lightbox
  const handleImageClick = (index) => {
    setLightboxInitialIndex(index);
    setLightboxOpen(true);
  };

  // Handle lightbox close
  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  // Normalize product images to array format for backward compatibility
  const getProductImages = () => {
    if (!product) return [];
    
    // If imageUrls exists and is an array, use it
    if (Array.isArray(product.imageUrls)) {
      return product.imageUrls;
    }
    
    // If imageUrl exists (single image), convert to array
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    
    // If image exists (legacy field), convert to array
    if (product.image) {
      return [product.image];
    }
    
    return [];
  };

  // Get thumbnail images for gallery display
  const getProductThumbnails = () => {
    if (!product) return [];
    
    // If thumbnailUrls exists and is an array, use it
    if (Array.isArray(product.thumbnailUrls) && product.thumbnailUrls.length > 0) {
      return product.thumbnailUrls;
    }
    
    // Fallback to full images if thumbnails not available (backward compatibility)
    return getProductImages();
  };
// -----------------------------------------------------------------------------------
// Add this function after getProductThumbnails() (around line 105)
// Replace getProductVideo() with this:
const getProductVideos = () => {
  if (!product) return [];
  
  // If videoUrls exists and is an array, return all videos
  if (Array.isArray(product.videoUrls) && product.videoUrls.length > 0) {
    return product.videoUrls;
  }
  
  // Fallback to single videoUrl if it exists
  if (product.videoUrl) {
    return [product.videoUrl];
  }
  
  return [];
};

// ----------------------------------------------------------------------------
  // Handle quote form submission
  const handleQuoteSubmit = async (quoteData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      await publicApi.submitQuote(quoteData);
      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your quote request has been submitted successfully. We will contact you soon.');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip navigation link for accessibility
  const skipLink = (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-page">
        {skipLink}
        <Navbar navItems={navItems} />
        <main id="main-content" className="loading-container" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Error handling for non-existent product ID or other errors
  if (error === 'notFound' || !product) {
    return (
      <div className="product-detail-page">
        {skipLink}
        <Navbar navItems={navItems} />
        <main id="main-content" className="error-container">
          <h1>Product Not Found</h1>
          <p>The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link to="/products" className="back-link">
            View All Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state for other errors
  if (error) {
    return (
      <div className="product-detail-page">
        {skipLink}
        <Navbar navItems={navItems} />
        <main id="main-content" className="error-container" role="alert">
          <h1>Error Loading Product</h1>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
            <Link to="/products" className="back-link">
              View All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {skipLink}
      <Navbar navItems={navItems} />
      <Hero_Section 
      BGimageNumber={2}
        heading={product.product_name} 
        subheading={product.category} 
      />
      <main id="main-content">
        <Section_Container>
          <div className="product-detail-layout">
            <div className="product-detail-left-column">
              <ProductGallery 
                images={getProductThumbnails()}
                videos={getProductVideos()} 
                productName={product.product_name}
                onImageClick={handleImageClick}
              />
              {submitStatus && (
                <div 
                  className={`submit-message ${submitStatus}`}
                  role="alert"
                  aria-live="polite"
                >
                  {submitMessage}
                </div>
              )}
              <Quote_Request_Form 
                onSubmit={handleQuoteSubmit}
                productName={product.product_name}
                productId={product.id}
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="product-detail-info">
              <div className="product-detail-section">
                <h2>Product Information</h2>
                <dl>
                  {product.manufacturer && (
                    <>
                      <dt>Manufacturer</dt>
                      <dd>{product.manufacturer}</dd>
                    </>
                  )}
                  {product.model && (
                    <>
                      <dt>Model</dt>
                      <dd>{product.model}</dd>
                    </>
                  )}
                  {product.condition && (
                    <>
                      <dt>Condition</dt>
                      <dd>{product.condition}</dd>
                    </>
                  )}
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                  {product.product_type && (
                    <>
                      <dt>Product Type</dt>
                      <dd>{product.product_type}</dd>
                    </>
                  )}
                </dl>
              </div>
              {product.main_description && (
                <div className="product-detail-section">
                  <h2>Description</h2>
                  <p>{product.main_description}</p>
                </div>
              )}
            </div>
          </div>
           {/* Related Products Section */}
          {product?.id && (
            <div className="related-products-section">
              <RelatedProducts productId={product.id} />
            </div>
          )}
        </Section_Container>
      </main>
      
      {/* Footer section */}
      <Footer />

      {/* Lightbox Viewer */}
      {/* <LightboxViewer
        images={getProductImages()}
        initialIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        productName={product?.product_name || ''}
        // productId={product?.id}
      /> */}
    </div>
  );
};

export default Product_Detail_Page;
