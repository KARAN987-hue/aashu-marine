import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import publicApi from '../services/publicApi';
import Product_Card from './cards/Product_Card';
import './RelatedProducts.css';

/**
 * RelatedProducts component displays related product recommendations
 * Features:
 * - Fetches related products based on engine type or manufacturer matching (Requirement 8.3)
 * - Displays 2-3 related products (Requirement 8.2)
 * - Uses simplified Product_Card with name, engine type, and manufacturer (Requirement 8.4)
 * - Handles click to navigate to selected product (Requirement 8.5)
 * - Accessible with proper heading hierarchy and link text
 * 
 * Validates: Requirements 8.2, 8.3, 8.4, 8.5
 */
const RelatedProducts = ({ productId, onProductClick }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await publicApi.getRelatedProducts(productId);
        // Limit to maximum 3 products (Requirement 8.2)
        const limitedProducts = (response.relatedProducts || []).slice(0, 3);
        setRelatedProducts(limitedProducts);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  const handleProductClick = (product) => {
    // Close lightbox and navigate to selected product (Requirement 8.5)
    if (onProductClick) {
      onProductClick();
    }
    navigate(`/products/${product.id}`);
  };

  // Don't render if no products or still loading
  if (loading || relatedProducts.length === 0) {
    return null;
  }

  if (error) {
    return null; // Silently fail - related products are optional
  }

  return (
    <div className="related-products">
      <h3 className="related-products__heading">Related Products</h3>
      <div className="related-products__grid">
        {relatedProducts.map((product) => {
          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProductClick(product);
                }
              }}
            >
              {/* Simplified Product_Card with only name, engine type, and manufacturer (Requirement 8.4) */}
              <Product_Card
                imageUrl={product.thumbnailUrl || product.thumbnailUrls?.[0] || product.imageUrl || product.imageUrls?.[0]}
                name={product.product_name}
                engineType={product.category}
                manufacturer={product.manufacturer}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

RelatedProducts.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onProductClick: PropTypes.func
};

export default RelatedProducts;
