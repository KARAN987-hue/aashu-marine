/**
 * SubscribersPage Component
 * 
 * Admin page for managing newsletter subscribers.
 * 
 * Requirements: 29.1-29.7, 30.1-30.4, 31.1-31.6
 */

import { useState, useEffect } from 'react';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { subscriberService } from '../services/subscriberService';
import { useToast } from '../hooks/useToast';
import './SubscribersPage.css';

export function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    is_active: null,
    sort_by: '',
    sort_order: 'asc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deletingSubscriber, setDeletingSubscriber] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingSubscriberId, setTogglingSubscriberId] = useState(null);
  const { showToast } = useToast();

  // Fetch subscribers when filters change
  useEffect(() => {
    fetchSubscribers();
  }, [filters]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await subscriberService.getAll(filters);
      setSubscribers(response.subscribers);
      setPagination(response.pagination);
    } catch (error) {
      showToast(error.message || 'Failed to load subscribers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (subscriber) => {
    setTogglingSubscriberId(subscriber.id);
    try {
      await subscriberService.toggleActive(subscriber.id);
      showToast('Subscriber status updated successfully', 'success');
      fetchSubscribers();
    } catch (error) {
      showToast(error.message || 'Failed to update subscriber status', 'error');
    } finally {
      setTogglingSubscriberId(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await subscriberService.delete(deletingSubscriber.id);
      showToast('Subscriber deleted successfully', 'success');
      setDeletingSubscriber(null);
      fetchSubscribers();
    } catch (error) {
      showToast(error.message || 'Failed to delete subscriber', 'error');
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

  const columns = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'subscribed_at',
      label: 'Subscription Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value, row) => (
        <button
          className={`status-toggle ${value ? 'status-active' : 'status-inactive'}`}
          onClick={() => handleToggleActive(row)}
          disabled={togglingSubscriberId === row.id}
          aria-label={`Toggle status for ${row.email}`}
        >
          {togglingSubscriberId === row.id ? 'Updating...' : (value ? 'Active' : 'Unsubscribed')}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button size="small" variant="danger" onClick={() => setDeletingSubscriber(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="subscribers-page">
      <header className="page-header">
        <h1>Newsletter Subscribers</h1>
      </header>

      <section className="filters-section" aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="visually-hidden">Filter Subscribers</h2>
        <div className="filter-row">
          <select
            className="filter-select"
            value={filters.is_active === null ? '' : filters.is_active.toString()}
            onChange={(e) => {
              const value = e.target.value === '' ? null : e.target.value === 'true';
              handleFilterChange('is_active', value);
            }}
            aria-label="Filter by subscription status"
          >
            <option value="">All Subscribers</option>
            <option value="true">Active</option>
            <option value="false">Unsubscribed</option>
          </select>
        </div>
      </section>

      <section aria-labelledby="subscribers-table-heading">
        <h2 id="subscribers-table-heading" className="visually-hidden">Subscribers List</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={subscribers}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            isLoading={isLoading}
            emptyMessage="No subscribers found"
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={!!deletingSubscriber}
        title="Delete Subscriber"
        message={`Are you sure you want to delete the subscriber "${deletingSubscriber?.email}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeletingSubscriber(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default SubscribersPage;
