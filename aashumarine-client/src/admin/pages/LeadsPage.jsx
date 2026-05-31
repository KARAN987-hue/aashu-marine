/**
 * LeadsPage Component
 * 
 * Admin page for managing contact leads.
 * 
 * Requirements: 19.1-19.7, 20.1-20.4, 21.1-21.4, 22.1-22.6, 23.1-23.6
 */

import { useState, useEffect } from 'react';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { leadService } from '../services/leadService';
import { useToast } from '../hooks/useToast';
import './LeadsPage.css';

export function LeadsPage() {
  const [leads, setLeads] = useState([]);
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
  const [viewingLead, setViewingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusLeadId, setUpdatingStatusLeadId] = useState(null);
  const { showToast } = useToast();

  // Fetch leads when filters change
  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getAll(filters);
      setLeads(response.leads);
      setPagination(response.pagination);
    } catch (error) {
      showToast(error.message || 'Failed to load leads', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (lead) => {
    try {
      const fullLead = await leadService.getById(lead.id);
      setViewingLead(fullLead);
    } catch (error) {
      showToast(error.message || 'Failed to load lead details', 'error');
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingStatusLeadId(leadId);
    try {
      await leadService.updateStatus(leadId, newStatus);
      showToast('Lead status updated successfully', 'success');
      fetchLeads();
    } catch (error) {
      showToast(error.message || 'Failed to update lead status', 'error');
    } finally {
      setUpdatingStatusLeadId(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await leadService.delete(deletingLead.id);
      showToast('Lead deleted successfully', 'success');
      setDeletingLead(null);
      fetchLeads();
    } catch (error) {
      showToast(error.message || 'Failed to delete lead', 'error');
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
      contacted: 'status-badge-contacted',
      converted: 'status-badge-converted',
      closed: 'status-badge-closed',
    };
    return statusClasses[status] || '';
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <div className="message-preview">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
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
          disabled={updatingStatusLeadId === row.id}
          aria-label={`Change status for ${row.name}`}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
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
          <Button size="small" variant="danger" onClick={() => setDeletingLead(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="leads-page">
      <header className="page-header">
        <h1>Contact Leads</h1>
      </header>

      <section className="filters-section" aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="visually-hidden">Filter Contact Leads</h2>
        <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            aria-label="Search leads by name or email"
          />

          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </section>

      <section aria-labelledby="leads-table-heading">
        <h2 id="leads-table-heading" className="visually-hidden">Contact Leads List</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={leads}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            isLoading={isLoading}
            emptyMessage="No leads found"
          />
        )}
      </section>

      <Modal
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
        title="Lead Details"
        size="medium"
      >
        {viewingLead && (
          <div className="lead-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{viewingLead.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{viewingLead.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{viewingLead.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Source:</span>
              <span className="detail-value">{viewingLead.source}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${getStatusBadgeClass(viewingLead.status)}`} role="status">
                {viewingLead.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(viewingLead.created_at)}</span>
            </div>
            <div className="detail-row detail-row-full">
              <span className="detail-label">Message:</span>
              <p className="detail-message">{viewingLead.message}</p>
            </div>
            <div className="modal-actions">
              <Button onClick={() => setViewingLead(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingLead}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead from "${deletingLead?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeletingLead(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default LeadsPage;
