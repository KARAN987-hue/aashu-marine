import LoadingSpinner from './LoadingSpinner';
import './StatCard.css';

export function StatCard({ title, value, icon, isLoading = false, onClick }) {
  if (isLoading) {
    return (
      <div className="stat-card">
        <div className="stat-card-loading">
          <LoadingSpinner size="small" />
        </div>
      </div>
    );
  }

  const cardContent = (
    <>
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
      <div className="stat-card-value">{value}</div>
    </>
  );

  if (onClick) {
    return (
      <button
        className="stat-card stat-card-clickable"
        onClick={onClick}
        aria-label={`View ${title}`}
        type="button"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className="stat-card">
      {cardContent}
    </div>
  );
}
