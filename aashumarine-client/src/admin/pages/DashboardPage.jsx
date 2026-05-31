/**
 * DashboardPage Component
 * 
 * Admin dashboard showing overview statistics and recent activity.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/common/StatCard';
import { useToast } from '../hooks/useToast';
import { dashboardService } from '../services/dashboardService';
import './DashboardPage.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Statistics state
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Recent activity state
  const [recentLeads, setRecentLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState(null);

  const [recentQuotes, setRecentQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState(null);

  const [recentTestimonials, setRecentTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState(null);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fetch recent activity on mount
  useEffect(() => {
    fetchRecentLeads();
    fetchRecentQuotes();
    fetchRecentTestimonials();
  }, []);

  const fetchStatistics = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await dashboardService.getStatistics();
      setStatistics(data);
    } catch (error) {
      setStatsError(error.message || 'Failed to load statistics');
      showToast('Failed to load statistics', 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecentLeads = async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const data = await dashboardService.getRecentLeads();
      setRecentLeads(data);
    } catch (error) {
      setLeadsError(error.message || 'Failed to load recent leads');
      showToast('Failed to load recent leads', 'error');
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchRecentQuotes = async () => {
    setQuotesLoading(true);
    setQuotesError(null);
    try {
      const data = await dashboardService.getRecentQuotes();
      setRecentQuotes(data);
    } catch (error) {
      setQuotesError(error.message || 'Failed to load recent quotes');
      showToast('Failed to load recent quotes', 'error');
    } finally {
      setQuotesLoading(false);
    }
  };

  const fetchRecentTestimonials = async () => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const data = await dashboardService.getRecentTestimonials();
      setRecentTestimonials(data);
    } catch (error) {
      setTestimonialsError(error.message || 'Failed to load recent testimonials');
      showToast('Failed to load recent testimonials', 'error');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'status-badge status-new';
      case 'contacted':
      case 'quoted':
        return 'status-badge status-contacted';
      case 'converted':
        return 'status-badge status-converted';
      case 'closed':
        return 'status-badge status-closed';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
      </header>

      {/* Statistics Section */}
      <section className="dashboard-statistics" aria-labelledby="statistics-heading">
        <h2 id="statistics-heading" className="visually-hidden">Statistics Overview</h2>
        <StatCard
          title="Total Products"
          value={statistics?.totalProducts || 0}
          isLoading={statsLoading}
          onClick={() => navigate('/admin/products')}
        />
        <StatCard
          title="Pending Testimonials"
          value={statistics?.pendingTestimonials || 0}
          isLoading={statsLoading}
          onClick={() => navigate('/admin/testimonials?filter=pending')}
        />
        <StatCard
          title="New Leads"
          value={statistics?.newLeads || 0}
          isLoading={statsLoading}
          onClick={() => navigate('/admin/leads?filter=new')}
        />
        <StatCard
          title="New Quotes"
          value={statistics?.newQuotes || 0}
          isLoading={statsLoading}
          onClick={() => navigate('/admin/quotes?filter=new')}
        />
        <StatCard
          title="Active Subscribers"
          value={statistics?.activeSubscribers || 0}
          isLoading={statsLoading}
          onClick={() => navigate('/admin/subscribers')}
        />
      </section>

      {statsError && (
        <div className="dashboard-error" role="alert">
          <p>{statsError}</p>
          <button onClick={fetchStatistics} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Recent Activity Section */}
      <section className="dashboard-activity" aria-labelledby="activity-heading">
        <h2 id="activity-heading">Recent Activity</h2>

        <div className="activity-grid">
          {/* Recent Leads */}
          <article className="activity-card">
            <div className="activity-card-header">
              <h3>Recent Leads</h3>
              <button
                onClick={() => navigate('/admin/leads')}
                className="view-all-button"
                aria-label="View all leads"
              >
                View All
              </button>
            </div>
            <div className="activity-card-body">
              {leadsLoading ? (
                <div className="activity-loading" role="status" aria-live="polite">
                  Loading leads...
                </div>
              ) : leadsError ? (
                <div className="activity-error" role="alert">
                  <p>{leadsError}</p>
                  <button onClick={fetchRecentLeads} className="retry-button-small">
                    Retry
                  </button>
                </div>
              ) : recentLeads.length === 0 ? (
                <div className="activity-empty">No recent leads</div>
              ) : (
                <ul className="activity-list">
                  {recentLeads.map((lead) => (
                    <li key={lead.id} className="activity-item">
                      <div className="activity-item-header">
                        <strong>{lead.name}</strong>
                        <span className={getStatusBadgeClass(lead.status)} role="status">
                          {lead.status}
                        </span>
                      </div>
                      <div className="activity-item-content">
                        <p className="activity-item-text">{lead.message}</p>
                        <div className="activity-item-meta">
                          <span>{lead.email}</span>
                          <span className="activity-item-time">
                            {formatDate(lead.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="activity-item-actions">
                        <button
                          onClick={() => navigate('/admin/leads')}
                          className="action-button-small"
                          aria-label={`View details for lead from ${lead.name}`}
                        >
                          View Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>

          {/* Recent Quotes */}
          <article className="activity-card">
            <div className="activity-card-header">
              <h3>Recent Quotes</h3>
              <button
                onClick={() => navigate('/admin/quotes')}
                className="view-all-button"
                aria-label="View all quotes"
              >
                View All
              </button>
            </div>
            <div className="activity-card-body">
              {quotesLoading ? (
                <div className="activity-loading" role="status" aria-live="polite">
                  Loading quotes...
                </div>
              ) : quotesError ? (
                <div className="activity-error" role="alert">
                  <p>{quotesError}</p>
                  <button onClick={fetchRecentQuotes} className="retry-button-small">
                    Retry
                  </button>
                </div>
              ) : recentQuotes.length === 0 ? (
                <div className="activity-empty">No recent quotes</div>
              ) : (
                <ul className="activity-list">
                  {recentQuotes.map((quote) => (
                    <li key={quote.id} className="activity-item">
                      <div className="activity-item-header">
                        <strong>{quote.name || 'N/A'}</strong>
                        <span className={getStatusBadgeClass(quote.status)} role="status">
                          {quote.status}
                        </span>
                      </div>
                      <div className="activity-item-content">
                        <p className="activity-item-text">
                          Product: {quote.product_name || 'N/A'}
                        </p>
                        <p className="activity-item-text">{quote.message}</p>
                        <div className="activity-item-meta">
                          <span>{quote.email}</span>
                          <span className="activity-item-time">
                            {formatDate(quote.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="activity-item-actions">
                        <button
                          onClick={() => navigate('/admin/quotes')}
                          className="action-button-small"
                          aria-label={`View details for quote from ${quote.name || 'customer'}`}
                        >
                          View Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>

          {/* Recent Testimonials */}
          <article className="activity-card">
            <div className="activity-card-header">
              <h3>Recent Testimonials</h3>
              <button
                onClick={() => navigate('/admin/testimonials')}
                className="view-all-button"
                aria-label="View all testimonials"
              >
                View All
              </button>
            </div>
            <div className="activity-card-body">
              {testimonialsLoading ? (
                <div className="activity-loading" role="status" aria-live="polite">
                  Loading testimonials...
                </div>
              ) : testimonialsError ? (
                <div className="activity-error" role="alert">
                  <p>{testimonialsError}</p>
                  <button onClick={fetchRecentTestimonials} className="retry-button-small">
                    Retry
                  </button>
                </div>
              ) : recentTestimonials.length === 0 ? (
                <div className="activity-empty">No recent testimonials</div>
              ) : (
                <ul className="activity-list">
                  {recentTestimonials.map((testimonial) => (
                    <li key={testimonial.id} className="activity-item">
                      <div className="activity-item-header">
                        <strong>{testimonial.name}</strong>
                        <span className={testimonial.is_approved ? 'status-badge status-converted' : 'status-badge status-new'} role="status">
                          {testimonial.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <div className="activity-item-content">
                        <p className="activity-item-text">{testimonial.feedback}</p>
                        <div className="activity-item-meta">
                          <span>{testimonial.company}</span>
                          <span className="activity-rating" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                            {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                          </span>
                          <span className="activity-item-time">
                            {formatDate(testimonial.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="activity-item-actions">
                        <button
                          onClick={() => navigate('/admin/testimonials')}
                          className="action-button-small"
                          aria-label={`View details for testimonial from ${testimonial.name}`}
                        >
                          View Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
