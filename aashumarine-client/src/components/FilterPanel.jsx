import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './FilterPanel.css';

/**
 * FilterPanel Component
 * 
 * Provides filtering controls for product listing with:
 * - Engine type (category) filter
 * - Manufacturer filter
 * - Debounced filter application (300ms)
 * - Clear/reset functionality
 * - Active filter count badge
 * - Collapsible on mobile viewports
 * - URL query parameter synchronization
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**
 */
const FilterPanel = ({
  categories = [],
  manufacturers = [],
  selectedCategory = '',
  selectedManufacturer = '',
  onCategoryChange,
  onManufacturerChange,
  onReset
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use ref for debounce timer to avoid stale closures
  const debounceTimerRef = useRef(null);

  // Check if mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync URL parameters with filter state on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const manufacturerParam = searchParams.get('manufacturer');

    if (categoryParam && categoryParam !== selectedCategory) {
      onCategoryChange(categoryParam);
    }
    if (manufacturerParam && manufacturerParam !== selectedManufacturer) {
      onManufacturerChange(manufacturerParam);
    }
  }, []); // Only run on mount

  // Update URL parameters when filters change
  const updateURLParams = useCallback((category, manufacturer) => {
    const newParams = new URLSearchParams(searchParams);

    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }

    if (manufacturer) {
      newParams.set('manufacturer', manufacturer);
    } else {
      newParams.delete('manufacturer');
    }

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Debounced filter change handler
  const handleFilterChange = useCallback((type, value) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for 300ms debounce
    debounceTimerRef.current = setTimeout(() => {
      if (type === 'category') {
        onCategoryChange(value);
        updateURLParams(value, selectedManufacturer);
      } else if (type === 'manufacturer') {
        onManufacturerChange(value);
        updateURLParams(selectedCategory, value);
      }
    }, 300);
  }, [onCategoryChange, onManufacturerChange, updateURLParams, selectedCategory, selectedManufacturer]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Calculate active filter count
  const activeFilterCount = [selectedCategory, selectedManufacturer].filter(Boolean).length;

  // Handle reset
  const handleReset = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onReset();
    updateURLParams('', '');
  };

  // Toggle collapse on mobile
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="filter-panel" role="region" aria-label="Product filters">
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="filter-panel-toggle"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-controls="filter-panel-content"
        >
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </span>
          )}
          <span className={`toggle-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {isCollapsed ? '▼' : '▲'}
          </span>
        </button>
      )}

      {/* Filter content */}
      <div
        id="filter-panel-content"
        className={`filter-panel-content ${isMobile && isCollapsed ? 'collapsed' : ''}`}
      >
        {/* Desktop filter count badge */}
        {!isMobile && activeFilterCount > 0 && (
          <div className="filter-count-badge">
            <span aria-live="polite">
              {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
            </span>
          </div>
        )}

        {/* Engine Type Filter */}
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Engine Type
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
            aria-label="Filter by engine type"
          >
            <option value="">All Engine Types</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Manufacturer Filter */}
        {/* Manufacturer Filter */}
        <div className="filter-group">
          <label htmlFor="manufacturer-filter" className="filter-label">
            Manufacturer
          </label>
          <input
            type="text"
            id="manufacturer-filter"
            value={selectedManufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
            className="filter-select"
            placeholder="Search by manufacturer"
            aria-label="Filter by manufacturer"
          />
        </div>


        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <button
            className="filter-reset-button"
            onClick={handleReset}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
