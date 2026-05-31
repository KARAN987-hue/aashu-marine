/**
 * QuotesPage Component
 * 
 * Admin page for managing quote requests.
 * 
 * Requirements: 24.1-24.7, 25.1-25.4, 26.1-26.3, 27.1-27.6, 28.1-28.6
 */

import { useState, useEffect } from 'react';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { quoteService } from '../services/quoteService';
import { useToast } from '../hooks/useToast';
import './QuotesPage.css';

export function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
    sort_by: '',
    sort_order: 'asc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [deletingQuote, setDeletingQuote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusQuoteId, setUpdatingStatusQuoteId] = useState(null);
  const { showToast } = useToast();

  // Fetch quotes when filters change
  useEffect(() => {
    fetchQuotes();
  }, [filters]);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await quoteService.getAll(filters);
      setQuotes(response.quotes);
      setPagination(response.pagination);
    } catch (error) {
      showToast(error.message || 'Failed to load quotes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (quote) => {
    try {
      const fullQuote = await quoteService.getById(quote.id);
      setViewingQuote(fullQuote);
    } catch (error) {
      showToast(error.message || 'Failed to load quote details', 'error');
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    setUpdatingStatusQuoteId(quoteId);
    try {
      await quoteService.updateStatus(quoteId, newStatus);
      showToast('Quote status updated successfully', 'success');
      fetchQuotes();
    } catch (error) {
      showToast(error.message || 'Failed to update quote status', 'error');
    } finally {
      setUpdatingStatusQuoteId(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await quoteService.delete(deletingQuote.id);
      showToast('Quote deleted successfully', 'success');
      setDeletingQuote(null);
      fetchQuotes();
    } catch (error) {
      showToast(error.message || 'Failed to delete quote', 'error');
    } finally {
      setIsDeleting(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      new: 'status-badge-new',
      quoted: 'status-badge-quoted',
      converted: 'status-badge-converted',
      closed: 'status-badge-closed',
    };
    return statusClasses[status] || '';
  };

  const columns = [
    {
      key: 'customer_name',
      label: 'Customer Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'product_name',
      label: 'Product',
      render: (value) => (
        <div className="product-name">
          {value || 'N/A'}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => (
        <select
          className={`status-dropdown ${getStatusBadgeClass(value)}`}
          value={value}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          disabled={updatingStatusQuoteId === row.id}
          aria-label={`Change status for ${row.customer_name}`}
        >
          <option value="new">New</option>
          <option value="quoted">Quoted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button size="small" onClick={() => handleViewDetails(row)}>
            View Details
          </Button>
          <Button size="small" variant="danger" onClick={() => setDeletingQuote(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="quotes-page">
      <header className="page-header">
        <h1>Quote Requests</h1>
      </header>

      <section className="filters-section" aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="visually-hidden">Filter Quote Requests</h2>
        <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by customer name or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            aria-label="Search quotes by customer name or email"
          />

          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </section>

      <section aria-labelledby="quotes-table-heading">
        <h2 id="quotes-table-heading" className="visually-hidden">Quote Requests List</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={quotes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            isLoading={isLoading}
            emptyMessage="No quotes found"
          />
        )}
      </section>

      <Modal
        isOpen={!!viewingQuote}
        onClose={() => setViewingQuote(null)}
        title="Quote Request Details"
        size="medium"
      >
        {viewingQuote && (
          <div className="quote-details">
            <div className="detail-row">
              <span className="detail-label">Customer Name:</span>
              <span className="detail-value">{viewingQuote.customer_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{viewingQuote.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{viewingQuote.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Product:</span>
              <span className="detail-value">{viewingQuote.product_name || 'N/A'}</span>
            </div>
            {viewingQuote.product_id && (
              <div className="detail-row">
                <span className="detail-label">Product ID:</span>
                <span className="detail-value">#{viewingQuote.product_id}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Source:</span>
              <span className="detail-value">{viewingQuote.source}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${getStatusBadgeClass(viewingQuote.status)}`} role="status">
                {viewingQuote.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(viewingQuote.created_at)}</span>
            </div>
            <div className="detail-row detail-row-full">
              <span className="detail-label">Message:</span>
              <p className="detail-message">{viewingQuote.message}</p>
            </div>
            <div className="modal-actions">
              <Button onClick={() => setViewingQuote(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingQuote}
        title="Delete Quote Request"
        message={`Are you sure you want to delete the quote request from "${deletingQuote?.customer_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeletingQuote(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default QuotesPage;
