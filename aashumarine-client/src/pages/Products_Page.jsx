import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero_Section from '../components/layout/Hero_Section';
import Section_Container from '../components/layout/Section_Container';
import Product_Card from '../components/cards/Product_Card';
import FilterPanel from '../components/FilterPanel';
import Footer from '../components/layout/Footer';
import { navItems } from '../data/dummyData';
import { productApi } from '../services/productApi';
import './Products_Page.css';

const Products_Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    manufacturer: '',
    page: 1,
    limit: 50
  });
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Fetch categories and manufacturers on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, manufacturersData] = await Promise.all([
          productApi.getCategories(),
          productApi.getManufacturers()
        ]);
        setCategories(categoriesData.categories || []);
        setManufacturers(manufacturersData.manufacturers || []);
      } catch (err) {
        console.error('Failed to fetch filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.getAll(filters);
        console.log("ProductData ---> ", data.products)
        setProducts(data.products || []);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message || 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCategoryChange = (value) => {
    handleFilterChange('category', value);
  };

  const handleManufacturerChange = (value) => {
    handleFilterChange('manufacturer', value);
  };

  const handleResetFilters = () => {
    setFilters(prev => ({ ...prev, category: '', manufacturer: '', page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-pagme">
      {/* Skip navigation link for keyboard accessibility */}
      {/* <a href="#main-content" className="skip-link">Skip to main content</a> */}
      
      {/* Navbar section */}
      <Navbar navItems={navItems} />
      
      {/* Hero section */}
      <Hero_Section 
        heading="OUR PRODUCTS"
        subheading="Browse our complete catalog of marine equipment and machinery"
        BGimageNumber={3}
      />
      
      {/* Main content wrapper */}
      <main id="main-content">
        <Section_Container heading="Product Catalog">
          {/* Filter Panel */}
          <FilterPanel
            categories={categories}
            manufacturers={manufacturers}
            selectedCategory={filters.category}
            selectedManufacturer={filters.manufacturer}
            onCategoryChange={handleCategoryChange}
            onManufacturerChange={handleManufacturerChange}
            onReset={handleResetFilters}
          />

          {/* Search Input */}
          <div className="products-search">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
              aria-label="Search products"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container" role="status" aria-live="polite">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container" role="alert">
              <p className="error-message">{error}</p>
              <button onClick={() => setFilters({ ...filters })} className="retry-button">
                Retry
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="no-products">
                  <p>No products found matching your criteria.</p>
                </div>
              ) : (
                <>
                  <div className="cards-grid">
                    {products.map((product) => (
                      <Link 
                        to={`/products/${product.id}`} 
                        key={product.id}
                        aria-label={`View details for ${product.product_name}`}
                      >
                        <Product_Card
                          imageUrl={product.thumbnailUrl || product.imageUrl}
                          name={product.product_name}
                          engineType={product.category}
                          manufacturer={product.manufacturer}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="pagination-button"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      <span className="pagination-info">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="pagination-button"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Section_Container>
      </main>
      
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Products_Page;
