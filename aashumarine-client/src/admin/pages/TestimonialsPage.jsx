/**
 * TestimonialsPage Component
 * 
 * Admin page for managing testimonials.
 * 
 * Requirements: 13.1-13.7, 14.1-14.5, 15.1-15.5, 16.1-16.8, 17.1-17.6
 */

import { useState, useEffect } from 'react';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TestimonialForm } from '../components/forms/TestimonialForm';
import { testimonialService } from '../services/testimonialService';
import { useToast } from '../hooks/useToast';
import './TestimonialsPage.css';

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    is_approved: null,
    sort_by: '',
    sort_order: 'asc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingTestimonialId, setTogglingTestimonialId] = useState(null);
  const { showToast } = useToast();

  // Fetch testimonials when filters change
  useEffect(() => {
    fetchTestimonials();
  }, [filters]);

  // const fetchTestimonials = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await testimonialService.getAll(filters);
  //     setTestimonials(response.testimonials);
  //     setPagination(response.pagination);
  //   } catch (error) {
  //     showToast(error.message || 'Failed to load testimonials', 'error');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const fetchTestimonials = async () => {
  setIsLoading(true);

  try {
    const params = { ...filters };

    // Remove filter if "All Status"
    if (params.is_approved === null) {
      delete params.is_approved;
    }

    const response = await testimonialService.getAll(params);

    setTestimonials(response.testimonials);
    setPagination(response.pagination);
  } catch (error) {
    showToast(error.message || 'Failed to load testimonials', 'error');
  } finally {
    setIsLoading(false);
  }
};

  const handleCreate = async (data) => {
    try {
      await testimonialService.create(data);
      showToast('Testimonial created successfully', 'success');
      setShowCreateModal(false);
      fetchTestimonials();
    } catch (error) {
      showToast(error.message || 'Failed to create testimonial', 'error');
      throw error;
    }
  };

  const handleEdit = async (testimonial) => {
    try {
      const fullTestimonial = await testimonialService.getById(testimonial.id);
      setEditingTestimonial(fullTestimonial);
    } catch (error) {
      showToast(error.message || 'Failed to load testimonial details', 'error');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await testimonialService.update(editingTestimonial.id, data);
      showToast('Testimonial updated successfully', 'success');
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      showToast(error.message || 'Failed to update testimonial', 'error');
      throw error;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await testimonialService.delete(deletingTestimonial.id);
      showToast('Testimonial deleted successfully', 'success');
      setDeletingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      showToast(error.message || 'Failed to delete testimonial', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleApproval = async (testimonial) => {
    setTogglingTestimonialId(testimonial.id);
    try {
      if (!testimonial.is_approved) {
        await testimonialService.approve(testimonial.id);
        showToast('Testimonial approved successfully', 'success');
      } else {
        await testimonialService.update(testimonial.id, {
          ...testimonial,
          is_approved: false,
        });
        showToast('Testimonial unapproved successfully', 'success');
      }
      fetchTestimonials();
    } catch (error) {
      showToast(error.message || 'Failed to update testimonial approval status', 'error');
    } finally {
      setTogglingTestimonialId(null);
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
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="rating-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${rating >= star ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'company',
      label: 'Company',
      render: (value) => value || '-',
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => renderStars(value),
    },
    {
      key: 'is_approved',
      label: 'Status',
      render: (value, row) => (
        <button
          className={`status-toggle ${value ? 'approved' : 'pending'}`}
          onClick={() => handleToggleApproval(row)}
          disabled={togglingTestimonialId === row.id}
          aria-label={`Toggle approval status (currently ${value ? 'approved' : 'pending'})`}
        >
          {togglingTestimonialId === row.id ? 'Updating...' : (value ? 'Approved' : 'Pending')}
        </button>
      ),
    },
    {
      key: 'created_at',
      label: 'Submitted',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <Button size="small" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button size="small" variant="danger" onClick={() => setDeletingTestimonial(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="testimonials-page">
      <header className="page-header">
        <h1>Testimonials</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create Testimonial</Button>
      </header>

      <section className="filters-section" aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="visually-hidden">Filter Testimonials</h2>
        <div className="filter-row">
          <select
            className="filter-select"
            value={filters.is_approved === null ? '' : filters.is_approved.toString()}
            onChange={(e) =>
              handleFilterChange('is_approved', e.target.value === '' ? null : e.target.value === 'true')
            }
            aria-label="Filter by approval status"
          >
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </section>

      <section aria-labelledby="testimonials-table-heading">
        <h2 id="testimonials-table-heading" className="visually-hidden">Testimonials List</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={testimonials}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            isLoading={isLoading}
            emptyMessage="No testimonials found"
          />
        )}
      </section>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Testimonial"
        size="medium"
      >
        <TestimonialForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingTestimonial}
        onClose={() => setEditingTestimonial(null)}
        title="Edit Testimonial"
        size="medium"
      >
        <TestimonialForm
          initialData={editingTestimonial}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTestimonial(null)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingTestimonial}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deletingTestimonial?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeletingTestimonial(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default TestimonialsPage;
