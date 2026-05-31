/**
 * ProductsPage Component
 * 
 * Admin page for managing products.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1-8.7, 9.1-9.10, 10.1-10.8, 11.1-11.8, 12.1-12.5
 */

import { useState, useEffect } from 'react';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProductForm } from '../components/forms/ProductForm';
import { productService } from '../services/productService';
import { useToast } from '../hooks/useToast';
import './ProductsPage.css';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: '',
    manufacturer: '',
    condition: '',
    is_active: undefined,
    sort_by: '',
    sort_order: 'asc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingProductId, setTogglingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const { showToast } = useToast();

  // Load categories and manufacturers for filters
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesData, manufacturersData] = await Promise.all([
          productService.getCategories(),
          productService.getManufacturers(),
        ]);
        setCategories(categoriesData.categories);
        setManufacturers(manufacturersData.manufacturers);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };
    loadOptions();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getAll(filters);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      showToast(error.message || 'Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await productService.create(data);
      showToast('Product created successfully', 'success');
      setShowCreateModal(false);
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Failed to create product', 'error');
      throw error;
    }
  };

  const handleEdit = async (product) => {
    try {
      const fullProduct = await productService.getById(product.id);
      setEditingProduct(fullProduct);
    } catch (error) {
      showToast(error.message || 'Failed to load product details', 'error');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await productService.update(editingProduct.id, data);
      showToast('Product updated successfully', 'success');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Failed to update product', 'error');
      throw error;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.delete(deletingProduct.id);
      showToast('Product deleted successfully', 'success');
      setDeletingProduct(null);
      fetchProducts();
      console.log(products)
    } catch (error) {
      showToast(error.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (product) => {
    setTogglingProductId(product.id);
    try {
      await productService.update(product.id, {
        is_active: !product.is_active,
      });
      showToast(`Product ${!product.is_active ? 'activated' : 'deactivated'} successfully`, 'success');
      fetchProducts();
    } catch (error) {
      showToast(error.message || 'Failed to update product status', 'error');
    } finally {
      setTogglingProductId(null);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (column, order) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: column,
      sort_order: order,
    }));
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value, row) => {
        const imageSrc = row.imageUrl || value;
        const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;
        
        return (
          <img
            src={imageSrc || placeholderSvg}
            alt={row.product_name}
            className="product-thumbnail"
            onError={(e) => {
              e.target.src = placeholderSvg;
            }}
          />
        );
      },
    },
    {
      key: 'product_name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'manufacturer',
      label: 'Manufacturer',
      sortable: true,
    },
    {
      key: 'condition',
      label: 'Condition',
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => (value ? `$${value.toFixed(2)}` : '-'),
    },
    {
      key: 'stock_quantity',
      label: 'Stock',
      render: (value) => value || 0,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value, row) => (
        <button
          className={`status-toggle ${value ? 'active' : 'inactive'}`}
          onClick={() => handleToggleActive(row)}
          disabled={togglingProductId === row.id}
          aria-label={`Toggle product status (currently ${value ? 'active' : 'inactive'})`}
        >
          {togglingProductId === row.id ? 'Updating...' : (value ? 'Active' : 'Inactive')}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button size="small" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button size="small" variant="danger" onClick={() => setDeletingProduct(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="products-page">
      <header className="page-header">
        <h1>Products</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create Product</Button>
      </header>

      <section className="filters-section" aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="visually-hidden">Filter Products</h2>
        <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            aria-label="Search products by name or keywords"
          />

          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.manufacturer}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
            aria-label="Filter by manufacturer"
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map((mfr) => (
              <option key={mfr} value={mfr}>
                {mfr}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            aria-label="Filter by condition"
          >
            <option value="">All Conditions</option>
            <option value="New">New</option>
            <option value="Refurbished">Refurbished</option>
            <option value="Used">Used</option>
          </select>

          <select
            className="filter-select"
            value={filters.is_active === undefined ? '' : filters.is_active.toString()}
            onChange={(e) =>
              handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')
            }
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </section>

      <section aria-labelledby="products-table-heading">
        <h2 id="products-table-heading" className="visually-hidden">Products List</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={products}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            isLoading={isLoading}
            emptyMessage="No products found"
          />
        )}
      </section>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Product"
        size="large"
      >
        <ProductForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
        size="large"
      >
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.product_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ProductsPage;
